import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import { AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH, SERVICES_EXAMPLES_PATH, checkIfCustomized, quoteCreatorHealthCareService, redisFetchFromServer, responseBuilder } from "../../../lib/utils";


export const onInitController = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const on_search = await redisFetchFromServer("on_search", req.body.context.transaction_id);
		const providersItems = on_search?.message?.catalog?.providers[0]?.items;
		
		return onInitConsultationController(req, res, next)
	}catch(error){
		return next(error)
	}
};

const onInitConsultationController = (req: Request, res: Response, next: NextFunction) => {
	try{
		const { context, message: { order: { provider, locations, items, billing, fulfillments, payments,quote } } } = req.body;
	// 	const { stops, ...remainingfulfillments } = fulfillments[0]
	
	// 	const file = fs.readFileSync(
	// 		path.join(AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH, "confirm/confirm.yaml")
	// 	);
		
	// 	const response = YAML.parse(file.toString());
	// 	const timestamp = new Date().toISOString();
	// console.log("yyyyyyyyy")
	// 	const responseMessage = {
	// 		order: {
	// 			id: uuidv4(),
	// 			status: response.value.message.order.status,
	// 			provider: {
	// 				...provider,
	// 				...locations
	// 			},
	// 			items,
	// 			billing,
	// 			fulfillments: [{
	// 				...remainingfulfillments,
	// 				stops: stops.map(({ tags, ...stop }: { tags: any }) => {
	// 					return {
	// 						...stop,
	// 						customer: {
	// 							person: {
	// 								name: "Ramu"
	// 							}
	// 						}
	// 					}
	// 				})
	// 			}],
	// 			quote: quote,
	// 			payments: [{
	// 				...payments[0],
	// 				status: "PAID"
	// 			}],
	// 			created_at: timestamp,
	// 			updated_at: timestamp,
	// 		}
	// 	}
	
		return responseBuilder(
			res,
			next,
			{},
			{},
			`${context.bpp_uri}${context.bpp_uri.endsWith("/") ? "confirm" : "/confirm"
			}`,
			`confirm`,
			"onest"
		);
	}catch(error){
		next(error)
	}

	
};



