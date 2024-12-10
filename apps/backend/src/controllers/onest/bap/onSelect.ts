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
		// const {
		// 	context,
		// 	message: {
		// 		order: { provider, items, payments, fulfillments },
		// 	},
		// } = req.body;
		console.log("🚀 ~ req.body:", req.body)
		
		// const { id, type, stops } = fulfillments[0];
		// const responseMessage = {
		// 	order: {
		// 		provider: {
		// 			...provider,
		// 			locations: [{ id: uuidv4() }],
		// 		},

		// 		items: items.map(
		// 			({ location_ids, ...items }: { location_ids: any }) => items
		// 		),

		// 		billing: {
		// 			name: "ONDC buyer",
		// 			address:
		// 				"22, Mahatma Gandhi Rd, Craig Park Layout, Ashok Nagar, Bengaluru, Karnataka 560001",
		// 			state: {
		// 				name: "Karnataka",
		// 			},
		// 			city: {
		// 				name: "Bengaluru",
		// 			},
		// 			tax_id: "XXXXXXXXXXXXXXX",
		// 			email: "nobody@nomail.com",
		// 			phone: "9886098860",
		// 		},

		// 		fulfillments: [
		// 			{
		// 				id,
		// 				type,
		// 				stops: [
		// 					{
		// 						id: stops[0].id,
		// 						location: {
		// 							gps: "12.974002,77.613458",
		// 							address: "My House #, My buildin",
		// 							city: {
		// 								name: "Bengaluru",
		// 							},
		// 							country: {
		// 								code: "IND",
		// 							},
		// 							area_code: "560001",
		// 							state: {
		// 								name: "Karnataka",
		// 							},
		// 						},
		// 						contact: {
		// 							phone: "9886098860",
		// 						},
		// 						time: stops[0].time,
		// 					},
		// 				],
		// 			},
		// 		],
				
		// 		payments,
		// 	},
		// };
		return responseBuilder(
			res,
			next,
			{},
			{},
			`${req.body.context.bpp_uri}${
				req.body.context.bpp_uri.endsWith("/") ? "init" : "/init"
			}`,
			`init`,
			"services"
		);
	} catch (error) {
		next(error);
	}
};

