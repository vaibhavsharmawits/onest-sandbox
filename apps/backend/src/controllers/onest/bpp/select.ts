import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	redisFetchFromServer,
	send_nack,
	checkSelectedItems,
	quoteCreatorOnest,
	logger,
} from "../../../lib/utils";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";

export const selectController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transaction_id } = req.body.context;
		const on_search = res.locals.on_search;
		
		const providersItems = on_search?.message?.catalog?.providers[0];
		req.body.providersItems = providersItems;

		const checkItemExistInSearch = await checkSelectedItems(req.body);
		if (!checkItemExistInSearch) {
			logger.error(
				"Selected items do not exist for transaction_id",
				transaction_id
			);
			return send_nack(res, ERROR_MESSAGES.SELECTED_ITEMS_DOES_NOT_EXISTED);
		}

		return selectConfirmController(req, res, next);
	} catch (error) {
		logger.error("Error occured at select Controller", error);
		return next(error);
	}
};

const selectConfirmController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
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
		logger.error(
			"selectConfirmController: Error occurred",
			req.body.transaction_id,
			error
		);

		next(error);
	}
};
