import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	redis,
	ONEST_BAP_MOCKSERVER_URL,
	logger,
} from "../../../lib/utils";

import { v4 as uuidv4 } from "uuid";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const initiateStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;
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
		return intializeRequest(res, next, on_confirm);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any
) => {
	try {
		const { context } = transaction;
		const { transaction_id } = context;

		const status = {
			context: {
				...context,
				message_id: uuidv4(),
				timestamp: new Date().toISOString(),
				action: "status",
				bap_id: MOCKSERVER_ID,
				bap_uri: ONEST_BAP_MOCKSERVER_URL,
			},
			message: {
				order_id: transaction.message.order.id,
			},
		};

		await send_response(res, next, status, transaction_id, "status");
	} catch (error) {
		next(error);
	}
};
