import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	logger,
	initXinput,
	initXinput2,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { sendOnestUnsolicited } from "../../../lib/utils/sendOnestUnsolicited";
import { FULFILLMENT_STATES } from "../../../lib/utils/apiConstants";
import { actionRedisSaver } from "../../../lib/utils/actionRedisSaver";

export const initController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await actionRedisSaver(req);
		const on_search = res.locals.on_search;
		const on_select = res.locals.on_select;

		const providersItems = on_search?.message?.catalog?.providers[0]?.items;
		req.body.providersItems = providersItems;

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
		const domain = context?.domain;
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

		// This sends unsolicited on_status calls.
		if (domain == "ONDC:ONEST10") {
			const updatedStatus = [
				FULFILLMENT_STATES.APPLICATION_IN_PROGRESS,
				FULFILLMENT_STATES.APPLICATION_FILLED,
			];
			updatedStatus.forEach((status, index) => {
				setTimeout(() => {
					const ts = new Date();
					const updatedResponseMessage = {
						...responseMessage,
					};
					updatedResponseMessage.order.items = responseMessage.order.items.map(
						(itm: any) => {
							itm.tags = [...itm?.tags];
							itm.xinput = initXinput2;
							if (status === FULFILLMENT_STATES.APPLICATION_FILLED) {
								delete itm.xinput;
							}
							return itm;
						}
					);
					updatedResponseMessage.order.fulfillments[0].state.descriptor.code =
						status;
					updatedResponseMessage.order.fulfillments[0].state.updated_at =
						ts.toISOString();
					logger.info(
						`Sending unsolicited on_init action calls for transaction_id: ${context.transaction_id}`
					);
					sendOnestUnsolicited(
						res,
						next,
						req.body.context,
						updatedResponseMessage,
						`${req.body.context.bap_uri}${
							req.body.context.bap_uri.endsWith("/")
								? ON_ACTION_KEY.ON_INIT
								: `/${ON_ACTION_KEY.ON_INIT}`
						}`,
						`${ON_ACTION_KEY.ON_INIT}`,
						"onest",
						ts,
						undefined,
						0
					);
				}, (index + 1) * 2000);
			});
		}

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
