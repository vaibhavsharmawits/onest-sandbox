import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	ONEST_BAP_MOCKSERVER_URL,
	redis,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export const initiateSelectController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;

		let search_type = await redis.get(
			`${transactionId}-search_type`
		);
		if (search_type === "search_inc") {
			return send_nack(res, "On Search doesn't exist");
		}

		const on_search = await redisFetchToServer("on_search", transactionId);
		if (!on_search) {
			return send_nack(res, "On Search doesn't exist");
		}

		return intializeRequest(req, res, next, on_search);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	req: Request,
	res: Response,
	next: NextFunction,
	transaction: any
) => {
	try {
		const {
			context,
			message: {
				catalog: { providers },
			},
		} = transaction;
		const { transaction_id } = context;
		const { id } = providers?.[0];
		let items = [];

		items = providers[0].items = providers?.[0]?.items.map(
			({ id, tags }: { id: string; tags: any[] }) => ({
				id,
				tags: tags
					.filter((tag: any) => tag.descriptor.code === "NP_FEES")
					.map(({ descriptor, list }) => ({
						descriptor,
						list: list.filter((item: any) => item.code === "ID"),
					})),
			})
		);

		const select = {
			context: {
				...context,
				timestamp: new Date().toISOString(),
				action: "select",
				bap_id: MOCKSERVER_ID,
				bap_uri: ONEST_BAP_MOCKSERVER_URL,
				message_id: uuidv4(),
			},
			message: {
				order: {
					provider: {
						id: id,
					},
					fulfillments: [{
						id: providers[0]?.fulfillments?.[0]?.id,
						type: providers[0]?.fulfillments?.[0]?.type,}
					],
					items: [
						{
							...items[0],
							tags: items[0]?.tags?.[0] ? [items[0]?.tags?.[0]] : null,
						},
					],
				},
			},
		};

		await send_response(res, next, select, transaction_id, "select");
	} catch (error) {
		return next(error);
	}
};
