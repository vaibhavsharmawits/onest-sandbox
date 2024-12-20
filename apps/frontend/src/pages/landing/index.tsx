import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import ONDC_logo from "../../assets/images/ONDC_logo.png";
import ONEST_logo from "../../assets/images/ONEST_logo.png";
import {
	BackgroundContainer,
	CustomButton,
	InfoPanel,
	StyledBox,
} from "./styles";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
	const navigate = useNavigate();
	const openReadme = () => {
		navigate("/user-guide");
	};

	return (
		<>
			<BackgroundContainer>
				<Container
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
					maxWidth="xl"
				>
					<img
						src={ONDC_logo}
						style={{ marginRight: "16px", height: "55px" }}
					/>
					<CustomButton
						onClick={openReadme}
						color="primary"
						variant="contained"
					>
						Open User Guide
					</CustomButton>
				</Container>

				<Container
					style={{
						display: "flex",
						justifyContent: "flex-start",
						height: "100%",
					}}
					maxWidth="xl"
				>
					<InfoPanel>
						<Typography
							variant="h5"
							fontSize="25px"
							fontWeight="500"
							color="text.secondary"
							gutterBottom
						>
							<b>About Us</b>
						</Typography>
						<Typography fontSize="15px" color="GrayText">
							<b>
								This platform aids in developing and testing Buyer and Seller
								Network participants by providing a simulated environment.
								Developers can test and validate integrations without needing a
								counterpart. It supports ONEST domain, allowing for Seller
								testing via sandbox or payload uploads. Mock requests to BPP
								(Seller) and BAP (Buyer) servers are facilitated, with schema
								validation required for all requests. Sandbox mode requires an
								authorization header. Schema validation failures result in a
								NACK response, while successful validations result in an ACK
								response. Curl requests can also be made to sandbox
								environments.
							</b>
						</Typography>
					</InfoPanel>
					<StyledBox>
						<Typography variant="h3" fontSize="50px">
							Welcome to ONDC ONEST Sandbox
						</Typography>
						<Container
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								gap: "16px", // Adds space between images
							}}
						>
							<img
								src={ONDC_logo}
								style={{
									marginRight: "-3rem",
									width: "150px",
									height: "150px",
									objectFit: "contain",
								}}
								alt="ONDC Logo"
							/>
							<img
								src={ONEST_logo}
								style={{
									width: "350px",
									height: "150px",
									objectFit: "contain",
								}}
								alt="ONEST Logo"
							/>
						</Container>

						<Typography
							gutterBottom
							color="GrayText"
							// sx={{ marginBottom: "50px" }}
							maxWidth="90%"
						>
							Let's imitate the characteristics of ONDC production environment
							in a dedicated testing environment.
						</Typography>
						<Typography variant="h5" gutterBottom sx={{ alignItems: "left" }}>
							To get started, Select Onest domain from the Navigation menu.
						</Typography>
					</StyledBox>
				</Container>
			</BackgroundContainer>
		</>
	);
};
