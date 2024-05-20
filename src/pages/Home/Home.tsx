import { Link, Navigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { CardStyle, HomeStyle } from "./HomeStyle";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { Button } from "@/components/UI/Button/Button";
import { useAppSelector } from "@/reducers";
import Title from "antd/es/typography/Title";
import Meta from "antd/es/card/Meta";
import { Card } from "antd";
import config from "@/config";

export declare type HomeProps = {
	// onLogOut?: () => void
}

export const Home = (props: HomeProps) => {
	const authenticated = useAppSelector((state) => state.userState.authenticated);
	const teams: any[] = [];
	const { t } = useTranslation();
	const redirectToMyTeams = true;
	const team = teams && teams[0];

	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
	const options = {
		redirect_uri: `${config.API_URL}/user/oauth/google`,
		client_id: config.GOOGLE_CLIENT_ID,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(
			" "
		),
	};
	const qs = new URLSearchParams(options);

	return (
		<HomeStyle>
			{
				redirectToMyTeams && team && <Navigate to={{ pathname: `/team/${teams[0].id}` }} ></Navigate>
			}
			{
				!authenticated ?
					<Row className="login">
						<Col md={12} lg={12} sm={24} xs={24}>
							<h2>{t("home.title")}</h2>
							<p>{t("home.welcome")}</p>
						</Col>
						<Col md={12} lg={12} sm={24} xs={24}>
							<Link to={`${rootUrl}?${qs.toString()}`}>
								<Button className="playNow">
									{t("home.playBtn")}
								</Button>
							</Link>
						</Col>
					</Row>
					: null
			}

			<Row gutter={32}>
				<Col span={24}>
					<Title level={2}>{t("home.howDoesItWork")}</Title>
				</Col>
			</Row>
			<Row gutter={32}>
				<Col xs={24} md={12}>
					<CardStyle>
						<Card
							hoverable
							style={{ minWidth: 240 }}
							bordered={false}
							cover={
								<img
									alt={t("general.home.step1.title")}
									src="/img/stap1_wk22.jpg"
								/>
							}
						>
							<Meta
								description={t("general.home.step1.description")}
							/>
						</Card>
					</CardStyle>
				</Col>
				<Col xs={24} md={12}>
					<CardStyle>
						<Card
							hoverable
							style={{ minWidth: 240 }}
							bordered={false}
							cover={
								<img
									alt={t("general.home.step2.title")}
									src="/img/stap2_wk22.jpg"
								/>
							}
						>
							<Meta
								description={t("general.home.step2.description")}
							/>
						</Card>
					</CardStyle>
				</Col>
			</Row>
			<Row gutter={32}>
				<Col xs={24} md={12}>
					<CardStyle>
						<Card
							hoverable
							style={{ minWidth: 240 }}
							bordered={false}
							cover={
								<img
									alt={t("general.home.step3.title")}
									src="/img/stap3_wk22.jpg"
								/>
							}
						>
							<Meta
								description={t("general.home.step3.description")}
							/>
						</Card>
					</CardStyle>
				</Col>
				<Col xs={24} md={12}>
					<CardStyle>
						<Card
							hoverable
							style={{ minWidth: 240 }}
							bordered={false}
							cover={
								<img
									alt={t("general.home.step4.title")}
									src="/img/stap4_wk22.jpg"
								/>
							}
						>
							<Meta
								description={t("general.home.step4.description")}
							/>
						</Card>
					</CardStyle>
				</Col>
			</Row>
		</HomeStyle>
	);
};