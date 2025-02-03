import { redis } from "../lib/utils";
import { NextFunction, Request, Response } from "express";
import { onestSchemaValidator } from "../lib/schema/onest";

type AllActions =
	| "search"
	| "on_search"
	| "search_inc"
	| "on_search_inc"
	| "select"
	| "on_select"
	| "init"
	| "on_init"
	| "confirm"
	| "on_confirm"
	| "status"
	| "on_status"
	| "update"
	| "on_update"
	| "cancel"
	| "on_cancel"

// Exclude "select", "on_select", and "rating" for logistics domain

type Domain = "onest";

type ActionType<T extends Domain> = AllActions;

type JsonSchemaValidatorType<T extends Domain> = {
	domain: T;
	action: ActionType<T>;
};

export const jsonSchemaValidator = <T extends Domain>({
	domain,
	action,
}: JsonSchemaValidatorType<T>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			let domainAction = action;

			if (domainAction === "search" || domainAction === "on_search") {
				let search_type = await redis.get(
					`${req.body.context.transaction_id}-search_type`
				);
				if (search_type === "search_inc") {
					if (domainAction === "on_search") domainAction = "on_search_inc";
					else domainAction = "search_inc";
				}
			}

			switch (domain) {
				case "onest":
					console.log("domainAction", domainAction);
					const validation = onestSchemaValidator(domainAction as AllActions)(
						req,
						res,
						next
					);
					return validation;
				default:
					throw new Error(`Unsupported domain: ${domain}`);
			}
		} catch (error) {
			next(error);
		}
	};
};
