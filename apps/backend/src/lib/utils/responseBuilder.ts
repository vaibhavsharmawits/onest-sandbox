import axios from "axios";
import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { MOCKSERVER_ID, ONEST_BPP_MOCKSERVER_URL } from "./constants";
import { createAuthHeader } from "./responseAuth";
import { logger } from "./logger";
import { TransactionType, redis } from "./redis";
import { AxiosError } from "axios";
import { ON_ACTION_KEY } from "./actionOnActionKeys";
import { FULFILLMENT_STATES } from "./apiConstants";

interface TagDescriptor {
	code: string;
}
	
interface TagList {
	descriptor: TagDescriptor;
	value: string;
}

interface Quantity {
	count: any;
	selected: {
		count: number;
	};
}

interface AddOn {
	id: string;
}

interface Tag {
	descriptor: TagDescriptor;
	list: TagList[];
}

interface Item {
	available_quantity: any;
	price: any;
	title: any;
	fulfillment_ids: string[];
	id: string;
	quantity: Quantity;
	add_ons: AddOn[];
	tags: Tag[];
}

export const responseBuilder = async (
	res: Response,
	next: NextFunction,
	reqContext: object,
	message: object,
	uri: string,
	action: string,
	domain: "onest",
	ts?: Date,
	error?: object | undefined,
	id: number = 0
) => {
	try {
		res.locals = {};

		ts = ts ?? new Date();
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

		if (error) {
			async = { ...async, error };
		}
		const header = await createAuthHeader(async);

		if (sandboxMode) {
			if (action.startsWith("on_")) {
				var log: TransactionType = {
					request: async,
				};
				if (action === "on_status") {
					const transactionKeys = await redis.keys(
						`*-${(async.context! as any).transaction_id}-*`
					);
					const logIndex = transactionKeys.filter((e) =>
						e.includes("on_status-to-server")
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
					await redis.set(
						`${
							(async.context! as any).transaction_id
						}-${action}-from-server-${id}-${ts.toISOString()}`,
						JSON.stringify(log)
					);
					logger.error(
						`Error processing action ${action} for transaction_id : ${
							(async.context! as any).transaction_id
						}: ${error}`
					);
					if (error instanceof AxiosError) {
						return res.status(error.status ? error.status : 500).json(response);
					}
					return next(error);
				}
			}

			logger.info({
				type: "response",
				action: action,
				transaction_id: (reqContext as any).transaction_id,
				message: { sync: { message: { ack: { status: "ACK" } } } },
			});
			return res.json({
				message: {
					ack: {
						status: "ACK",
					},
				},
			});
		} else {
			logger.info({
				type: "response",
				action: action,
				transaction_id: (reqContext as any).transaction_id,
				message: { sync: { message: { ack: { status: "ACK" } } } },
			});
			return res.json({
				sync: {
					message: {
						ack: {
							status: "ACK",
						},
					},
				},
				error,
				async,
			});
		}
	} catch (error: any) {
		logger.error(
			`Unexpected error in responseBuilder for action ${action} for transaction_id : ${
				(reqContext as any).transaction_id
			}: ${error}`
		);
		return next(error);
	}
};

//Function for check selected items are existed in onsearch or not
export const checkSelectedItems = async (data: any) => {
	try {
		const { context, message, providersItems } = data;
		const items = message?.order?.items;
		const providersItem = providersItems?.items;
		let matchingItem: any = null;

		items.forEach((item: any) => {
			if (item) {
				const selectedItem = item?.id;
				if (providersItem) {
					matchingItem = providersItem?.find(
						(secondItem: { id: string }) => secondItem.id === selectedItem
					);
				}
			}
		});

		return matchingItem;
	} catch (error: any) {
		logger.error(
			"Error occured in matching content for transaction_id : ",
			data?.context?.transaction_id,
			error
		);
	}
};

export const updateFulfillments = (
	fulfillments?: any,
	action?: string,
	domain?: string,
	quote?: any,
	ts?: Date
) => {
	ts = ts ?? new Date();
	try {
		const rangeStart = new Date().setHours(new Date().getHours() + 2);
		const rangeEnd = new Date().setHours(new Date().getHours() + 3);

		let updatedFulfillments: any = [];

		if (!fulfillments || fulfillments.length === 0) {
			return updatedFulfillments; // Return empty if fulfillments is not provided or empty
		}

		switch (action) {
			case ON_ACTION_KEY.ON_CANCEL:
				updatedFulfillments = fulfillments;
				const cancelFulfillment = {
					id: "C1",
					...quoteTrailCreatorOnest(quote.breakup),
				};
				updatedFulfillments = updatedFulfillments.map((fulfillment: any) => {
					const { customer, ...rest } = fulfillment;
					return {
						...rest,
						state: {
							...rest.state,
							descriptor: {
								code: FULFILLMENT_STATES.CANCELLED,
							},
							updated_at: ts.toISOString(),
						},
					};
				});
				updatedFulfillments.push(cancelFulfillment);
				break;
			case ON_ACTION_KEY.ON_UPDATE:
				updatedFulfillments = fulfillments.map((fulfillment: any) => {
					const { customer, ...rest } = fulfillment;
					return {
						...rest,
						state: {
							...rest.state,
							descriptor: {
								code: FULFILLMENT_STATES.COMPLETED,
							},
						},
					};
				});
				break;
			default:
				updatedFulfillments = fulfillments;
				break;
		}
		return updatedFulfillments;
	} catch (err) {
		logger.error("Error occured in fulfillments method", err);
	}
};

export const quoteTrailCreatorOnest = (breakup: any) => {
	return {
		tags: breakup.map(({ item }: any) => ({
			descriptor: { code: "QUOTE_TRAIL" },
			list: [
				{ descriptor: { code: "CURRENCY" }, value: item.price.currency },
				{
					descriptor: { code: "ID" },
					value: (item.id = item.id),
				},
				{
					descriptor: { code: "TYPE" },
					value: (item.id = item.title.toUpperCase()),
				},
				{ descriptor: { code: "VALUE" }, value: `-${item.price.value}` },
			],
		})),
	};
};

export const quoteCreatorOnest = (quoteItems: any) => {
	const quote: any = {
		price: {
			currency: "INR",
			value: "0", // Initial value, will be updated later
		},
		breakup: [],
		ttl: "P1D", // Default TTL of 1 day
	};

	// Iterate over quoteItems and process each one
	quoteItems.forEach((item: any) => {
		// Add item price to the total quote price
		quote.price.value = (
			parseFloat(quote.price.value) + parseFloat(item.price.value)
		).toFixed(2);

		// Process the item in the breakup array
		const itemBreakup: any = {
			item: {
				id: item.itemId,
				price: item.price,
				title: item.title,
			},
		};

		quote.breakup.push(itemBreakup);
	});

	return quote;
};
