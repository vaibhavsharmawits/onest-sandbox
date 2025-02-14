import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	redisFetchFromServer,
	send_nack,
	updateFulfillments,
	logger,
	actionRedisSaver,
} from "../../../lib/utils";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ORDER_STATUS } from "../../../lib/utils/apiConstants";

export const cancelController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await actionRedisSaver(req);
		const on_confirm = res.locals.on_confirm;
		if (on_confirm.message.order.id != req.body.message.order_id) {
			return send_nack(res, ERROR_MESSAGES.ORDER_ID_DOES_NOT_EXISTED);
		}

		cancelRequest(req, res, next, on_confirm);
	} catch (error) {
		return next(error);
	}
};

const cancelRequest = async (
	req: Request,
	res: Response,
	next: NextFunction,
	transaction: any
) => {
	try {
		const { context, message } = req.body;
		const ts = new Date();

		const updatedFulfillments = updateFulfillments(
			transaction.message.order.fulfillments,
			ON_ACTION_KEY?.ON_CANCEL,
			"onest",
			transaction.message.order.quote,
			ts
		);
		const updatedItems = transaction.message.order.items.map((itm: any) => {
			const npFeesTags = itm.tags.filter(
				(tag: any) => tag.descriptor.code === "NP_FEES"
			);

			return {
				...itm,
				fulfillment_ids: [...itm.fulfillment_ids, "C1"],
				time: {
					range: {
						start: "2023-01-03T13:23:01+00:00",
						end: "2023-02-03T13:23:01+00:00",
					},
				},
				tags: [
					...npFeesTags,
					{
						descriptor: {
							code: "CANCEL_REQUEST",
						},
						list: [
							{
								descriptor: {
									code: "REASON_ID",
								},
								value: `${message.cancellation_reason_id}`,
							},
							{
								descriptor: {
									code: "INITIATED_BY",
								},
								value: `${context.bap_id}`,
							},
						],
					},
				],
			};
		});
		const responseMessage = {
			order: {
				id: req.body.message.order_id,
				status: ORDER_STATUS.CANCELLED,
				provider: {
					...transaction.message.order.provider,
				},

				items: updatedItems,

				quote: {
					...transaction.message.order.quote,
					price: {
						...transaction.message.order.quote.price,
						value: "0.00",
					},
					breakup: transaction.message.order.quote.breakup.map((item: any) => ({
						...item,
						item: {
							...item.item,
							price: {
								...item.item.price,
								value: "0.00",
							},
						},
					})),
				},
				fulfillments: updatedFulfillments,
				payments: transaction.message.order.payments,
				updated_at: ts.toISOString(),
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_CANCEL
					: `/${ON_ACTION_KEY.ON_CANCEL}`
			}`,
			`${ON_ACTION_KEY.ON_CANCEL}`,
			"onest",
			ts
		);
	} catch (error) {
		logger.error(
			"cancelRequest: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);
		next(error);
	}
};
