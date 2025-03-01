import { Request, Response, NextFunction } from "express";
import { ACTION_KEY, ON_ACTION_KEY } from "../lib/utils/actionOnActionKeys";
import {
	logger,
	redis,
	redisExistToServer,
	redisFetchToServer,
	send_nack,
} from "../lib/utils";
import { ERROR_MESSAGES } from "../lib/utils/responseMessages";
import { FULFILLMENT_STATES } from "../lib/utils/apiConstants";

// Here scenario 1 is considered as Happy Flow
export const stateValidator =
	(actionName: string, scenario: number = 1) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { transaction_id } = req.body.context;
			switch (actionName) {
				case ACTION_KEY.SEARCH:
					break;

				case ACTION_KEY.SELECT:
					// Checking next action call to prevent sending multiple requests
					const init = await checkingNextActionCall(
						transaction_id,
						ACTION_KEY.INIT,
						ERROR_MESSAGES.SELECT_ALREADY_SENT
					);
					if (init) return send_nack(res, ERROR_MESSAGES.SELECT_ALREADY_SENT);
				case ACTION_KEY.INIT:
					{
						const on_search = await checkActionAndLog(
							transaction_id,
							ON_ACTION_KEY.ON_SEARCH,
							ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED
						);
						if (!on_search)
							return send_nack(res, ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED);
						res.locals.on_search = on_search;

						// Checking for init action call
						if (actionName === ACTION_KEY.INIT) {
							const on_select = await checkActionAndLog(
								transaction_id,
								ON_ACTION_KEY.ON_SELECT,
								ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED
							);

							if (!on_select || (on_select && on_select?.error)) {
								return send_nack(
									res,
									on_select?.error?.message
										? on_select?.error?.message
										: ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED
								);
							}

							// Checking next on_action call to prevent sending multiple requests
							const on_init = await checkingNextActionCall(
								transaction_id,
								ON_ACTION_KEY.ON_INIT,
								ERROR_MESSAGES.INIT_ALREADY_SENT
							);
							if (on_init)
								return send_nack(res, ERROR_MESSAGES.INIT_ALREADY_SENT);
							res.locals.on_select = on_select;
						}
					}
					break;

				case ACTION_KEY.CONFIRM:
					{
						const on_init = await checkActionAndLog(
							transaction_id,
							ON_ACTION_KEY.ON_INIT,
							ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED
						);
						if (!on_init || (on_init && on_init?.error))
							return send_nack(
								res,
								on_init?.error?.message
									? on_init?.error?.message
									: ERROR_MESSAGES.ON_INIT_DOES_NOT_EXISTED
							);

						const fulfillmentState = await redis.get(
							`${transaction_id}-on_init-fulfillment_state`
						);
						if (fulfillmentState != FULFILLMENT_STATES.APPLICATION_FILLED) {
							logger.error(
								`${ERROR_MESSAGES.APPLICATION_FILLED_STATE_NOT_EXISTED} for the given transaction_id: ${transaction_id}`
							);
							return send_nack(
								res,
								ERROR_MESSAGES.APPLICATION_FILLED_STATE_NOT_EXISTED
							);
						}

						// Checking next on_action call to prevent sending multiple requests
						const on_confirm = await checkingNextActionCall(
							transaction_id,
							ON_ACTION_KEY.ON_CONFIRM,
							ERROR_MESSAGES.CONFIRM_ALREADY_SENT
						);

						if (on_confirm)
							return send_nack(res, ERROR_MESSAGES.CONFIRM_ALREADY_SENT);
					}
					// Add validation logic for CONFIRM
					break;
				case ACTION_KEY.CANCEL:
					{
						// Cancellation cannot happen unless the order is confirmed.
						const on_confirm = await checkActionAndLog(
							transaction_id,
							ON_ACTION_KEY.ON_CONFIRM,
							ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED
						);
						if (!on_confirm || (on_confirm && on_confirm?.error))
							return send_nack(
								res,
								on_confirm?.error?.message
									? on_confirm?.error?.message
									: ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED
							);

						// if on_update exists, i.e. OFFER_EXTENDED/ACCEPTED, cancellation cannot proceed.
						const on_update = await checkActionAndLog(
							transaction_id,
							ON_ACTION_KEY.ON_UPDATE,
							ERROR_MESSAGES.ON_UPDATE_UNSOLICITED_ALREADY_SENT
						);
						if (on_update)
							return send_nack(
								res,
								`${ERROR_MESSAGES.ON_UPDATE_UNSOLICITED_ALREADY_SENT} and cannot be cancelled for the given transaction_id: ${transaction_id}`
							);
						res.locals.on_confirm = on_confirm;
					}
					break;
				case ACTION_KEY.STATUS:
					break;
				case ACTION_KEY.UPDATE:
					{
						const fulfillmentState = await redis.get(
							`${transaction_id}-on_update-fulfillment_state`
						);
						if (fulfillmentState != FULFILLMENT_STATES.OFFER_EXTENDED) {
							logger.error(
								`${ERROR_MESSAGES.OFFER_EXTENDED_STATE_NOT_EXISTED} for the given transaction_id: ${transaction_id}`
							);

							return send_nack(
								res,
								ERROR_MESSAGES.OFFER_EXTENDED_STATE_NOT_EXISTED
							);
						}
						const on_cancel = await checkActionAndLog(
							transaction_id,
							ON_ACTION_KEY.ON_CANCEL,
							ERROR_MESSAGES.CANCELLATION_IS_ALREADY_DONE
						);
						if (on_cancel)
							return send_nack(
								res,
								on_cancel?.error?.message
									? on_cancel?.error?.message
									: `${ERROR_MESSAGES.CANCELLATION_IS_ALREADY_DONE} for ${transaction_id}`
							);
						const on_confirm = await checkActionAndLog(
							transaction_id,
							ON_ACTION_KEY.ON_CONFIRM,
							ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED
						);
						if (on_confirm.message.order.id != req.body.message.order.id) {
							return send_nack(res, ERROR_MESSAGES.ORDER_ID_DOES_NOT_EXISTED);
						}
						res.locals.on_confirm = on_confirm;
					}
					break;

				case ON_ACTION_KEY.ON_SEARCH:
					// Add validation logic for ON_SEARCH
					break;
				case ON_ACTION_KEY.ON_SELECT:
					// Add validation logic for ON_SELECT
					break;
				case ON_ACTION_KEY.ON_INIT:
					{
						const fulfillmentState =
							req.body.message.order.fulfillments[0].state.descriptor.code;
						if (fulfillmentState) {
							await redis.set(
								`${transaction_id}-on_init-fulfillment_state`,
								fulfillmentState
							);
						}
					}
					break;
				case ON_ACTION_KEY.ON_CONFIRM:
					{
						const fulfillmentState =
							req.body.message.order.fulfillments[0].state.descriptor.code;
						const orderStatus = req.body.message.order.status;
						if (fulfillmentState && orderStatus) {
							await redis.set(
								`${transaction_id}-ff_state_and_order_status`,
								JSON.stringify({
									fulfillment_state: fulfillmentState,
									order_status: orderStatus,
								})
							);
						}
					}
					// Add validation logic for ON_CONFIRM
					break;
				case ON_ACTION_KEY.ON_CANCEL:
					{
						const fulfillmentState =
							req.body.message.order.fulfillments[0].state.descriptor.code;
						const orderStatus = req.body.message.order.status;
						if (fulfillmentState && orderStatus) {
							await redis.set(
								`${transaction_id}-ff_state_and_order_status`,
								JSON.stringify({
									fulfillment_state: fulfillmentState,
									order_status: orderStatus,
								})
							);
						}
					}
					// Add validation logic for ON_CANCEL
					break;
				case ON_ACTION_KEY.ON_STATUS:
					{
						const fulfillmentState =
							req.body.message.order.fulfillments[0].state.descriptor.code;
						const orderStatus = req.body.message.order.status;
						if (fulfillmentState && orderStatus) {
							await redis.set(
								`${transaction_id}-ff_state_and_order_status`,
								JSON.stringify({
									fulfillment_state: fulfillmentState,
									order_status: orderStatus,
								})
							);
						}
					}
					break;
				case ON_ACTION_KEY.ON_UPDATE:
					{
						const on_cancel = await checkingNextActionCall(
							transaction_id,
							ON_ACTION_KEY.ON_CANCEL,
							ERROR_MESSAGES.ON_CANCEL_ALREADY_SENT
						);
						if (on_cancel) {
							return send_nack(
								res,
								`${ERROR_MESSAGES.ON_CANCEL_ALREADY_SENT} for ${transaction_id} and the order can't be further updated`
							);
						}
						const fulfillmentState =
							req.body.message.order.fulfillments[0].state.descriptor.code;
						if (fulfillmentState) {
							await redis.set(
								`${transaction_id}-on_update-fulfillment_state`,
								fulfillmentState
							);
						}

						const orderStatus = req.body.message.order.status;
						if (fulfillmentState && orderStatus) {
							await redis.set(
								`${transaction_id}-ff_state_and_order_status`,
								JSON.stringify({
									fulfillment_state: fulfillmentState,
									order_status: orderStatus,
								})
							);
						}
					}
					break;

				default:
					return send_nack(res, ERROR_MESSAGES.INVALID_REQUEST_FOUND);
			}
			next(); // Proceed to the next middleware
		} catch (error) {
			logger.error(
				"Error occured in the state validator for the transaction_id: ",
				req.body.context.transaction_id,
				error
			);
		}
	};

export const checkActionAndLog = async (
	transaction_id: string,
	action: string,
	error_message: string
) => {
	const data = await redisFetchToServer(action, transaction_id);
	if (!data) {
		logger.error(
			`${error_message} for the given transaction_id: ${transaction_id}`
		);
	}
	return data;
};

const checkingNextActionCall = async (
	transaction_id: string,
	action: string,
	error_message: string
) => {
	const data = await redisExistToServer(action, transaction_id);
	// If data is present send nack
	if (data) {
		logger.error(
			`${error_message} for the given transaction_id: ${transaction_id}`
		);
	}
	return data;
};
