import { getAcl, stripUnallowedFields } from "../dist/gatelin-express.js";

function mockReq(headers = {}) {
  return { headers };
}

function mockRes() {
  return { locals: {} };
}

function mockNext() {
  return jest.fn();
}

// --- getAcl ---

describe("getAcl", () => {

  describe("no headers", () => {

    it("should call next() with no error and set fields to null and conditions to an empty array", () => {
      const req = mockReq({});
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.acl).toEqual({ fields: null, conditions: [] });
    });

  });

  describe("x-acl-fields", () => {

    it("should parse a comma-separated list into a Set", () => {
      const req = mockReq({ "x-acl-fields": "name, email,age" });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.acl.fields).toEqual(new Set(["name", "email", "age"]));
    });

    it("should parse an empty string into an empty Set (id-only)", () => {
      const req = mockReq({ "x-acl-fields": "" });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.acl.fields).toEqual(new Set());
    });

    it("should call next() with a 403 error when x-acl-fields is duplicated", () => {
      const req = mockReq({ "x-acl-fields": ["name", "email"] });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Duplicate x-acl-fields headers" });
      expect(res.locals.acl).toBeUndefined();
    });

  });

  describe("x-acl-conditions", () => {

    it("should parse a valid JSON array of conditions", () => {
      const conditions = [{ field: "archived", op: "=", value: false }];
      const req = mockReq({ "x-acl-conditions": JSON.stringify(conditions) });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.acl.conditions).toEqual(conditions);
    });

    it("should call next() with a 403 error when x-acl-conditions is duplicated", () => {
      const req = mockReq({ "x-acl-conditions": ["[]", "[]"] });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Duplicate x-acl-conditions headers" });
    });

    it("should call next() with a 403 error when x-acl-conditions is invalid JSON", () => {
      const req = mockReq({ "x-acl-conditions": "{not json" });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Invalid x-acl-conditions JSON" });
    });

    it("should call next() with a 403 error when x-acl-conditions is not an array", () => {
      const req = mockReq({ "x-acl-conditions": JSON.stringify({ field: "a", op: "=", value: 1 }) });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Invalid ACL conditions" });
    });

    it("should call next() with a 403 error when x-acl-conditions exceeds the max number of conditions", () => {
      const conditions = Array.from({ length: 51 }, (_, i) => ({ field: `f${i}`, op: "=", value: i }));
      const req = mockReq({ "x-acl-conditions": JSON.stringify(conditions) });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Invalid ACL conditions" });
    });

    it("should call next() with a 403 error when x-acl-conditions header is too large", () => {
      const req = mockReq({ "x-acl-conditions": "a".repeat(16 * 1024 + 1) });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "x-acl-conditions header is too large" });
    });

    it("should call next() with a 403 error when a condition is not an object", () => {
      const req = mockReq({ "x-acl-conditions": JSON.stringify(["not-an-object"]) });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Invalid ACL condition" });
    });

    it("should call next() with a 403 error when a condition uses an unsupported operator", () => {
      const req = mockReq({ "x-acl-conditions": JSON.stringify([{ field: "a", op: "LIKE", value: "b" }]) });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Unsupported ACL condition" });
    });

    it("should call next() with a 403 error when a condition value is an object", () => {
      const req = mockReq({ "x-acl-conditions": JSON.stringify([{ field: "a", op: "=", value: {} }]) });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Unsupported ACL condition" });
    });

    it("should call next() with a 403 error when a condition field is missing", () => {
      const req = mockReq({ "x-acl-conditions": JSON.stringify([{ op: "=", value: "b" }]) });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith({ status: 403, msg: "Unsupported ACL condition" });
    });

  });

  describe("both headers valid", () => {

    it("should call next() with no error and set both fields and conditions", () => {
      const req = mockReq({
        "x-acl-fields": "name",
        "x-acl-conditions": JSON.stringify([{ field: "userId", op: "=", value: 42 }]),
      });
      const res = mockRes();
      const next = mockNext();

      getAcl(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.locals.acl).toEqual({
        fields: new Set(["name"]),
        conditions: [{ field: "userId", op: "=", value: 42 }],
      });
    });

  });

});

// --- stripUnallowedFields ---

describe("stripUnallowedFields", () => {

  it("should call next() and leave req.body.rows untouched when acl.fields is null (unrestricted)", () => {
    const rows = [{ id: 1, name: "a", secret: "x" }];
    const req = { body: { rows } };
    const res = { locals: { acl: { fields: null } } };
    const next = mockNext();

    stripUnallowedFields(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.rows).toBe(rows);
  });

  it("should call next() and leave req.body untouched when res.locals.acl is absent", () => {
    const rows = [{ id: 1, name: "a", secret: "x" }];
    const req = { body: { rows } };
    const res = { locals: {} };
    const next = mockNext();

    stripUnallowedFields(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.rows).toBe(rows);
  });

  it("should call next() and leave req.body untouched when req.body.rows is not an array", () => {
    const req = { body: {} };
    const res = { locals: { acl: { fields: new Set(["name"]) } } };
    const next = mockNext();

    stripUnallowedFields(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.rows).toBeUndefined();
  });

  it("should keep only the allowed fields plus id", () => {
    const req = { body: { rows: [{ id: 1, name: "a", secret: "x" }] } };
    const res = { locals: { acl: { fields: new Set(["name"]) } } };
    const next = mockNext();

    stripUnallowedFields(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.rows).toEqual([{ id: 1, name: "a" }]);
  });

  it("should keep id even when fields is an empty Set (id-only)", () => {
    const req = { body: { rows: [{ id: 1, name: "a", secret: "x" }] } };
    const res = { locals: { acl: { fields: new Set() } } };
    const next = mockNext();

    stripUnallowedFields(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.rows).toEqual([{ id: 1 }]);
  });

  it("should leave non-object rows untouched", () => {
    const req = {
      body: { rows: [null, "not-an-object", [1, 2], { id: 2, name: "b" }] },
    };
    const res = { locals: { acl: { fields: new Set(["name"]) } } };
    const next = mockNext();

    stripUnallowedFields(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.body.rows).toEqual([
      null,
      "not-an-object",
      [1, 2],
      { id: 2, name: "b" },
    ]);
  });

});
