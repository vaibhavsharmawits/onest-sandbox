import { NextFunction, Request, Response } from "express";
import {
	confirmItemTags,
	logger,
	redisFetchFromServer,
	responseBuilder,
	send_nack,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const confirmController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		confirmConsultationController(req, res, next);
	} catch (error) {
		logger.error(
			"confirmController: Error occurred for transaction_id",
			req.body.context?.transaction_id,
			error
		);
		return next(error);
	}
};

export const confirmConsultationController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			context,
			message: { order },
		} = req.body;

		const on_init = await redisFetchFromServer(
			ON_ACTION_KEY.ON_INIT,
			context?.transaction_id
		);

		if (on_init && on_init?.error) {
			logger.error(
				`confirmConsultationController: on_init error for transaction_id ${context?.transaction_id}`,
				on_init.error
			);
			return send_nack(
				res,
				on_init?.error?.message
					? on_init?.error?.message
					: ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED
			);
		}

		if (!on_init) {
			logger.error(
				`confirmConsultationController: on_init not found for transaction_id ${context?.transaction_id}`
			);
			return send_nack(res, ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED);
		}

		const { items } = order;

		const updatedItems = items.map((item: any) => {
			const updatedItem = {
				...item,
				tags: [...item.tags, ...confirmItemTags],
			};
			return updatedItem;
		});

		const ts = new Date();

		const updatedFulfillments = order?.fulfillments.map((ff: any) => {
			ff.state = {
				descriptor: {
					code: "APPLICATION_ACCEPTED",
				},
				updated_at: ts.toISOString(),
			};
			return ff;
		});

		const responseMessage = {
			order: {
				...order,
				fulfillments: updatedFulfillments,
				items: updatedItems,
				state: { ...order.state, updated_at: ts.toISOString() },
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_CONFIRM
					: `/${ON_ACTION_KEY.ON_CONFIRM}`
			}`,
			`${ON_ACTION_KEY.ON_CONFIRM}`,
			"onest"
		);
	} catch (error) {
		logger.error(
			"confirmConsultationController: Error occurred for transaction_id : ",
			req.body.context.transaction_id,
			error
		);
		next(error);
	}
};
