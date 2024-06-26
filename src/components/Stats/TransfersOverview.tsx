import { Col, Row } from "../UI/Grid/Grid";
import { useTranslation } from "react-i18next";
import React from "react";
import { StatsStyle, TransferListStyle, TransfersOverviewStyle } from "./TransfersOverviewStyle";
import Icon from "@ant-design/icons";
import { TransferIconSvg } from "@/styles/custom-icons";

const TransferIcon = (props: any) => <Icon component={TransferIconSvg} {...props} />;

type TransfersOverviewProps = {
	budget: number
	maxPlayersSameClub: number
	totalPlayers: number
	totalPlayersSelected: number
	remainingFreeTransfers: number
	minusPoints: number
    data: any
    size: number
    isLoading?: boolean
    showWeek?: boolean
    tax?: number | undefined
}

export const TransfersOverview = (props: TransfersOverviewProps) => {
	const {t} = useTranslation();
	const {data,size, isLoading, showWeek} = props;
	const columns = [
		{
			title: t("team.transferIn"),
			key: "inPlayer",
			dataIndex: "inPlayer",
			width: showWeek ? "30%" : "40%",
			render: (txt: string, rec: any, idx: number) => {
				const playerName = (rec.inPlayer && `${rec.inPlayer.short}`) || "";
				return (
					<div className="player-name">
						<p>{playerName}</p>
						<p>{t("general.transfer.in").toUpperCase()}</p>
					</div>
				);
			},
		},
		{
			key: "outPlayer",
			dataIndex: "outPlayer",
			width: "20%",
			render: () => <TransferIcon />,
		},
		{
			title: t("team.transferOut"),
			key: "outPlayer",
			dataIndex: "outPlayer",
			width: showWeek ? "30%" : "40%",
			render: (txt: string, rec: any, idx: number) => {
				const playerName = (rec.outPlayer && `${rec.outPlayer.short}`) || "";
				return (
					<div className="player-name">
						<p>{t("general.transfer.out").toUpperCase()}</p>
						<p>{playerName}</p>
					</div>
				);
			},
		},
	];

	if(showWeek) {
		columns.push({
			key: "weeId",
			title: t("general.matchday"),
			width: "20%",
			dataIndex: "weekId",
			render: (text: string, team: any) => {
				return <b>{text}</b>;
			}
		});
	}
	return (
		<TransfersOverviewStyle>
			<StatsStyle
				single={false}
			>
				<Row className="stat-row">
					<Col span={6}>
						<p className="points">{props.budget.toFixed(2)}M</p>
						<p className="label">{t("transfersPage.overviewBudget")}</p>
					</Col>
					<Col span={6}>
						<p className="points">{props.totalPlayersSelected}/{props.totalPlayers}</p>
						<p className="label">{t("transfersPage.overviewPlayers")}</p>
					</Col>
					<Col span={4}>
						<p className="points">{props.maxPlayersSameClub}</p>
						<p className="label">{t("team.playersSameClub")}</p>
					</Col>
					<Col span={4}>
						<p className="points">{props.minusPoints}</p>
						<p className="label">{t("transfersPage.minusPoints")}</p>
					</Col>
					<Col span={4}>
						<p className="points">{props.remainingFreeTransfers < 0 ? 0 : props.remainingFreeTransfers}</p>
						<p className="label">{t("transfersPage.overviewFreeTransfers")}</p>
					</Col>
				</Row>
			</StatsStyle>
			<TransferListStyle
				columns={columns}
				dataSource={data}
				showHeader={false}
				locale={{emptyText: t("transfersPage.noTransfersTableMessage")}}
				loading={isLoading}
				pagination={data.length > size ? { pageSize: size } : false}
				rowKey={(rec: any) => `record-${rec.outId}`}
				rowClassName={(rec: object, idx: number) => idx%2 ? "ant-table-row--odd" : "ant-table-row--even"}
			/>
		</TransfersOverviewStyle>
	);
};