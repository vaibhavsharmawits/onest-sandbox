import { NextFunction, Request, Response } from "express";
import {
	redisFetchFromServer,
	responseBuilder,
	send_nack,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const confirmController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		confirmConsultationController(req, res, next);
	} catch (error) {
		return next(error);
	}
};

export const confirmConsultationController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			context,
			message: { order },
		} = req.body;

		const on_init = await redisFetchFromServer(
			ON_ACTION_KEY.ON_INIT,
			context?.transaction_id
		);

		if (on_init && on_init?.error) {
			return send_nack(
				res,
				on_init?.error?.message
					? on_init?.error?.message
					: ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED
			);
		}

		if (!on_init) {
			return send_nack(res, ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED);
		}

		const { items } = order;
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
						value: "2000000",
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

		const updatedItems = items.map((item: any) => {
			const updatedItem = {
				...item,
				tags: [...item.tags, ...itemTags],
			};
			return updatedItem;
		});
	
		const ts = new Date();

		const updatedFulfillments = order?.fulfillments.map((ff: any) => {
			ff.state = {
				descriptor: {
					code: "APPLICATION_ACCEPTED",
				},
				updated_at: ts.toISOString(),
			};
			return ff;
		});

		const responseMessage = {
			order: {
				...order,
				fulfillments: updatedFulfillments,
				items: updatedItems,
				state: { ...order.state, updated_at: ts.toISOString() },
			},
		};

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_CONFIRM
					: `/${ON_ACTION_KEY.ON_CONFIRM}`
			}`,
			`${ON_ACTION_KEY.ON_CONFIRM}`,
			"onest"
		);
	} catch (error) {
		next(error);
	}
};
