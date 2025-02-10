import { Request, Response, NextFunction } from "express";
import { logger, redis, TransactionType } from ".";

export const onActionRedisSaver = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { context } = req.body;
		if (process.env.SUBSCRIBER_ID === context.bpp_id) {
			return next();
		}
		var id: number = 0;
		const action = context?.action;
		const ts = new Date();

		// Saving In Redis
		var log: TransactionType = {
			request: req.body,
		};
		log.response = {
			timestamp: new Date().toISOString(),
			response: {
				response: { message: { ack: { status: "ACK" } } },
			},
		};
		if (
			action === "on_status" ||
			action === "on_init" ||
			action === "on_update"
		) {
			const transactionKeys = await redis.keys(
				`*-${(req.body.context! as any).transaction_id}-*`
			);
			const logIndex = transactionKeys.filter((e) =>
				e.includes(`${action}-to-server`)
			).length;
			await redis.set(
				`${
					(req.body.context! as any).transaction_id
				}-${logIndex}-${action}-from-server-${id}-${ts.toISOString()}`,
				JSON.stringify(log)
			);
		} else {
			await redis.set(
				`${
					(req.body.context! as any).transaction_id
				}-${action}-from-server-${id}-${ts.toISOString()}`,
				JSON.stringify(log)
			);
		}
	} catch (error) {
		logger.error(
			"onActionRedisSaver: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);
		next(error);
	}
};
