import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	send_nack,
logger,


} from "../../../lib/utils";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import {  ORDER_STATUS, UPDATE_TARGET } from "../../../lib/utils/apiConstants";
export const updateController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const update  = req.body.message.order.fulfillments[0]
		const on_confirm = res.locals.on_confirm;
		let update_target = 
		(update.customer && UPDATE_TARGET.CONTACT_AND_EMAIL) || 
		(update.state && UPDATE_TARGET.FULFILLMENT_STATE);
		
		
		
			if (on_confirm.message.order.id != req.body.message.order.id) {
				return send_nack(res, ERROR_MESSAGES.ORDER_ID_DOES_NOT_EXISTED);
			}
		updateRequest(req, res, next, on_confirm,update_target,update);
	} catch (error) {
		return next(error);
	}
};

const updateRequest = async (
	req: Request,
	res: Response,
	next: NextFunction,
	transaction: any,
	update_target: string,
	update: any
) => {
	try {
		const { context, message } = req.body;
		const ts = new Date();
		
		let responseMessage = transaction.message;
		const target_fulfillment = responseMessage.order.fulfillments.find((fulfillment: any) => fulfillment.id === update.id)
		
		// Generating response messages based on update fulfillment.
		switch (update_target) {
			case UPDATE_TARGET.CONTACT_AND_EMAIL:
				target_fulfillment.customer.contact.email = 
		    update.customer.contact.email || target_fulfillment.customer.contact.email;
				target_fulfillment.customer.contact.phone = 
		    update.customer.contact.phone || target_fulfillment.customer.contact.phone;
				responseMessage.order.status = ORDER_STATUS.ACTIVE;
				target_fulfillment.state.descriptor.code = "OFFER_EXTENDED";
					break;
			case UPDATE_TARGET.FULFILLMENT_STATE:
				responseMessage.order.status = ORDER_STATUS.COMPLETED;
				target_fulfillment.state.descriptor.code = update.state.descriptor.code;
				delete target_fulfillment.customer;
					break;
	
			default:
				responseMessage.order.status = ORDER_STATUS.COMPLETED;
				target_fulfillment.state.descriptor.code = update.state.descriptor.code;
				delete target_fulfillment.customer;
					break;
	}
		target_fulfillment.state.updated_at = ts.toISOString();
		responseMessage.order.state.updated_at = ts.toISOString();
		// TODO: Fetch documents from unsolicited on_update and insert here.

		return responseBuilder(
			res,
			next,
			context,
			responseMessage,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/")
					? ON_ACTION_KEY.ON_UPDATE
					: `/${ON_ACTION_KEY.ON_UPDATE}`
			}`,
			`${ON_ACTION_KEY.ON_UPDATE}`,
			"onest",
			ts
		);
	} catch (error) {
		logger.error(
			"updateRequest: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);
		next(error);
	}
};
