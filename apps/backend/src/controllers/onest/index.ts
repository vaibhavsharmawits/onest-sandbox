import { Router } from "express";
import { bapRouter } from "../onest/bap";
import { bppRouter } from "../onest/bpp";
import { authValidatorMiddleware } from "../../middlewares";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { initiateRouter } from "../onest/initiate";

export const onestRouter = Router();
onestRouter.use(authValidatorMiddleware);
onestRouter.use(rateLimiter);
onestRouter.use("/bap", bapRouter);
onestRouter.use("/bpp", bppRouter);
onestRouter.use("/initiate", initiateRouter)