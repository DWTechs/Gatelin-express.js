
import { isValidInteger, isStringOfLength } from "@dwtechs/checkard";
import { log } from "@dwtechs/winstan";
import type { Request, Response, NextFunction } from 'express';


/**
 * Middleware to extract and validate consumer information from request headers.
 * Retrieves consumer ID from 'x-consumer-id' header and consumer nickname from 'x-consumer-nickname' header.
 * Validates that the ID is a valid integer between 1 and 999999999, and the nickname has at least 5 characters.
 * Stores the validated consumer information in res.locals.consumer ({ id, nickname })
 * for use by subsequent middleware in the request pipeline.
 *
 * @param {Request} req - The Express request object containing consumer headers (x-consumer-id and x-consumer-nickname).
 * @param {Response} res - The Express response object where consumer data will be stored in res.locals.consumer.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 *
 * @returns {void} Calls the next middleware function with an error if consumer validation fails,
 *          otherwise proceeds to the next middleware function.
 * 
 */
function getConsumer(req: Request, res: Response, next: NextFunction): void {
  const numId = Number(req.headers["x-consumer-id"]);
  const nickname = req.headers["x-consumer-nickname"];
  log.debug(() => `getConsumer id=${numId} nickname=${nickname}`);
  if (!isValidInteger(numId, 1, 999999999, false)) {
    next({ status: 400, msg: "Missing consumer Id" });
    return;
  }
  if (!isStringOfLength(nickname, 5)) {
    next({ status: 400, msg: "Missing consumer nickname" });
    return;
  }
  
  // Store consumer info in res.locals for request-scoped access
  res.locals.consumer = { id: numId, nickname };
  
  next();
}


export {
  getConsumer,
};
