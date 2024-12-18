import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { responseBuilder } from "../../../lib/utils";

export const onSelectController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		return onSelectConsultationController(req, res, next);
	} catch (error) {
		return next(error);
	}
};

const onSelectConsultationController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			context,
			message: {
				order: { provider, items, quote },
			},
		} = req.body;

		delete provider?.descriptor

		const npFeesTag = quote?.breakup
			.filter((item: any) => item.title === "NP Fees")
			.map((npTag: any) => {
				const tags = npTag.tags;
				return tags.find((tag: any) => tag.descriptor.code === "NP_FEES");
			});

		const responseMessage = {
			order: {
				provider: {
					...provider,
				},

				items: items,
				fulfillments: [
					{
						id: "1",
						customer: {
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
											code: "documents",
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
									...npFeesTag
								],
							},
						},
						contact: {
							phone: "9999999999",
							email: "abc@abc.bc",
						},
					},
				],
				quote: quote,
			},
		};
		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bpp_uri}${
				req.body.context.bpp_uri.endsWith("/") ? "init" : "/init"
			}`,
			`init`,
			"onest"
		);
	} catch (error) {
		next(error);
	}
};
