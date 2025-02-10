import { Router } from "express";
import { onSearchController } from "./onSearch";
import { onInitController } from "./onInit";
import { onSelectController } from "./onSelect";
import { onConfirmController } from "./onConfirm";
import { onStatusController } from "./onStatus";
import { onUpdateController } from "./onUpdate";
import { onCancelController } from "./onCancel";
import { jsonSchemaValidator, redisRetriever } from "../../../middlewares";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { stateValidator } from "../../../middlewares/stateValidator";

export const bapRouter = Router();

bapRouter.post(
	"/on_search",
	jsonSchemaValidator({ domain: "onest", action: "on_search" }),
	stateValidator(ON_ACTION_KEY.ON_SEARCH),
	redisRetriever,
	onSearchController
);

bapRouter.post(
	"/on_select",
	jsonSchemaValidator({ domain: "onest", action: "on_select" }),
	stateValidator(ON_ACTION_KEY.ON_SELECT),
	redisRetriever,
	onSelectController
);

bapRouter.post(
	"/on_init",
	jsonSchemaValidator({ domain: "onest", action: "on_init" }),
	stateValidator(ON_ACTION_KEY.ON_INIT),
	redisRetriever,
	onInitController
);

bapRouter.post(
	"/on_confirm",
	jsonSchemaValidator({ domain: "onest", action: "on_confirm" }),
	stateValidator(ON_ACTION_KEY.ON_CONFIRM),
	redisRetriever,
	onConfirmController
);

bapRouter.post(
	"/on_status",
	jsonSchemaValidator({ domain: "onest", action: "on_status" }),
	stateValidator(ON_ACTION_KEY.ON_STATUS),
	redisRetriever,
	onStatusController
);

bapRouter.post(
	"/on_update",
	// jsonSchemaValidator({ domain: "onest", action: "on_update" }),
	stateValidator(ON_ACTION_KEY.ON_UPDATE),
	redisRetriever,
	onUpdateController
);

bapRouter.post(
	"/on_cancel",
	jsonSchemaValidator({ domain: "onest", action: "on_cancel" }),
	stateValidator(ON_ACTION_KEY.ON_CANCEL),
	redisRetriever,
	onCancelController
);
