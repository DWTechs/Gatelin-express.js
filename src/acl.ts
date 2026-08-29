import { isArray, isObject, isSet } from "@dwtechs/checkard";
import { log } from "@dwtechs/winstan";
import type { Request, Response, NextFunction } from 'express';

interface AclCondition {
  field: string;
  op: string;
  value: string | number | boolean;
}

interface Acl {
  fields: Set<string> | null;
  conditions: AclCondition[];
}

const ALLOWED_OPS = new Set(["=", "!=", "<", ">", "<=", ">="]);
const MAX_CONDITIONS = 50;
const MAX_CONDITIONS_HEADER_BYTES = 16 * 1024;

/**
 * Middleware to extract and validate ACL headers injected by Gatelin.
 * Retrieves the field allow-list from the 'x-acl-fields' header (comma-separated) and
 * the query conditions from the 'x-acl-conditions' header (JSON array of
 * { field, op, value }).
 * Only validates the header shape (structure, size, allowed operators) since field
 * names are meaningless without a service's own entity metadata; each service is
 * responsible for checking returned fields/conditions against its own data model.
 * Stores the parsed result in res.locals.acl ({ fields, conditions }) for use by
 * subsequent middleware in the request pipeline.
 *
 * @param {Request} req - The Express request object containing ACL headers
 *                  (x-acl-fields and x-acl-conditions).
 * @param {Response} res - The Express response object where the parsed ACL will be
 *                   stored in res.locals.acl.
 * @param {NextFunction} next - The next middleware function in the Express.js
 *                       request-response cycle.
 *
 * @returns {void} Calls the next middleware function with an error if a header is
 *                 malformed, otherwise proceeds to the next middleware function.
 *
 */
function getAcl(req: Request, res: Response, next: NextFunction): void {
  const fieldsHeader = req.headers["x-acl-fields"];
  const conditionsHeader = req.headers["x-acl-conditions"];
  log.debug(() => `getAcl fields=${fieldsHeader} conditions=${conditionsHeader}`);

  if (Array.isArray(fieldsHeader))
    return void next({ status: 403, msg: "Duplicate x-acl-fields headers" });
  const fields = parseFields(fieldsHeader);

  if (Array.isArray(conditionsHeader))
    return void next({ status: 403, msg: "Duplicate x-acl-conditions headers" });
  let conditions: AclCondition[];
  try {
    conditions = parseConditions(conditionsHeader);
  } catch (err) {
    return void next({ status: 403, msg: (err as Error).message });
  }

  const acl: Acl = { fields, conditions };
  res.locals.acl = acl;

  next();
}

function parseFields(header: string | undefined): Set<string> | null {
  if (header === undefined) return null;
  return new Set(
    header
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean),
  );
}

function parseConditions(header: string | undefined): AclCondition[] {
  if (header === undefined) return [];
  if (Buffer.byteLength(header) > MAX_CONDITIONS_HEADER_BYTES)
    throw new Error("x-acl-conditions header is too large");

  let parsed: unknown;
  try {
    parsed = JSON.parse(header);
  } catch {
    throw new Error("Invalid x-acl-conditions JSON");
  }
  if (!isArray(parsed, "<=", MAX_CONDITIONS))
    throw new Error("Invalid ACL conditions");

  return parsed.map((condition) => {
    if (!isObject(condition))
      throw new Error("Invalid ACL condition");
    const { field, op, value } = condition as Record<string, unknown>;
    if (
      typeof field !== "string" ||
      !field ||
      !ALLOWED_OPS.has(op as string) ||
      value === null ||
      typeof value === "object"
    )
      throw new Error("Unsupported ACL condition");
    return { field, op, value } as AclCondition;
  });
}

/**
 * Middleware that strips fields not on the allow-list parsed by getAcl
 * (res.locals.acl.fields) from req.body.rows, keeping only "id" and allowed keys on
 * each row. This is the Gatelin-contract part of field-level ACL enforcement: it only
 * knows about the { rows: [...] } write-payload shape, not any particular entity/ORM,
 * so services still validate field names against their own data model before calling
 * this.
 * Requires getAcl to have run first so res.locals.acl.fields is populated; treated as
 * unrestricted (rows passed through unchanged) when absent.
 *
 * @param {Request} req - The Express request object. req.body.rows is filtered in
 *                  place when it is an array; left untouched otherwise.
 * @param {Response} res - The Express response object holding res.locals.acl.fields.
 * @param {NextFunction} next - The next middleware function in the Express.js
 *                       request-response cycle.
 *
 * @returns {void} Always proceeds to the next middleware function.
 */
function stripUnallowedFields(req: Request, res: Response, next: NextFunction): void {
  const fields = res.locals.acl?.fields;
  const rows = req.body?.rows;
  if (isSet(fields) && isArray(rows))
    req.body.rows = rows.map((row) => {
      if (!isObject(row)) return row;
      return Object.fromEntries(
        Object.entries(row).filter(([key]) => key === "id" || fields.has(key)),
      );
    });
  next();
}

export {
  getAcl,
  stripUnallowedFields,
};

export type {
  Acl,
  AclCondition,
};
