import { NextFunction, Request, Response } from "express";
import {
	AGRI_HEALTHCARE_STATUS_OBJECT,
	FULFILLMENT_STATES,
	ORDER_STATUS,
} from "../../../lib/utils/apiConstants";
import {
	Fulfillment,
	Stop,
	redisExistFromServer,
	redisFetchFromServer,
	responseBuilder,
	send_nack,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const statusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
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
		console.log(JSON.stringify(itemsWithTimeRanges), "itemsWithTimeRanges");
		if (!on_confirm_data) {
			return send_nack(res, ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED);
		}

		const on_cancel_exist = await redisExistFromServer(
			ON_ACTION_KEY.ON_CANCEL,
			transaction_id
		);
		if (on_cancel_exist) {
			scenario = "cancel";
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

		const itemTags = [
			{
				descriptor: {
					code: "ACADEMIC_QUALIFICATIONS",
				},
				list: [
					{
						descriptor: {
							code: "COURSE_NAME",
						},
						value: "Class-X",
					},
					{
						descriptor: {
							code: "MIN_PERCENTAGE",
						},
						value: "60",
					},
					{
						descriptor: {
							code: "MANDATORY_ELIGIBILITY",
						},
						value: "true",
					},
				],
			},
			{
				descriptor: {
					code: "ACADEMIC_QUALIFICATIONS",
				},
				list: [
					{
						descriptor: {
							code: "COURSE_NAME",
						},
						value: "Class-XII",
					},
					{
						descriptor: {
							code: "MIN_PERCENTAGE",
						},
						value: "60",
					},
					{
						descriptor: {
							code: "MANDATORY_ELIGIBILITY",
						},
						value: "true",
					},
				],
			},
			{
				descriptor: {
					code: "ACADEMIC_QUALIFICATIONS",
				},
				list: [
					{
						descriptor: {
							code: "COURSE_LEVEL",
						},
						value: "Under Graduate",
					},
					{
						descriptor: {
							code: "MIN_PERCENTAGE",
						},
						value: "60",
					},
					{
						descriptor: {
							code: "MANDATORY_ELIGIBILITY",
						},
						value: "true",
					},
				],
			},
			{
				descriptor: {
					code: "ACADEMIC_QUALIFICATIONS",
				},
				list: [
					{
						descriptor: {
							code: "COURSE_LEVEL",
						},
						value: "Graduate",
					},
					{
						descriptor: {
							code: "MANDATORY_ELIGIBILITY",
						},
						value: "false",
					},
				],
			},
			{
				descriptor: {
					code: "JOB_REQUIREMENTS",
				},
				list: [
					{
						descriptor: {
							code: "REQ_EXPERIENCE",
						},
						value: "P2Y6M",
					},
					{
						descriptor: {
							code: "ADD_PROF_SKILL",
						},
						value: "android-development",
					},
					{
						descriptor: {
							code: "ADD_PROF_SKILL",
						},
						value: "dev-ops",
					},
				],
			},
			{
				descriptor: {
					code: "JOB_RESPONSIBILITIES",
				},
				list: [
					{
						descriptor: {
							code: "RESPONSIBILITY",
						},
						value:
							"Build frontend experiences for our tools (Web, PWA and React Native)",
					},
					{
						descriptor: {
							code: "RESPONSIBILITY",
						},
						value:
							"Articulate a long term technical direction and vision for building, maintaining, and scaling our web and mobile platforms",
					},
					{
						descriptor: {
							code: "RESPONSIBILITY",
						},
						value:
							"Create trustworthy user experiences by building interfaces that are simple, easy to comprehend, performant and reliable using modern tools like React, React Native, Typescript, Node.js, Jest and Webpack.",
					},
					{
						descriptor: {
							code: "RESPONSIBILITY",
						},
						value:
							"Mentor and train other team members on design techniques and coding standards.",
					},
				],
			},
			{
				descriptor: {
					code: "JOB_DETAILS",
				},
				list: [
					{
						descriptor: {
							code: "CTC",
						},
						value: "20,30,40",
					},
					{
						descriptor: {
							code: "POST_START_LOCATION",
						},
						value: "Pune",
					},
					{
						descriptor: {
							code: "WORKING_LOCATION",
						},
						value: "Hybrid",
					},
					{
						descriptor: {
							code: "WORKING_TIME",
						},
						value: "Full-Time",
					},
				],
			},
		];

		const updatedItems = message.order.items.map((item: any) => {
			const range = itemsWithTimeRanges[item.id]?.range || null;
			const updatedItem = {
				...item,
				time: {
					range: range,
				},
				tags: [...item.tags, ...itemTags],
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
				status: ORDER_STATUS.ACTIVE.toUpperCase(),
				fulfillments: updatedFulfillments,
				state: {
					updated_at: ts.toISOString(),
				},
			},
		};

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
		next(error);
	}
};
