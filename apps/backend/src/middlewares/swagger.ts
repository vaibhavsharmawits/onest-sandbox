import swaggerUi from "swagger-ui-express";
import { NextFunction, Request, Response } from "express";
import swaggerAuthSpec from "openapi-specs/auth.json";
import swaggerMiscSpec from "openapi-specs/misc.json";

export const authSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerAuthSpec)(req, res, next);
	};

export const miscSwagger =
	(url: string) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.originalUrl.includes(url)) return next();
		swaggerUi.setup(swaggerMiscSpec)(req, res, next);
	};
