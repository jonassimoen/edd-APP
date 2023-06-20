import { Link, Navigate } from "react-router-dom";

import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { useAuth } from "@/lib/stores/AuthContext";
import { CardStyle, HomeStyle } from "./HomeStyle";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { Button } from "@/components/UI/Button/Button";
import { useAppSelector } from "@/reducers";
import Title from "antd/es/typography/Title";
import Meta from "antd/es/card/Meta";
import { Card } from "antd";

export declare type HomeProps = {
	// onLogOut?: () => void
}

export const Home = (props: HomeProps) => {
	const authenticated = useAppSelector((state) => state.userState.authenticated);
	const teams: any[] = [];
	const { t } = useTranslation();
	// const deadlineDate = props.matches && props.matches.info && props.matches.
	// const redirectToMyTeams = props.match.path === '/' && props.user && props.user.authenticated
	const redirectToMyTeams = true;
	const team = teams && teams[0];

	return (
		<HomeStyle>
			{
				redirectToMyTeams && team && <Navigate to={{ pathname: `/team/${teams[0].id}` }} ></Navigate>
			}
			{
				!authenticated ?
					<Row className="login">
						<Col md={12} lg={12} sm={24} xs={24}>
							<h2>{t('home.title')}</h2>
							<p>{t('home.welcome')}</p>
						</Col>
						<Col md={12} lg={12} sm={24} xs={24}>
							<Link to="/login">
								<Button className="playNow">
									{t('home.playBtn')}
								</Button>
							</Link>
						</Col>
					</Row>
					: null
			}

			<Row gutter={32}>
				<Col span={24}>
					<Title level={2}>{t('home.howDoesItWork')}</Title>
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
									alt="doe iets"
									src="/img/stap1_wk22.jpg"
								/>
							}
						>
							<Meta
								title="STAP 1"
								description="Stap 1 uilteg blablablaabfdfbaldfb"
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
									alt="doe iets"
									src="/img/stap2_wk22.jpg"
								/>
							}
						>
							<Meta
								title="STAP 2"
								description="Stap 2 uilteg blablablaabfdfbaldfb"
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
									alt="doe iets"
									src="/img/stap3_wk22.jpg"
								/>
							}
						>
							<Meta
								title="STAP 3"
								description="Stap 3 uilteg blablablaabfdfbaldfb"
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
									alt="doe iets"
									src="/img/stap4_wk22.jpg"
								/>
							}
						>
							<Meta
								title="STAP 4"
								description="Stap 4 uilteg blablablaabfdfbaldfb"
							/>
						</Card>
					</CardStyle>
				</Col>
			</Row>

			{/* {
				!authenticated ?
					<Paper
						py="lg"
						px="xl"
						my={20}
						mx={"auto"}
						bg="primaryContrast.0"
					>
						<Group position="apart">
							<Stack>
								<Title order={2} color="primaryColor.0  "> {t("home.title")}</Title>
								<Text color="white" size="lg">{t("home.welcome")}</Text>
							</Stack>
							<Link to="/login">
								<Button color="primaryColor.0" size="xl" fullWidth>
									<Text color="primaryContrast.0">{t("home.playBtn")}</Text>
								</Button>
							</Link>
						</Group>
					</Paper>
					:
					null
			} */}
			info
		</HomeStyle>
	);
};