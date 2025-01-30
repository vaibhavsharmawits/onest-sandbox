import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	ONEST_BAP_MOCKSERVER_URL,
} from "../../../lib/utils";
import {
	ACTION_KEY,
	ON_ACTION_KEY,
} from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const initiateConfirmController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { scenario, transactionId } = req.body;
		const on_init = await redisFetchToServer(
			ON_ACTION_KEY.ON_INIT,
			transactionId
		);
		if (!on_init) {
			return send_nack(res, ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED);
		}
		return intializeRequest(res, next, on_init, scenario);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	scenario: string
) => {
	try {
		const {
			context,
			message: {
				order: { provider, items, fulfillments, quote, payments },
			},
		} = transaction;
		const { transaction_id } = context;
		const timestamp = new Date().toISOString();

		const updatedItems = items.map((item: any) => {
			delete item?.xinput;
			return item;
		});

		const updatedFulfillments = fulfillments.map((ff: any) => {
			ff.state = {
				descriptor: {
					code: "APPLICATION_SUBMITTED",
				},
				updated_at: timestamp,
			};
			delete ff.customer.person.tags;
			return ff;
		});

		const updatedPayments = payments.map((payment: any) => ({
			...payment,
			params: {
				amount: quote?.price?.value,
				currency: quote?.price?.currency,
				transaction_id: uuidv4(),
			},
			status: "PAID",
		}));

		const confirm = {
			context: {
				...context,
				timestamp: timestamp,
				action: ACTION_KEY.CONFIRM,
				bap_id: MOCKSERVER_ID,
				bap_uri: ONEST_BAP_MOCKSERVER_URL,
				message_id: uuidv4(),
			},
			message: {
				order: {
					status: "Created",
					id: uuidv4(),
					provider,
					items: updatedItems,
					fulfillments: updatedFulfillments,
					quote: quote,
					payments: updatedPayments,
				},
			},
		};

		console.log("confirm payload: ", JSON.stringify(confirm));

		await send_response(
			res,
			next,
			confirm,
			transaction_id,
			"confirm",
			(scenario = scenario)
		);
	} catch (error) {
		next(error);
	}
};
