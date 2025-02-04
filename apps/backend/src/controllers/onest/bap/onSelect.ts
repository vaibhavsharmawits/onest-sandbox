import { NextFunction, Request, Response } from "express";
import {
	logger,
	onSelectFulfillments,
	responseBuilder,
} from "../../../lib/utils";

export const onSelectController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		return onSelectConsultationController(req, res, next);
	} catch (error) {
		logger.error(
			"onSelectController: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);

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

		delete provider?.descriptor;

		const responseMessage = {
			order: {
				provider: {
					...provider,
				},

				items: items,
				fulfillments: onSelectFulfillments,
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
		logger.error(
			"onSelectConsultationController: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);
		next(error);
	}
};
