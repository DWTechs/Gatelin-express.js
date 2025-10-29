
import { isValidNumber, isStringOfLength } from "@dwtechs/checkard";
import { log } from "@dwtechs/winstan";


/**
 *
 * @param {Request} req - The request object containing the decoded access token or user ID. Where the new tokens will be added
 * @param {Response} res - The response object where the new tokens will be added.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 *
 * @returns {Promise<void>} Calls the next middleware function with an error if the issuer is invalid,
 *          otherwise proceeds to the next middleware function.
 * 
 */
function getConsumer(req: Request, res: Response, next: NextFunction) {
  const id = +req.headers["x-consumer-id"];
  const name = req.headers["x-consumer-name"];
  log.debug(`getConsumer(id=${id}, name=${name})`);
  if (!isValidNumber(id, 1, 999999999, true))
    return next({ status: 400, msg: "Missing consumer Id" });
  if (!isStringOfLength(name, 5))
    return next({ status: 400, msg: "Missing consumer name" });
  req.consumerId = id;
  req.consumerName = name;
  next();
}


export {
  getConsumer,
};
