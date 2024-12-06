import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	SERVICES_BAP_MOCKSERVER_URL,
	checkIfCustomized,
	send_response,
	send_nack,
	redisFetchToServer,
	Item,
	Category,
	Tag,
	TagItem,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
import { set, eq, isEmpty } from "lodash";
import _ from "lodash";
import { isBefore, addDays } from "date-fns";

export const initiateSelectController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;

		const on_search = await redisFetchToServer("on_search", transactionId);
		if (!on_search) {
			return send_nack(res, "On Search doesn't exist");
		}
		// selecting the senarios
		let scenario = "selection";
		return intializeRequest(req, res, next, on_search, scenario);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	req: Request,
	res: Response,
	next: NextFunction,
	transaction: any,
	scenario: string
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
		console.log("🚀 ~ items:", items[0])

		const select = {
			context: {
				...context,
				timestamp: new Date().toISOString(),
				action: "select",
				bap_id: MOCKSERVER_ID,
				bap_uri: SERVICES_BAP_MOCKSERVER_URL,
				message_id: uuidv4(),
			},
			message: {
				order: {
					provider: {
						"id": id,
					},
					items: [items[0]]
				},
			},
		};

		await send_response(res, next, select, transaction_id, "select");
		// const header = await createAuthHeader(select);
		// try {
		//   await redis.set(
		//     `${transaction_id}-select-from-server`,
		//     JSON.stringify({ request: { ...select } })
		//   );
		//   const response = await axios.post(`${context.bpp_uri}/select`, select, {
		//     headers: {
		//       "X-Gateway-Authorization": header,
		//       authorization: header,
		//     },
		//   });
		//   await redis.set(
		//     `${transaction_id}-select-from-server`,
		//     JSON.stringify({
		//       request: { ...select },
		//       response: {
		//         response: response.data,
		//         timestamp: new Date().toISOString(),
		//       },
		//     })
		//   );
		//   return res.json({
		//     message: {
		//       ack: {
		//         status: "ACK",
		//       },
		//     },
		//     transaction_id,
		//   });
		// } catch (error) {
		//   console.log("ERROR :::::::::::::", (error as any).response.data.error);
		//   return next(error);
		// }
	} catch (error) {
		return next(error);
	}
};

function processCategories(categories: Category[]) {
	// sort the mandatory parent_ids
	const cat_ids: string[] = categories?.reduce(
		(acc: string[], itm: Category) => {
			if (!("parent_category_id" in itm)) {
				const lis_selection = itm.tags?.find(
					(tag: Tag) => tag.descriptor?.code.toLowerCase() === "selection"
				);
				const mandatory = lis_selection?.list?.find(
					(ele: TagItem) => ele.descriptor?.code === "mandatory_selection"
				)?.value;
				if (mandatory) {
					acc.push(itm.id);
				}
			}
			return acc;
		},
		[]
	);
	// sort the categories
	const child_selected: string[] = [];
	categories.forEach((cat: Category) => {
		if ("parent_category_id" in cat) {
			if (
				cat.parent_category_id !== undefined &&
				cat_ids.includes(cat.parent_category_id)
			) {
				cat_ids.push(cat.id);
				child_selected.push(cat.id);
				if (cat_ids.indexOf(cat.parent_category_id) != -1) {
					cat_ids.splice(cat_ids.indexOf(cat.parent_category_id), 1);
				}
			}
		}
	});
	return { cat_ids, child_selected };
}
