import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import {
	ONEST_EXAMPLES_PATH,
	redisFetchFromServer,
	responseBuilder,
} from "../../../lib/utils";

export const onInitController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const on_search = await redisFetchFromServer(
			"on_search",
			req.body.context.transaction_id
		);
		const providersItems = on_search?.message?.catalog?.providers[0]?.items;

		return onInitConsultationController(req, res, next);
	} catch (error) {
		return next(error);
	}
};

const onInitConsultationController = (
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

		const ts = new Date();
		const distributorTags = [
			{
				descriptor: {
					code: "DISTRIBUTOR_DETAILS",
					name: "Distributor Details",
				},
				list: [
					{
						descriptor: {
							code: "DISTRIBUTOR_ID",
							name: "Distributor Id",
						},
						value: "PNB",
					},
					{
						descriptor: {
							code: "DISTRIBUTOR_NAME",
							name: "Distributor Name",
						},
						value: "Pay Near By",
					},
					{
						descriptor: {
							code: "DISTRIBUTOR_PHONE",
							name: "Distributor Phone",
						},
						value: "9123456789",
					},
					{
						descriptor: {
							code: "DISTRIBUTOR_EMAIL",
							name: "Distributor Email",
						},
						value: "support@pnb.com",
					},
					{
						descriptor: {
							code: "AGENT_ID",
							name: "Agent Id",
						},
						value: "agent-123",
					},
					{
						descriptor: {
							code: "AGENT_VERIFIED",
							name: "Agent Verified",
						},
						value: "true",
					},
				],
			},
		];

		const updatedItems = items.map((item: any) => {
			delete item?.xinput;
			return item;
		});

		const updatedFulfillments = fulfillments.map((ff: any) => {
			ff.state = {
				descriptor: {
					code: "APPLICATION_STARTED",
					name: "Application Started",
				},
				updated_at: ts.toISOString(),
			};
			ff.tags = distributorTags;
			return ff;
		});

		const responseMessage = {
			order: {
				status: "Created",
				id: uuidv4,
				provider,
				items: updatedItems,
				fulfillments: updatedFulfillments,
				quote: quote,
				payments: {
					...payments,
					params: {
						params: {
							amount: quote?.price?.value,
							currency: quote?.price?.currency,
							transaction_id: uuidv4,
						}
					},
					status: "PAID",
				},
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${context.bpp_uri}${
				context.bpp_uri.endsWith("/") ? "confirm" : "/confirm"
			}`,
			`confirm`,
			"onest"
		);
	} catch (error) {
		next(error);
	}
};
