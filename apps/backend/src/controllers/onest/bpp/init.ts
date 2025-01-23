import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	send_nack,
	redisFetchFromServer,
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
			return send_nack(res, ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED);
		}

		return initConsultationController(req, res, next);
	} catch (error) {
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
				order: { provider, items, fulfillments, quote },
			},
		} = req.body;

		let ts = new Date();

		const xinput = {
			form: {
				mime_type: "text/html",
				resubmit: false,
				url: "https://6vs8xnx5i7.jobhub.co.in/loans-kyc/xinput/formid/a23f2fdfbbb8ac402bfd54f-1",
			},
			head: {
				descriptor: {
					name: "Application Form",
				},
				headings: ["Candidate Details"],
				index: {
					cur: 1,
					max: 2,
					min: 1,
				},
			},
			required: true,
		};

		const udpatedItems = items.map((itm: any) => {
			itm.tags = [...itm?.tags];
			itm.xinput = xinput;
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
		

		const payments = {
			url: "https://ondc.transaction.com/payment",
			status: "NOT-PAID",
			type: "ON-ORDER",
			collected_by: "BAP",
			tags: {
				descriptor: {
					code: "SETTLEMENT_DETAILS",
				},
				list: [
					{
						descriptor: {
							code: "SETTLEMENT_COUNTERPARTY",
						},
						value: "seller-app",
					},
					{
						descriptor: {
							code: "SETTLEMENT_PHASE",
						},
						value: "sale-amount",
					},
					{
						descriptor: {
							code: "SETTLEMENT_TYPE",
						},
						value: "upi",
					},
					{
						descriptor: {
							code: "UPI_ADDRESS",
						},
						value: "gft@oksbi",
					},
					{
						descriptor: {
							code: "SETTLEMENT_BANK_ACCOUNT_NO",
						},
						value: "XXXXXXXXXX",
					},
					{
						descriptor: {
							code: "SETTLEMENT_IFSC_CODE",
						},
						value: "XXXXXXXXX",
					},
					{
						descriptor: {
							code: "BENEFICIARY_NAME",
						},
						value: "xxxxx",
					},
					{
						descriptor: {
							code: "BANK_NAME",
						},
						value: "xxxx",
					},
					{
						descriptor: {
							code: "BRANCH_NAME",
						},
						value: "xxxx",
					},
				],
			},
		};

		const responseMessage = {
			order: {
				provider,
				items: udpatedItems,
				fulfillments:updatedFulfillments,
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
		next(error);
	}
};
