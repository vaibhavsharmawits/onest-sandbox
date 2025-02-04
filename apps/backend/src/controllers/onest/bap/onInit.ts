import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	logger,
	onInitDistributorTags,
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

		return onInitConsultationController(req, res, next);
	} catch (error) {
		logger.error(
			"onInitController: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);
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

		const updatedItems = items.map((item: any) => {
			delete item?.xinput;
			return item;
		});

		const updatedFulfillments = fulfillments.map((ff: any) => {
			ff.state = {
				descriptor: {
					code: "APPLICATION_IN_PROGRESS",
				},
				updated_at: ts.toISOString(),
			};
			ff.tags = onInitDistributorTags;
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
				payments,
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
		logger.error(
			"onInitConsultationController: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);

		next(error);
	}
};
