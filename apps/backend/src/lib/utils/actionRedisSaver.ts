import { Request } from "express";
import { logger, redis, TransactionType } from ".";

export const actionRedisSaver = async (req: Request) => {
	try {
		const { context } = req.body;
		if (process.env.SUBSCRIBER_ID === context.bap_id) {
			return;
		}
		var id: number = 0;
		const action = context?.action;
		const ts = new Date();

		// Saving In Redis
		var log: TransactionType = {
			request: req.body,
		};
		log.response = {
			timestamp: ts.toISOString(),
			response: {
				response: { message: { ack: { status: "ACK" } } },
			},
		};

		await redis.set(
			`${
				(req.body.context! as any).transaction_id
			}-${action}-from-server-${id}-${ts.toISOString()}`,
			JSON.stringify(log)
		);

		return;
	} catch (error) {
		logger.error(
			"actionRedisSaver: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);
		throw error;
	}
};
