
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
  const id = req.headers["x-consumer-id"];
  const nickname = req.headers["x-consumer-nickname"];
  log.debug(() => `getConsumer id=${id} nickname=${nickname}`);
  if (!isValidInteger(id, 1, 999999999, false))
    return next({ status: 400, msg: "Missing consumer Id" });
  if (!isStringOfLength(nickname, 5))
    return next({ status: 400, msg: "Missing consumer nickname" });
  
  // Store consumer info in res.locals for request-scoped access
  res.locals.consumer = { id: +id, nickname };
  
  next();
}


export {
  getConsumer,
};
