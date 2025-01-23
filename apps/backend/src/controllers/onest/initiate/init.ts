import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	ONEST_BAP_MOCKSERVER_URL,
	ONEST_EXAMPLES_PATH,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	ACTION_KEY,
	ON_ACTION_KEY,
} from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";

export const initiateInitController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { scenario, transactionId } = req.body;
		const on_select = await redisFetchToServer(
			ON_ACTION_KEY.ON_SELECT,
			transactionId
		);
		if (!on_select) {
			return send_nack(res, ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED);
		}

		const file = fs.readFileSync(
			path.join(ONEST_EXAMPLES_PATH, `init/init.yaml`)
		);
		let init = YAML.parse( file.toString());
		if (Object.keys(on_select).includes("error")) {
			return send_nack(res, ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED);
		}
		return intializeRequest(res, next, on_select, init?.value, scenario);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	initYaml: any,
	scenario: string
) => {
	try {
		const {
			context,
			message: {
				order: { provider, items, quote, fulfillments },
			},
		} = transaction;

		const init = {
			context: {
				...context,
				timestamp: new Date().toISOString(),
				action: ACTION_KEY.INIT,
				bap_id: MOCKSERVER_ID,
				bap_uri: ONEST_BAP_MOCKSERVER_URL,
				message_id: uuidv4(),
			},
			message: {
				order: {
					provider: {
						...provider,
					},
					items: items,
					fulfillments: [
						{
							...fulfillments,
							customer: {
								contact: {
									phone: "9999999999",
									email: "abc@abc.bc",
								},
								person: {
									name: "Sanjay",
									gender: "Male",
									age: "35",
									skills: [
										{
											code: "Android",
											name: "Android",
										},
										{
											code: "AWS",
											name: "AWS",
										},
									],
									languages: [
										{
											code: "en",
											name: "english",
										},
										{
											code: "ml",
											name: "Malayalam",
										},
										{
											code: "hi",
											name: "Hindi",
										},
									],
									tags: [
										{
											descriptor: {
												code: "EMP_DETAILS",
												name: "Employee Details",
											},
											list: [
												{
													descriptor: {
														code: "EXPECTED_SALARY",
													},
													value: "1000000",
												},
												{
													descriptor: {
														code: "TOTAL_EXPERIENCE",
														name: "Total Experience",
													},
													value: "P4Y",
												},
											],
										},
										{
											descriptor: {
												code: "DOCUMENTS",
												name: "Documents",
											},
											list: [
												{
													descriptor: {
														code: "DOC_TYPE",
													},
													value: "resume",
												},
												{
													descriptor: {
														code: "link",
													},
													value: "https://example.com/resume.pdf",
												},
												{
													descriptor: {
														code: "FILE_FORMAT",
													},
													value: "pdf",
												},
											],
										},
									],
								},
							},
						},
					],
					quote: quote,
					payments: initYaml?.message?.order?.payments,
				},
			},
		};

		await send_response(
			res,
			next,
			init,
			context.transaction_id,
			ACTION_KEY.INIT,
			(scenario = scenario)
		);
	} catch (error) {
		next(error);
	}
};
