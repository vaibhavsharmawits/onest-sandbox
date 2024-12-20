import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Analyse, Landing, Sandbox, Sign } from "./pages";
import {
	AnalyseProvider,
	DomainProvider,
	MessageProvider,
	SandboxProvider,
} from "./utils/context";
import {
	MiscSwagger,
} from "./pages/swagger/domains";
import { OnestSandbox } from "./pages/sandbox/domains";
import Readme from "./pages/readme";
import { Swagger } from "./pages/swagger";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				path: "/",
				Component: Landing,
			},
			{
				path: "/user-guide",
				Component: Readme,
			},
			{
				path: "/sign-check",
				Component: Sign,
			},
			{
				path: "/sandbox",
				Component: () => (
					<SandboxProvider>
						<Sandbox />
					</SandboxProvider>
				),
				children: [
					{
						path: "onest",
						Component: OnestSandbox,
					},
				],
			},
			{
				path: "/swagger/misc",
				Component: MiscSwagger,
			},
			{
				path: "/swagger",
				Component: Swagger,
			},
			{
				path: "/analyse",
				Component: () => (
					<AnalyseProvider>
						<Analyse />
					</AnalyseProvider>
				),
			},
		],
	},
]);

export default function App() {
	return (
		<MessageProvider>
			<DomainProvider>
				<RouterProvider router={router} />
			</DomainProvider>
		</MessageProvider>
	);
}
