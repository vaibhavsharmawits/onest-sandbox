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
	| "track"
	| "on_track"
	| "cancel"
	| "on_cancel"
	| "rating";

// Exclude "select", "on_select", and "rating" for logistics domain
type LogisticsActions = Exclude<AllActions, "select" | "on_select" | "rating">;

type B2BActions = Exclude<AllActions, "rating">;
type B2CActions = Exclude<AllActions, "rating">;

type Domain =
	| "b2b"
	| "b2c"
	| "services"
	| "logistics"
	| "retail"
	| "subscription"
	| "agri"
	| "onest";

type ActionType<T extends Domain> = T extends "logistics"
	? LogisticsActions
	: AllActions;

export type VersionType = "b2b" | "b2c" | "b2b-exp"; // Include '1235' if it's a valid option

type JsonSchemaValidatorType<T extends Domain> = {
	domain: T;
	action: ActionType<T>;
	VERSION?: VersionType | undefined;
};

export const jsonSchemaValidator = <T extends Domain>({
	domain,
	action,
	VERSION,
}: JsonSchemaValidatorType<T>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			console.log(action, "action uri2");
			if (action === "search" || "on_search") {
				let search_type = await redis.get(
					`${req.body.context.transaction_id}-search_type`
				);
				if (search_type === "search_inc") {
					if (action === "on_search") action = "on_search_inc";
					else action = "search_inc";
				}
			}

			const l2 = await redis.get("l2_validations");
			const reqDomain = req.body.context.domain;
			console.log("domain at jsonSchema", domain);
			// if (l2 != null && JSON.parse(l2).includes(domain)) {
			//   if(reqDomain != undefined ) {
			//     const spec = await redis.get(`${domain}_${(reqDomain as string).toLowerCase().replace(":", "_")}_l2_validation`);
			//     if(spec != null) {
			//       return l2Validator(domain)(req, res, next);
			//     }
			//   }
			// }

			let savedVersion: VersionType | any = await redis.get(
				`${req.body.context.transaction_id}-version`
			);

			if (!savedVersion) {
				savedVersion = VERSION;
			}

			switch (domain) {
				case "onest":
					console.log("req.body", JSON.stringify(req.body));
					const validation = onestSchemaValidator(action as AllActions)(
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
