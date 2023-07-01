import { Block } from "@/components/Block/Block";
import { PlayerStatsList } from "@/components/PlayerStatsList/PlayerStatsList";
import { Col, Row } from "@/components/UI/Grid/Grid";
import Title from "antd/es/typography/Title";
import React from "react";
import { useTranslation } from "react-i18next";

export const Stats = () => {
	const { t } = useTranslation();

	return (
		<React.Fragment>
			<Row style={{ display: "block !important" }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Block>
						<Row>
							<Title level={2}>{t("stats.playersGeneralStatsTitle")}</Title>
						</Row>
						<Row>
							<PlayerStatsList
								size={10}
								showHeader={true}
							/>
						</Row>
					</Block>
				</Col>
			</Row>
		</React.Fragment>
	);
};