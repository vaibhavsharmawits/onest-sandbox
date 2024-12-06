import { Router } from "express";
import { searchController } from "./search";
import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import { statusController } from "./status";
import { updateController } from "./update";
import { cancelController } from "./cancel";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";
import { ratingController } from "./rating";

export const bppRouter = Router();

bppRouter.post(
	"/search",
	jsonSchemaValidator({ domain: "onest", action: "search" }),
	redisRetriever,
	searchController
);

bppRouter.post(
	"/init",
	// jsonSchemaValidator({ domain: "onest", action: "init" }),
	redisRetriever,
	initController
);

bppRouter.post(
	"/select",
	// jsonSchemaValidator({ domain: "onest", action: "select" }),
	redisRetriever,
	selectController
);

bppRouter.post(
	"/confirm",
	// jsonSchemaValidator({ domain: "onest", action: "confirm" }),
	redisRetriever,
	confirmController
);

bppRouter.post(
	"/update",
	// jsonSchemaValidator({ domain: "onest", action: "update" }),
	redisRetriever,
	updateController
);

bppRouter.post(
	"/status",
	// jsonSchemaValidator({ domain: "onest", action: "status" }),
	redisRetriever,
	statusController
);

bppRouter.post(
	"/cancel",
	// jsonSchemaValidator({ domain: "onest", action: "cancel" }),
	redisRetriever,
	cancelController
);

bppRouter.post(
	"/rating",
	jsonSchemaValidator({ domain: "onest", action: "rating" }),
	redisRetriever,
	ratingController
);
