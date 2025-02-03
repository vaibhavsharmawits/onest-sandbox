import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	redisFetchFromServer,
	send_nack,
	checkSelectedItems,
	quoteCreatorOnest,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";

export const selectController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const on_search = await redisFetchFromServer(
			ON_ACTION_KEY.ON_SEARCH,
			req.body.context.transaction_id
		);

		if (!on_search) {
			return send_nack(res, ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED);
		}

		const providersItems = on_search?.message?.catalog?.providers[0];
		req.body.providersItems = providersItems;

		const checkItemExistInSearch = await checkSelectedItems(req.body);
		if (!checkItemExistInSearch) {
			return send_nack(res, ERROR_MESSAGES.SELECTED_ITEMS_DOES_NOT_EXISTED);
		}

		return selectConfirmController(req, res, next);
	} catch (error) {
		return next(error);
	}
};

const selectConfirmController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		console.log("confirmation");
		const { context, message, providersItems: provider } = req.body;
		const orderProvider = message.order.provider;
		const orderItems = message.order.items;

		const itemsAndNpFeesId = orderItems.map(
			(item: { id: string; tags: any }) => {
				const npFeesTag = item.tags.find(
					(tag: any) => tag.descriptor.code === "NP_FEES"
				);

				const npFeesId = npFeesTag?.list.find(
					(listItem: any) => listItem.code === "ID"
				)?.value;

				return {
					itemId: item.id,
					npFeesId: npFeesId || null,
				};
			}
		);

		const quoteItems = itemsAndNpFeesId.map(({ itemId, npFeesId }: any) => {
			const providerItem = provider?.items?.find(
				(item: any) => item.id === itemId
			);

			const npFeesList = providerItem?.tags.filter(
				(tag: any) =>
					tag.descriptor.code === "NP_FEES" &&
					tag.list.some(
						(item: { code: string; value: string }) =>
							item.code === "ID" && item.value === npFeesId
					)
			);

			const price = providerItem?.price;
			if (price && price.maximum_value) {
				delete price.maximum_value;
			}

			return {
				itemId,
				npFeesId,
				npFeesList,
				title: "item",
				price: providerItem?.price,
			};
		});

		message.order.items.forEach((itm: any) => {
			itm.fulfillment_ids = [provider?.fulfillments?.[0]?.id];
		});
		console.log("quoteItems", quoteItems);
		const responseMessage = {
			order: {
				provider: {
					...orderProvider,
				},
				fulfillments: [
					{
						id: provider?.fulfillments?.[0]?.id,
						type: provider?.fulfillments?.[0]?.type,
					},
				],
				items: [...message.order.items],
				quote: quoteCreatorOnest(quoteItems),
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_SELECT
					: `/${ON_ACTION_KEY.ON_SELECT}`
			}`,
			`${ON_ACTION_KEY.ON_SELECT}`,
			"onest"
		);
	} catch (error) {
		next(error);
	}
};
