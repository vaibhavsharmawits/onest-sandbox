import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { Toolbar } from "@mui/material";
import swaggerSpec from "openapi-specs/misc.json";
import { SwaggerDownloadButton } from "../../../../components";

export const MiscSwagger = () => {
	swaggerSpec.servers = swaggerSpec.servers.map(({ url }: { url: string }) =>
		url.startsWith(import.meta.env.VITE_REACT_SERVER_URL || "https://onest-mock-service.ondc.org/api")
			? { url }
			: {
					url: import.meta.env.VITE_REACT_SERVER_URL || "https://onest-mock-service.ondc.org/api" + url.replace("/api", ""),
					// eslint-disable-next-line no-mixed-spaces-and-tabs
			  }
	);

	return (
		<>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<SwaggerDownloadButton swaggerYaml={swaggerSpec} fileName="Misc.yaml" />
			</Toolbar>
			<SwaggerUI spec={swaggerSpec} />
		</>
	);
};
