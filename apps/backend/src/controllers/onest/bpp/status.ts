import { NextFunction, Request, Response } from "express";
import {
	FULFILLMENT_STATES,
	ORDER_STATUS,
} from "../../../lib/utils/apiConstants";
import {
	actionRedisSaver,
	logger,
	redisExistFromServer,
	redisFetchFromServer,
	responseBuilder,
	send_nack,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { sendOnestUnsolicited } from "../../../lib/utils/sendOnestUnsolicited";

export const statusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await actionRedisSaver(req);
		let scenario: string = String(req.query.scenario) || "";
		const { transaction_id } = req.body.context;
		const on_confirm_data = await redisFetchFromServer(
			ON_ACTION_KEY.ON_CONFIRM,
			transaction_id
		);

		const on_search_data = await redisFetchFromServer(
			ON_ACTION_KEY.ON_SEARCH,
			transaction_id
		);

		function fetchAllItemsWithTime(message: any) {
			const result: any = {};

			if (
				!message ||
				!message.catalog ||
				!Array.isArray(message.catalog.providers)
			) {
				return result;
			}

			for (const provider of message.catalog.providers) {
				if (Array.isArray(provider.items)) {
					for (const item of provider.items) {
						if (item.id && item.time) {
							const { range } = item.time;
							result[item.id] = { range };
						}
					}
				}
			}

			return result;
		}
		const itemsWithTimeRanges = fetchAllItemsWithTime(on_search_data?.message);

		if (!on_confirm_data) {
			logger.error(
				"on_confirm doesn't exist for the given transaction_id",
				transaction_id
			);
			return send_nack(res, ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED);
		}

		return statusRequest(
			req,
			res,
			next,
			on_confirm_data,
			scenario,
			itemsWithTimeRanges
		);
	} catch (error) {
		logger.error(
			`statusController: Error occurred for transaction_id: ${req.body.context.transaction_id}`,
			error
		);

		return next(error);
	}
};

const statusRequest = async (
	req: Request,
	res: Response,
	next: NextFunction,
	transaction: any,
	scenario: string,
	itemsWithTimeRanges: any
) => {
	try {
		const { context, message } = transaction;
		context.action = ON_ACTION_KEY.ON_STATUS;
		const domain = context?.domain;
		const on_status = await redisFetchFromServer(
			ON_ACTION_KEY.ON_STATUS,
			req.body.context.transaction_id
		);
		let next_status = scenario;

		const updatedItems = message.order.items.map((item: any) => {
			const range = itemsWithTimeRanges[item.id]?.range || null;
			const updatedItem = {
				...item,
				time: {
					range: range,
				},
				tags: [...item.tags],
			};
			return updatedItem;
		});

		const ts = new Date();
		scenario = scenario ? scenario : next_status;
		const updatedFulfillments = message.order.fulfillments.map(
			(fulfillment: any) => {
				const updatedFulfillment = {
					...fulfillment,
					id: fulfillment.id,
					state: {
						descriptor: {
							code: FULFILLMENT_STATES.APPLICATION_IN_PROGRESS,
						},
						updated_at: ts.toISOString(),
					},
				};

				if (updatedFulfillment.customer) {
					delete updatedFulfillment.customer;
				}

				return updatedFulfillment;
			}
		);

		const responseMessage: any = {
			order: {
				...message.order,
				items: updatedItems,
				id: message.order.id,
				status: ORDER_STATUS.ACTIVE,
				fulfillments: updatedFulfillments,
				state: {
					updated_at: ts.toISOString(),
				},
			},
		};

		// This sends unsolicited on_status calls.
		if (domain == "ONDC:ONEST10") {
			const updatedStatus = [
				FULFILLMENT_STATES.ASSESSMENT_IN_PROGRESS,
				FULFILLMENT_STATES.OFFER_EXTENDED,
			];
			updatedStatus.forEach((status, index) => {
				setTimeout(() => {
					const actionState =
						status === FULFILLMENT_STATES.OFFER_EXTENDED
							? ON_ACTION_KEY.ON_UPDATE
							: ON_ACTION_KEY.ON_STATUS;

					const ts = new Date();
					// Changes in On_Status Unsolicited.

					if (actionState === ON_ACTION_KEY.ON_UPDATE) {
						responseMessage.order.items = responseMessage.order.items.map(
							(item: any) => {
								delete item.time;
								return item;
							}
						);

						responseMessage.order.documents = [
							{
								url: "https://offer_letter_url",
								label: "offer_letter",
							},
						];
					}
					const updatedResponseMessage = {
						...responseMessage,
					};

					updatedResponseMessage.order.fulfillments[0].state.descriptor.code =
						status;
					updatedResponseMessage.order.fulfillments[0].state.updated_at =
						ts.toISOString();
					updatedResponseMessage.order.state.updated_at = ts.toISOString();
					logger.info(
						`Sending unsolicited ${actionState} (${status}) for transaction_id: ${context.transaction_id}`
					);

					sendOnestUnsolicited(
						res,
						next,
						req.body.context,
						updatedResponseMessage,
						`${req.body.context.bap_uri}${
							req.body.context.bap_uri.endsWith("/")
								? actionState
								: `/${actionState}`
						}`,
						`${actionState}`,
						"onest",
						ts,
						undefined,
						0
					);
				}, (index + 1) * 2000);
			});
		}

		// This sends standard on_status call.
		return responseBuilder(
			res,
			next,
			req.body.context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_STATUS
					: `/${ON_ACTION_KEY.ON_STATUS}`
			}`,
			`${ON_ACTION_KEY.ON_STATUS}`,
			"onest",
			ts
		);
	} catch (error) {
		logger.error(
			`statusRequest: Error occurred for transaction_id: ${req.body.context.transaction_id}`,
			error
		);
		next(error);
	}
};
