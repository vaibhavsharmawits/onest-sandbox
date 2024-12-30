import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	ONEST_EXAMPLES_PATH,
	responseBuilder,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ONEST_DOMAINS } from "../../../lib/utils/apiConstants";

export const searchController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const domain = req.body.context.domain;
		let onSearch, file;
		const {
			message: { intent },
		} = req.body;
		const id = intent?.category?.id;

		switch (domain) {
			case ONEST_DOMAINS.ONEST10:
				file = fs.readFileSync(
					path.join(ONEST_EXAMPLES_PATH, "on_search/on_search.yaml")
				);
				break;

			default:
				file = fs.readFileSync(
					path.join(ONEST_EXAMPLES_PATH, "on_search/on_search.yaml")
				);
				break;
		}
		const response = YAML.parse(file.toString());
			// fs.writeFileSync("temp-on_search.json", JSON.stringify(response.value.message, null, 2));
		return responseBuilder(
			res,
			next,
			req.body.context,
			response.value.message,
			`${req.body.context.bap_uri}${
				req.body.context.bap_uri.endsWith("/") ? "on_search" : "/on_search"
			}`,
			`${ON_ACTION_KEY.ON_SEARCH}`,
			"onest"
		);
	} catch (error) {
		return next(error);
	}
};
