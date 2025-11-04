
import { isValidNumber, isStringOfLength } from "@dwtechs/checkard";
import { log } from "@dwtechs/winstan";
import type { Request, Response, NextFunction } from 'express';


/**
 * Middleware to extract and validate consumer information from request headers.
 * Retrieves consumer ID from 'x-consumer-id' header and consumer name from 'x-consumer-name' header.
 * Validates that the ID is a valid number between 1 and 999999999, and the name has at least 5 characters.
 * Stores the validated consumer information in res.locals.consumerId and res.locals.consumerName 
 * for use by subsequent middleware in the request pipeline.
 *
 * @param {Request} req - The Express request object containing consumer headers (x-consumer-id and x-consumer-name).
 * @param {Response} res - The Express response object where consumer data will be stored in res.locals.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 *
 * @returns {void} Calls the next middleware function with an error if consumer validation fails,
 *          otherwise proceeds to the next middleware function.
 * 
 */
function getConsumer(req: Request, res: Response, next: NextFunction): void {
  const id = req.headers["x-consumer-id"];
  const name = req.headers["x-consumer-name"];
  log.debug(`getConsumer(id=${id}, name=${name})`);
  if (!isValidNumber(id, 1, 999999999, false))
    return next({ status: 400, msg: "Missing consumer Id" });
  if (!isStringOfLength(name, 5))
    return next({ status: 400, msg: "Missing consumer name" });
  
  // Store consumer info in res.locals for request-scoped access
  res.locals.consumerId = +id;
  res.locals.consumerName = name;
  
  log.debug(`Consumer stored: id=${res.locals.consumerId}, name=${res.locals.consumerName}`);
  next();
}


export {
  getConsumer,
};
