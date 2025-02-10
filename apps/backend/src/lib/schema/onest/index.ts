import { NextFunction, Request, Response } from "express";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { searchSchema } from "./search";
import { onSearchSchema } from "./on_search";
import { selectSchema } from "./select";
import { onSelectSchema } from "./on_select";
import { initSchema } from "./init";
import { onInitSchema } from "./on_init";
import { confirmSchema } from "./confirm";
import { onConfirmSchema } from "./on_confirm";
import { statusSchema } from "./status";
import { onStatusSchema } from "./on_status";
import { searchIncSchema } from "./search_inc";
import { onSearchIncSchema } from "./on_search_inc";
import { cancelSchema } from "./cancel";
import { onCancelSchema } from "./on_cancel";

export const onestSchemaValidator =
	(
		schema:
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
	) =>
	(req: Request, res: Response, next: NextFunction) => {
		const ajv = new Ajv({
			allErrors: true,
			strict: false,
			strictRequired: false,
			strictTypes: false,
			$data: true,
		});
		addFormats(ajv);

		require("ajv-errors")(ajv);
		var validate: ValidateFunction<{
				[x: string]: {};
			}>,
			isValid: boolean;

		switch (schema) {
			case "search":
				validate = ajv.compile(searchSchema);
				break;
			case "on_search":
				validate = ajv.compile(onSearchSchema);
				break;
			case "search_inc":
				validate = ajv.compile(searchIncSchema);
				break;
			case "on_search_inc":
				validate = ajv.compile(onSearchIncSchema);
				break;
			case "select":
				validate = ajv.compile(selectSchema);
				break;
			case "on_select":
				validate = ajv.compile(onSelectSchema);
				break;
			case "init":
				validate = ajv.compile(initSchema);
				break;
			case "on_init":
				validate = ajv.compile(onInitSchema);
				break;
			case "confirm":
				validate = ajv.compile(confirmSchema);
				break;
			case "on_confirm":
				validate = ajv.compile(onConfirmSchema);
				break;
			case "status":
				validate = ajv.compile(statusSchema);
				break;
			case "on_status":
				validate = ajv.compile(onStatusSchema);
				break;
			// case "update":
			// 	validate = ajv.compile(updateSchema);
			// 	break;
			// case "on_update":
			// 	validate = ajv.compile(onUpdateSchema);
			// 	break;
			case "cancel":
				validate = ajv.compile(cancelSchema);
				break;
			case "on_cancel":
				validate = ajv.compile(onCancelSchema);
				break;
			default:
				console.log("error");
				res.status(400).json({
					message: {
						ack: {
							status: "NACK",
						},
					},
					error: {
						type: "JSON-SCHEMA-ERROR",
						code: "50009",
					},
				});
				return;
		}

		isValid = validate(req.body);

		if (!isValid) {
			console.log(
				"error json schema",
				schema,
				validate.errors?.map(({ message, params, instancePath }) => ({
					message: `${message}${
						params.allowedValues ? ` (${params.allowedValues})` : ""
					}${params.allowedValue ? ` (${params.allowedValue})` : ""}${
						params.additionalProperty ? ` (${params.additionalProperty})` : ""
					}`,
					details: instancePath,
				}))
			);
			res.status(400).json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					type: "JSON-SCHEMA-ERROR",
					code: "50009",
					message: validate.errors?.map(
						({ message, params, instancePath }) => ({
							message: `${message}${
								params.allowedValues ? ` (${params.allowedValues})` : ""
							}${params.allowedValue ? ` (${params.allowedValue})` : ""}${
								params.additionalProperty
									? ` (${params.additionalProperty})`
									: ""
							}`,
							details: instancePath,
						})
					),
				},
			});
			return;
		}
		next();
	};
