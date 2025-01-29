import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { ONEST_EXAMPLES_PATH, responseBuilder } from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ONEST_DOMAINS } from "../../../lib/utils/apiConstants";
import { redis } from "../../../lib/utils";

export const searchController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const domain = req.body.context.domain;
		console.log("bidy of the on_search", JSON.stringify(req.body));
		let search_type = await redis.get(
			`${req.body.context.transaction_id}-search_type`
		);
		console.log("final search type", search_type);

		let onSearch, file;
		const {
			message: { intent },
		} = req.body;
		const id = intent?.category?.id;
		if (search_type === "search") {
			search_type = "search_by_job_location";
		}
		switch (domain) {
			case ONEST_DOMAINS.ONEST10:
				file = fs.readFileSync(
					path.join(ONEST_EXAMPLES_PATH, `on_search/on_${search_type}.yaml`)
				);
				break;

			default:
				file = fs.readFileSync(
					path.join(ONEST_EXAMPLES_PATH, "on_search/on_search_by_job_location.yaml")
				);
				break;
		}
		const response = YAML.parse(file.toString());
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
