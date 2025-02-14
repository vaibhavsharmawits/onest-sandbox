import { Router } from "express";
import { searchController } from "./search";
import { initController } from "./init";
import { selectController } from "./select";
import { confirmController } from "./confirm";
import { statusController } from "./status";
import { updateController } from "./update";
import { cancelController } from "./cancel";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";
import { ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { stateValidator } from "../../../middlewares/stateValidator";

export const bppRouter = Router();

bppRouter.post(
	"/search",
	jsonSchemaValidator({ domain: "onest", action: "search" }),
	stateValidator(ACTION_KEY.SEARCH),
	redisRetriever,
	searchController
);

bppRouter.post(
	"/select",
	jsonSchemaValidator({ domain: "onest", action: "select" }),
	stateValidator(ACTION_KEY.SELECT),
	redisRetriever,
	selectController
);

bppRouter.post(
	"/init",
	jsonSchemaValidator({ domain: "onest", action: "init" }),
	stateValidator(ACTION_KEY.INIT),
	redisRetriever,
	initController
);

bppRouter.post(
	"/confirm",
	jsonSchemaValidator({ domain: "onest", action: "confirm" }),
	stateValidator(ACTION_KEY.CONFIRM),
	redisRetriever,
	confirmController
);

bppRouter.post(
	"/cancel",
	jsonSchemaValidator({ domain: "onest", action: "cancel" }),
	stateValidator(ACTION_KEY.CANCEL),
	redisRetriever,
	cancelController
);

bppRouter.post(
	"/status",
	jsonSchemaValidator({ domain: "onest", action: "status" }),
	stateValidator(ACTION_KEY.STATUS),
	redisRetriever,
	statusController
);

bppRouter.post(
	"/update",
	jsonSchemaValidator({ domain: "onest", action: "update" }),
	stateValidator(ACTION_KEY.UPDATE),
	redisRetriever,
	updateController
);
