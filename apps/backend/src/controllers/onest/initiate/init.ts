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
		let init = YAML.parse(file.toString());
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
				order: { provider, items, fulfillments },
			},
		} = transaction;

		console.log("fulfillment in it", JSON.stringify(fulfillments))
		let customer = {
			"person": {
				"name": "Sanjay",
				"gender": "Male",
				"age": "35",
				"skills": [
					{
						"name": "Android"
					},
					{
						"name": "AWS"
					}
				],
				"languages": [
					{
						"name": "en"
					},
					{
						"name": "ml"
					},
					{
						"name": "hi"
					}
				],
				"creds": [
					{
						"id": "D1",
						"descriptor": {
							"name": "PAN_CARD",
							"short_desc": "PAN Card information",
							"long_desc": "Permanent Account Number"
						},
						"url": "https://example.com/pan_card.jpeg",
						"type": "jpeg"
					},
					{
						"id": "D2",
						"descriptor": {
							"name": "AADHAAR_CARD",
							"short_desc": "Aadhaar Card information",
							"long_desc": "Unique Identification Number"
						},
						"url": "https://example.com/aadhaar_card.jpeg",
						"type": "pdf"
					},
					{
						"id": "D3",
						"descriptor": {
							"name": "VOTER_ID",
							"short_desc": "Voter ID information",
							"long_desc": "Election Commission ID"
						},
						"url": "https://example.com/voter_id.jpeg",
						"type": "jpeg"
					},
					{
						"id": "D4",
						"descriptor": {
							"name": "PASSPORT",
							"short_desc": "Passport information",
							"long_desc": "International Travel Document"
						},
						"url": "https://example.com/passport.jpeg",
						"type": "jpeg"
					},
					{
						"id": "D5",
						"descriptor": {
							"name": "DRIVING_LICENSE",
							"short_desc": "Driving License information",
							"long_desc": "License to Drive"
						},
						"url": "https://example.com/driving_license.jpeg",
						"type": "jpeg"
					},
					{
						"id": "D6",
						"descriptor": {
							"name": "RESUME",
							"short_desc": "Summary of qualifications, work experience, and education.",
							"long_desc": "A comprehensive document showcasing an individual's career achievements, skills, work history, education, certifications, and professional experience."
						},
						"url": "https://example.com/resume.pdf",
						"type": "pdf"
					}
				],
				"tags": [
					{
						"descriptor": {
							"code": "EMP_DETAILS"
						},
						"list": [
							{
								"descriptor": {
									"code": "TOTAL_EXPERIENCE"
								},
								"value": "P4Y"
							}
						]
					},
					{
						"descriptor": {
							"code": "DISABILITIES_AND_ACCOMMODATIONS"
						},
						"list": [
							{
								"descriptor": {
									"code": "KNOWN_DISABILITIES"
								},
								"value": "Visual Impairment"
							}
						]
					},
					{
						"descriptor": {
							"code": "ACADEMIC_QUALIFICATIONS"
						},
						"list": [
							{
								"descriptor": {
									"code": "COURSE_NAME"
								},
								"value": "Bachelor of Science in Computer Science"
							},
							{
								"descriptor": {
									"code": "COLLEGE_NAME"
								},
								"value": "University of Technology"
							},
							{
								"descriptor": {
									"code": "YEAR_OF_COMPLETION"
								},
								"value": "2020"
							}
						]
					},
					{
						"descriptor": {
							"code": "ONLINE_LEARNING_AND_SPECIALIZATIONS"
						},
						"list": [
							{
								"descriptor": {
									"code": "CERTIFICATIONS"
								},
								"value": "Certified Cloud Practitioner"
							}
						]
					},
					{
						"descriptor": {
							"code": "WORK_EXPERIENCE"
						},
						"list": [
							{
								"descriptor": {
									"code": "TOTAL_EXPERIENCE"
								},
								"value": "P3Y"
							}
						]
					},
					{
						"descriptor": {
							"code": "TECHNICAL_SKILLS"
						},
						"list": [
							{
								"descriptor": {
									"code": "JOB_SPECIFIC_SKILLS"
								},
								"value": "Full Stack Development"
							}
						]
					},
					{
						"descriptor": {
							"code": "SKILLS"
						},
						"list": [
							{
								"descriptor": {
									"code": "COMMUNICATION"
								},
								"value": "Excellent Verbal and Written Skills"
							},
							{
								"descriptor": {
									"code": "LEADERSHIP"
								},
								"value": "Team Management and Decision Making"
							}
						]
					},
					{
						"descriptor": {
							"code": "DIGITAL_FOOTPRINT"
						},
						"list": [
							{
								"descriptor": {
									"code": "LINKEDIN_PROFILE"
								},
								"value": "https://linkedin.com/in/example-profile"
							},
							{
								"descriptor": {
									"code": "GITHUB_REPOSITORIES"
								},
								"value": "https://github.com/example-profile"
							}
						]
					}
				]
			},
			"contact": {
				"phone": "+91-1234567890",
				"email": "abc@abc.bc"
			}
		}

		let initFulfillment = fulfillments.map((fulfillment: any) => ({
			id: fulfillment.id,
			type: fulfillment.type,
			customer: customer
		}));

		console.log("initFulfillment",JSON.stringify(initFulfillment));


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
					fulfillments: initFulfillment,
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
