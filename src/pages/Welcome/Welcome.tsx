import { Block } from "@/components/Block/Block";
import { Button } from "@/components/UI/Button/Button";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export const Welcome = () => {
	const application = useSelector((state: StoreState) => state.application);
	const navigator = useNavigate();
	const [t] = useTranslation();

	return (
		<React.Fragment>
			<Row>
				<Title level={1}>Welkom bij {application.title}</Title>
			</Row>
			<Row>
				<Block>
					<p>
						De gegevens van je Google-account zijn hergebruikt om in te loggen. <br />
						De instapkosten om mee te doen aan deze competitie is: <b>€10</b>.<br />
						Dit kan je overschrijven op volgend rekeningnummer: <b>BE54 1234 4567 8970</b>.
					</p>

					<p>
						Doe dit voor de start van de competitie. Na de eerste speeldag worden de teams waarvoor geen inschrijvingsgeld is betaald, verwijderd.
					</p>

					<p>
						De winst wordt verdeeld volgens eindklassering via volgende verdeelsleutel (op basis van het totale inschrijvingsgeld):
						<ol>
							<li>40%</li>
							<li>30%</li>
							<li>15%</li>
							<li>10%</li>
							<li>5%</li>
						</ol>
					</p>
				</Block>
			</Row>
			<Row>
				<Button
					onClick={(e: any) => navigator("/new")}
					type="primary"
					style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
					size="large"
				>
					<PlusOutlined style={{ marginRight: "10px" }} />
					{t("team.newTeam")}
				</Button>
				<Button
					onClick={(e: any) => navigator("/profile")}
					type="primary"
					style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
					size="large"
				>
					<UserOutlined style={{ marginRight: "10px" }} />
					{t("profile.view")}
				</Button>
			</Row>
		</React.Fragment>
	);
};