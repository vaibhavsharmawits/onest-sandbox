import { NextFunction, Request, Response } from "express";
import { redis } from "../lib/utils";

export const redisRetriever = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	if (req.headers["mode"] === "mock") {
		next();
		return;
	}
	const {
		context: { transaction_id, action },
		_message,
	} = req.body;

	let ts = new Date().toISOString();

	if (action !== "status" && action !== "on_status") {
		console.log(
			"storing in redis",
			`${transaction_id}-${action}-to-server`,
			JSON.stringify({
				request: req.body,
			})
		);
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
};
