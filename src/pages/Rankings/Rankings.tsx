import { ContainerStyle, TableStyle } from "@/components/PlayerList/PlayerListStyle";
import { Row } from "@/components/UI/Grid/Grid";
import { useGetTeamRankingsQuery } from "@/services/teamsApi";
import { Col } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useTranslation } from "react-i18next";

type RankingsProps = {
	q?: null
}

export const Rankings = (props: RankingsProps) => {
	const [t] = useTranslation();
	const { data, isLoading } = useGetTeamRankingsQuery();

	const columns = [
		{
			title: "#",
			key: "rank",
			dataIndex: "team",
			width: "10%",
			render: (team: Team) => {
				return <b>{team.rank ? team.rank : "-"}</b>;
			}
		},
		{
			title: t("rankingsPage.rankingsTableTeamColumnName"),
			key: "team",
			dataIndex: "team",
			width: "60%",
			render: (team: Team, record: any) =>
				<React.Fragment>
					<b>{team.name}</b>
					<span style={{ display: "block", fontSize: "11px" }}>
						{`${record.user.firstName} ${record.user.lastName}`}
					</span>
				</React.Fragment>
		},
		{
			title: t("rankingsPage.rankingsTablePointsColumnName"),
			key: "points",
			dataIndex: "team",
			width: "20%",
			align: "right",
			render: (team: Team) =>
				<span>{team.points || 0}</span>
		}
	];

	return (
		<React.Fragment>
			<Row style={{ paddingBottom: "20px" }}>
				<Col md={24} sm={24} xs={24}>
					<Title level={2}>{t("rankingsPage.rankingsTitle")}</Title>
				</Col>
				<Col md={24} sm={24} xs={24} style={{ marginTop: "10px" }}>
					<ContainerStyle>
						<TableStyle
							columns={columns}
							dataSource={data}
							showHeader={true}
							loading={isLoading}
							locale={{ emptyText: t("rankingsPage.rankingsNotAvailableYet") }}
							rowKey={(rec: any, idx: number) => `record-${idx + 1}`}
							rowClassName={(rec: any, idx: number) => idx % 2 ? "ant-table-row--odd" : "ant-table-row--even"}
						/>
					</ContainerStyle>
				</Col>
			</Row>
		</React.Fragment>
	);
};