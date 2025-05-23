import { NextFunction, Request, Response, Router } from "express";
import { logger } from "../lib/utils";

export const globalErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
	logger.error(`Error occured: ${err.stack}`);
	return res.status(500).send({
		async: {
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: JSON.stringify(err.message)
			},
		},
		sync: {
			message: {
				ack: {
					status: "ACK",
				},
			},
		},
	});
}

export const errorHandlingWrapper = (router: Router) => (req: Request, res: Response, next: NextFunction) => {
  try {
    router(req, res, next)
  } catch (error) {
    return next(error)
  }
}