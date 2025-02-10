import { NextFunction, Request, Response } from "express";
import { logger, onActionRedisSaver } from "../../../lib/utils";

export const onConfirmController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await onActionRedisSaver(req, res, next);
		return res.json({
			sync: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
		});
	} catch (error) {
		logger.error(
			"onConfirmController: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);
		return next(error);
	}
};
