import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	redis,
	ONEST_BAP_MOCKSERVER_URL,
} from "../../../lib/utils";

import { v4 as uuidv4 } from "uuid";
import {
	AGRI_HEALTH_STATUS,
	BID_AUCTION_STATUS,
	EQUIPMENT_HIRING_STATUS,
	SERVICES_DOMAINS,
} from "../../../lib/utils/apiConstants";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

let senarios: string[] = EQUIPMENT_HIRING_STATUS;

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
		if (!on_confirm) {
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
				order: {
					id: transaction.message.order.id,
				},
			},
		};

		await send_response(res, next, status, transaction_id, "status");
	} catch (error) {
		next(error);
	}
};
