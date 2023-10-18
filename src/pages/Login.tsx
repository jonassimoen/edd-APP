import { Col, Row } from "@/components/UI/Grid/Grid";
import { PageStyle } from "@/components/UI/Layout/LayoutStyle";
import { useAuth } from "@/lib/stores/AuthContext";
import { useAppSelector } from "@/reducers";
import { useContext, useMemo } from "react";
import GoogleButton from "react-google-button";
import { Navigate } from "react-router";

export const Login = () => {

	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

	const options = {
		redirect_uri: `${process.env.API_URL}/api/user/oauth/google`,
		client_id: "464382338884-rd5pci4cfmpkiaki55g4d1c2bnaln88r.apps.googleusercontent.com",
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(
			" "
		),
	};
	const qs = new URLSearchParams(options);
	
	const authenticated = useAppSelector((state) => state.userState.authenticated);

	return (
		<PageStyle>
			{authenticated && <Navigate to={{ pathname: "/home" }} />}
			{!authenticated &&
				<Row align={"middle"} justify={"center"}>
					<Col>
						<a href={`${rootUrl}?${qs.toString()}`}> <GoogleButton type="light" /> </a>
					</Col>
				</Row>
			}
		</PageStyle>
	);
};