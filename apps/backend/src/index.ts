import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import {
	authRouter,
	miscRouter,
	onestRouter,
} from "./controllers";
import cors from "cors";
import {
	authSwagger,
	miscSwagger,
	requestParser,
	globalErrorHandler,
	errorHandlingWrapper,
} from "./middlewares";
import dotenv from 'dotenv'; 	
dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use("/api-docs/auth", swaggerUi.serve, authSwagger("/api-docs/auth"));
app.use("/api-docs/misc", swaggerUi.serve, miscSwagger("/api-docs/misc"));

app.use(express.raw({ type: "*/*", limit: "1mb" }));
app.use(requestParser);
app.use("/", miscRouter);
app.use("/auth", errorHandlingWrapper(authRouter));
app.use("/onest", errorHandlingWrapper(onestRouter));
app.use("/detect_app_installation", (req: Request, res: Response) => {
	const headers = req.headers;
	return res.json({
		headers: headers,
	});
});
app.use(globalErrorHandler); // Have to remove this

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app

