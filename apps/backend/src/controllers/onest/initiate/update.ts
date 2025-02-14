import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	ONEST_BAP_MOCKSERVER_URL,
	logger,
	redis,
} from "../../../lib/utils";

import { v4 as uuidv4 } from "uuid";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { UPDATE_TARGET } from "../../../lib/utils/apiConstants";

export const initiateUpdateController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let { transactionId, update_target } = req.body;
		if (!update_target) {
			update_target = UPDATE_TARGET.FULFILLMENT_STATE;
		}
		const on_confirm = await redisFetchToServer(
			ON_ACTION_KEY.ON_CONFIRM,
			transactionId
		);

		const on_cancel = await redisFetchToServer(
			ON_ACTION_KEY.ON_CANCEL,
			transactionId
		);

		if (on_cancel) {
			logger.error(
				"on_cancel already exists for the given transaction_id",
				transactionId
			);
			return send_nack(res, ERROR_MESSAGES.CANCELLATION_IS_ALREADY_DONE);
		}

		if (!on_confirm) {
			logger.error(
				"on_confirm doesn't exist for the given transaction_id",
				transactionId
			);
			return send_nack(res, ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED);
		}
		return intializeRequest(res, next, on_confirm, update_target);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	update_target: string
) => {
	try {
		const { context } = transaction;
		const { transaction_id } = context;

		let updatedMessage = {};
		switch (update_target) {
			case UPDATE_TARGET.FULFILLMENT_STATE:
				updatedMessage = {
					state: {
						descriptor: {
							code: "OFFER_ACCEPTED",
						},
					},
				};
				break;
			case UPDATE_TARGET.CONTACT_AND_EMAIL:
				updatedMessage = {
					customer: {
						contact: {
							phone: "+91-9876543210",
							email: "abc@xyz.com",
						},
					},
				};
				break;
			default:
				updatedMessage = {
					state: {
						descriptor: {
							code: "OFFER_ACCEPTED",
						},
					},
				};
				break;
		}

		const update = {
			context: {
				...context,
				message_id: uuidv4(),
				timestamp: new Date().toISOString(),
				action: "update",
				bap_id: MOCKSERVER_ID,
				bap_uri: ONEST_BAP_MOCKSERVER_URL,
			},
			message: {
				update_target: "fulfillment",
				order: {
					id: transaction.message.order.id,
					fulfillments: [
						{
							id: transaction?.message?.order?.fulfillments[0].id,
							...updatedMessage,
						},
					],
				},
			},
		};
		await redis.set(`${transaction_id}-update-target`, update_target);
		await send_response(res, next, update, transaction_id, "update");
	} catch (error) {
		next(error);
	}
};
