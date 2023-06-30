import { Block } from "@/components/Block/Block";
import { PlayerStatsList } from "@/components/PlayerStatsList/PlayerStatsList";
import { Col, Row } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import { useTranslation } from "react-i18next";

export const Stats = () => {
	const { t } = useTranslation();

	return (
		<React.Fragment>
			<Row>
				<Col md={24} sm={24} xs={24}>
					<Block>
						<Row>
							<Title level={2}>{t("stats.playersGeneralStatsTitle")}</Title>
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