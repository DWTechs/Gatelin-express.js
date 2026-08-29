
import { isValidInteger, isStringOfLength } from "@dwtechs/checkard";
import { log } from "@dwtechs/winstan";
import type { Request, Response, NextFunction } from 'express';


/**
 * Middleware to extract and validate consumer information from request headers.
 * Retrieves consumer ID from 'x-consumer-user-id' header and consumer nickname from 'x-consumer-name' header.
 * Validates that the ID is a valid integer between 1 and 999999999, and the nickname is a string of 3 to 30 characters.
 * Stores the validated consumer information in res.locals.consumer ({ userId, nickname })
 * for use by subsequent middleware in the request pipeline.
 *
 * @param {Request} req - The Express request object containing consumer headers (x-consumer-user-id and x-consumer-name).
 * @param {Response} res - The Express response object where consumer data will be stored in res.locals.consumer.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 *
 * @returns {void} Calls the next middleware function with an error if consumer validation fails,
 *          otherwise proceeds to the next middleware function.
 * 
 */
function getConsumer(req: Request, res: Response, next: NextFunction): void {
  const userId = Number(req.headers["x-consumer-user-id"]);
  const nickname = req.headers["x-consumer-name"];
  log.debug(() => `getConsumer userId=${userId} nickname=${nickname}`);
  if (!isValidInteger(userId, 1, 999999999, false))
    return void next({ status: 400, msg: "Missing consumer Id" });
  if (!nickname)
    return void next({ status: 400, msg: "Missing consumer nickname" });
  if (!isStringOfLength(nickname, 3, 30))
    return void next({ status: 400, msg: "Invalid consumer nickname" });
  
  // Store consumer info in res.locals for request-scoped access
  res.locals.consumer = { userId, nickname };
  
  next();
}


export {
  getConsumer,
};
