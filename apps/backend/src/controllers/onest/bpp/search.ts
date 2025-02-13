import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import {
	logger,
	ONEST_EXAMPLES_PATH,
	responseBuilder,
} from "../../../lib/utils";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { ONEST_DOMAINS } from "../../../lib/utils/apiConstants";
import { redis } from "../../../lib/utils";
import { actionRedisSaver } from "../../../lib/utils/actionRedisSaver";

export const searchController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await actionRedisSaver(req);
		const domain = req.body.context.domain;
		let search_type = await redis.get(
			`${req.body.context.transaction_id}-search_type`
		);
		let file;

		if (search_type === "search" || search_type === "ack" || !search_type) {
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
					path.join(ONEST_EXAMPLES_PATH, "on_search/on_search.yaml")
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
		logger.error(
			"searchController: Error occurred for transaction id",
			req.body.transaction_id,
			error
		);

		return next(error);
	}
};
