import { NextFunction, Request, Response } from "express";
import { logger, redis } from "../lib/utils";

export const redisRetriever = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	try {
		if (req.headers["mode"] === "mock") {
			next();
			return;
		}
		const {
			context: { transaction_id, action },
		} = req.body;

		let ts = new Date().toISOString();

		if (action !== "status" && action !== "on_status") {
			await redis.set(
				`${transaction_id}-${action}-to-server`,
				JSON.stringify({
					request: req.body,
				})
			);
		} else {
			const transactionKeys = await redis.keys(`${transaction_id}-*`);
			const logIndex = transactionKeys.filter((e) =>
				e.includes(`${action}-to-server`)
			).length;

			await redis.set(
				`${transaction_id}-${logIndex}-${action}-to-server`,
				JSON.stringify({
					request: req.body,
				})
			);
		}
		next();
	} catch (error) {
		logger.error(
			`redisRetriever: Error processing transaction_id ${req.body?.context?.transaction_id}`,
			error
		);
		next(error);
	}
};
