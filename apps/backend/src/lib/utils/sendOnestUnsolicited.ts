	import axios from "axios";
	import { NextFunction, Response } from "express";
	import { v4 as uuidv4 } from "uuid";
	import { MOCKSERVER_ID, ONEST_BPP_MOCKSERVER_URL } from "./constants";
	import { createAuthHeader } from "./responseAuth";
	import { logger } from "./logger";
	import { TransactionType, redis } from "./redis";
	import { AxiosError } from "axios";
	import { ON_ACTION_KEY } from "./actionOnActionKeys";
	import { redisExistToServer } from "./redisFetch";

	export const sendOnestUnsolicited = async (
		res: Response,
		next: NextFunction,
		reqContext: object,
		message: object,
		uri: string,
		action: string,
		domain: "onest",
		ts?: Date,
		error?: object | undefined,
		id: number = 0,
	) => {
		logger.info(id);
		res.locals = {};

		ts = ts ?? new Date();
		// If order already cancelled, you cannot run STATUS or UPDATE
		if( action === ON_ACTION_KEY.ON_STATUS || action === ON_ACTION_KEY.ON_UPDATE ){
			
			const data = await redisExistToServer(ON_ACTION_KEY.ON_CANCEL, (reqContext as any).transaction_id);
		// If data is present send nack
		if (data) {
			logger.error(
				`Cannot Run Unsolicited ${action}. Cancellation Already Occured.`
			);
			return;
		}
		}
		const sandboxMode = res.getHeader("mode") === "sandbox";
		var async: { message: object; context?: object; error?: object } = {
			context: {},
			message,
		};

		const bppURI = ONEST_BPP_MOCKSERVER_URL;

		if (action.startsWith("on_")) {
			async = {
				...async,
				context: {
					...reqContext,
					bpp_id: MOCKSERVER_ID,
					bpp_uri: bppURI,
					timestamp: ts.toISOString(),
					action,
				},
			};
		} else {
			async = {
				...async,
				context: {
					...reqContext,
					bap_id: MOCKSERVER_ID,
					bap_uri: bppURI,
					timestamp: ts.toISOString(),
					message_id: uuidv4(),
					action,
				},
			};
		}
		const header = await createAuthHeader(async);

		// Saving In Redis
		if (sandboxMode) {
			if (action.startsWith("on_")) {
				var log: TransactionType = {
					request: async,
				};
				if (
					action === "on_status" ||
					action === "on_init" ||
					action === "on_update"
				) {
					const transactionKeys = await redis.keys(
						`*-${(async.context! as any).transaction_id}-*`
					);
					const logIndex = transactionKeys.filter((e) =>
						e.includes(`${action}-to-server`)
					).length;
					await redis.set(
						`${
							(async.context! as any).transaction_id
						}-${logIndex}-${action}-from-server-${id}-${ts.toISOString()}`,
						JSON.stringify(log)
					);
				} else {
					await redis.set(
						`${
							(async.context! as any).transaction_id
						}-${action}-from-server-${id}-${ts.toISOString()}`,
						JSON.stringify(log)
					);
				}
				try {
					const response = await axios.post(uri, async, {
						headers: {
							authorization: header,
						},
					});
					log.response = {
						timestamp: new Date().toISOString(),
						response: response.data,
					};

					await redis.set(
						`${
							(async.context! as any).transaction_id
						}-${action}-from-server-${id}-${ts.toISOString()}`,
						JSON.stringify(log)
					);
				} catch (error) {
					const response =
						error instanceof AxiosError
							? error?.response?.data
							: {
									message: {
										ack: {
											status: "NACK",
										},
									},
									error: {
										message: error,
									},
								};
					log.response = {
						timestamp: new Date().toISOString(),
						response: response,
					};
					const data = await redis.set(
						`${
							(async.context! as any).transaction_id
						}-${action}-from-server-${id}-${ts.toISOString()}`,
						JSON.stringify(log)
					);
					return next(error);
				}
			}
			logger.info({
				type: "response",
				action: action,
				transaction_id: (reqContext as any).transaction_id,
				message: { sync: { message: { ack: { status: "ACK" } } } },
			});
		} else {
			logger.info({
				type: "response",
				action: action,
				transaction_id: (reqContext as any).transaction_id,
				message: { sync: { message: { ack: { status: "ACK" } } } },
			});
		}
	};
