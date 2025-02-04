import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	send_nack,
	redisFetchFromServer,
	logger,
	initXinput,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const initController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transaction_id } = req.body.context;
		const on_search = await redisFetchFromServer(
			ON_ACTION_KEY.ON_SEARCH,
			transaction_id
		);
		if (!on_search) {
			logger.error(
				"on_search doesn't exist for the given transaction_id",
				transaction_id
			);
			return send_nack(res, ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED);
		}
		const providersItems = on_search?.message?.catalog?.providers[0]?.items;
		req.body.providersItems = providersItems;

		const on_select = await redisFetchFromServer(
			ON_ACTION_KEY.ON_SELECT,
			transaction_id
		);

		if (on_select && on_select?.error) {
			return send_nack(
				res,
				on_select?.error?.message
					? on_select?.error?.message
					: ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED
			);
		}
		if (!on_select) {
			logger.error(
				"on_select doesn't exist for the given transaction_id",
				transaction_id
			);
			return send_nack(res, ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED);
		}
		req.body.message.order.quote = on_select?.message?.order?.quote;

		return initConsultationController(req, res, next);
	} catch (error) {
		logger.error(
			`Error occured at init Controller for transaction_id : ${req.body.context.transaction_id}`,
			error
		);
		return next(error);
	}
};

const initConsultationController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			context,
			message: {
				order: { provider, items, fulfillments, quote, payments },
			},
		} = req.body;

		let ts = new Date();

		const udpatedItems = items.map((itm: any) => {
			itm.tags = [...itm?.tags];
			itm.xinput = initXinput;
			return itm;
		});

		const updatedFulfillments = fulfillments.map((ff: any) => {
			ff.state = {
				descriptor: {
					code: "APPLICATION_IN_PROGRESS",
				},
				updated_at: ts.toISOString(),
			};
			return ff;
		});

		const responseMessage = {
			order: {
				provider,
				items: udpatedItems,
				fulfillments: updatedFulfillments,
				quote,
				payments,
			},
		};

		delete req.body?.providersItems;
		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_INIT
					: `/${ON_ACTION_KEY.ON_INIT}`
			}`,
			`${ON_ACTION_KEY.ON_INIT}`,
			"onest"
		);
	} catch (error) {
		logger.error(
			"initConsultationController: Error occurred for transaction_id : ",
			req.body.context.transaction_id,
			error
		);
		next(error);
	}
};
