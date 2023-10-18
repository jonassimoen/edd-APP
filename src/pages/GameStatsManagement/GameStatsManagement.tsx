import { ClubBadgeBg, ClubDetails, ClubName } from "@/components/Calendar/CalendarStyle";
import { Form as CustomForm } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import config from "@/config";
import { openSuccessNotification } from "@/lib/helpers";
import { useGetMatchQuery, useGetMatchStatisticsQuery, useLazyImportMatchStatisticsQuery, useUpdateMatchStatisticsMutation } from "@/services/matchesApi";
import { useGetPlayersQuery } from "@/services/playersApi";
import { CheckOutlined, DownloadOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Skeleton, Spin, Table, Tooltip } from "antd";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { TableStyle } from "./GameStatsManagementStyle";

const GameStatsHeaderTable = (props: { name?: string, score: number, type: string }) => {
	return (
		<Row style={{ fontWeight: 500 }}>
			<Col span={6} $zeroPadding>{props.name} {props.score}</Col>
			{config.STATISTICS.map(stat =>
				<Tooltip placement="top" title={stat.full} key={`${props.type}-${stat.slug}`}>
					<Col span={1} $zeroPadding style={{ fontSize: "12px", textAlign: "center" }}>{stat.short}</Col>
				</Tooltip>
			)}

		</Row>
	);
};

const GameStatsRowTable = (props: { idx: number, player: Player }) => {
	return (
		<Row>
			<Col span={2} $zeroPadding>
				<Form.Item style={{ marginBottom: 0 }} hidden name={[props.idx, "playerId"]}>
					<InputNumber size={"small"} controls={false} style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }} hidden name={[props.idx, "matchId"]}>
					<InputNumber size={"small"} controls={false} style={{ width: "100%" }} />
				</Form.Item>
				{props.player.forename} <b>{props.player.surname}</b>
			</Col>
			{config.STATISTICS.map(stat =>
				<Col span={1} $zeroPadding key={`${props.player.id}-${stat.slug}`}>
					<Form.Item style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, textAlign: "center" }}
						name={[props.idx, stat.slug]}
						valuePropName={stat.type === "number" ? "value" : "checked"}
					>
						{stat.type === "number" ? <InputNumber size={"small"} controls={false} style={{ width: "100%" }} /> : <Checkbox />}
					</Form.Item>
				</Col>
			)}

		</Row>
	);
};


type GameStatsMangementProps = {
};

type GameStatsManagementState = {
	allEvents: { [n: number]: Statistic },
	homeScore: number,
	awayScore: number,
}

export const GameStatsManagement = (props: GameStatsMangementProps) => {
	const { id } = useParams();
	const { t } = useTranslation();

	const [updateMatchStats] = useUpdateMatchStatisticsMutation();

	const [state, setState] = useState<GameStatsManagementState>({
		allEvents: [],
		homeScore: 0,
		awayScore: 0,
	});

	const { data: match, isFetching: matchLoading, isError: matchError, isSuccess: matchSuccess } = useGetMatchQuery(+(id || 0));
	const { data: players, isLoading: playersLoading, isError: playersError, isSuccess: playersSucces } = useGetPlayersQuery();
	const { data: stats } = useGetMatchStatisticsQuery(+(id || 0));
	const [importMatchStatistics, { data: importedStats, isLoading: matchStatisticsImportLoading, isSuccess: matchStatisticsImportSuccess }] = useLazyImportMatchStatisticsQuery();

	const matchPlayers = useMemo(() =>
		players?.filter((p: Player) => (p.clubId === match?.home?.id) || (p.clubId === match?.away?.id))
			.sort((a: Player, b: Player) => a.clubId - b.clubId), [match, players]);

	const sortedEvents = useMemo(() => Object.values(state.allEvents)?.sort(
		(s1: Statistic, s2: Statistic) => matchPlayers.find((v: Player) => v.externalId === s1.playerId)?.clubId - matchPlayers.find((v: Player) => v.externalId === s2.playerId)?.clubId
	), [state.allEvents]);

	const [form] = Form.useForm();

	useEffect(() => {
		if (stats && matchPlayers) {
			const allStats = matchPlayers?.map((p: Player) => {
				const playerStat = stats?.find((s: Statistic) => s.playerId === p.id);
				if (playerStat) {
					return { ...playerStat };
				} else {
					return {
						playerId: p.externalId,
						matchId: +(id || 0),
					};
				}
			}) || [];
			form.setFieldsValue(allStats);
			setState({ ...state, allEvents: allStats });
		}
	}, [matchPlayers, stats]);

	useEffect(() => {
		console.log(form.getFieldsValue());
		if (importedStats && matchPlayers) {
			const allStats = matchPlayers?.map((p: Player) => {
				const playerStat = importedStats?.find((s: Statistic) => s.playerId === p.externalId);
				if (playerStat) {
					return { ...playerStat };
				} else {
					return {
						playerId: p.externalId,
						matchId: +(id || 0),
					};
				}
			}) || [];
			const statsObj: Record<number, Statistic> = {};
			allStats.forEach((p, idx) => statsObj[idx] = p);
			setState({ ...state, allEvents: statsObj });
			form.setFieldsValue(allStats);
			console.log(state.allEvents);
		}
	}, [importedStats]);

	useEffect(() => {
		if (matchStatisticsImportSuccess) {
			openSuccessNotification({
				title: "Matchdata is geïmporteerd.",
				icon: <CheckOutlined />,
				message: "Check de data grondig!"
			})
		}
	}, [matchStatisticsImportSuccess]);

	const columns = [
		{
			title: () => <>Speler</>,
			dataIndex: 'playerId',
			width: '6rem',
			render: (txt: number, rec: any, index: number) => {
				const player = matchPlayers.find((v: Player) => v.externalId === txt);
				const clubBadge = `http://localhost:8080/static/badges/${player.clubId === match.home.id ? match.home.externalId : match.away.externalId}.png`;
				++index;
				return (
					<ClubDetails>
						<ClubBadgeBg src={clubBadge} />
						<ClubName className="team-name" fullName={player?.surname} shortName={player?.short}></ClubName>
					</ClubDetails>
				)
			}
		}
	].concat(config.STATISTICS.map((stat: any) => ({
		title: () => <Tooltip placement="top" title={stat.full} key={`${stat.type}-${stat.slug}`}>{stat.short}</Tooltip>,
		dataIndex: stat.slug,
		width: '1rem',
		textAlign: 'center',
		render: (txt: any, rec: any, index: number) =>
			<Form.Item style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, textAlign: "center" }}
				name={[index, stat.slug]}
				valuePropName={stat.type === "number" ? "value" : "checked"}
			>
				{
					stat.type === "number" ?
						<InputNumber
							size={"small"}
							style={{ width: "2rem", backgroundColor: (txt > 0 ? "lightgreen" : "white") }}
							controls={false}
						/> :
						<Checkbox />
				}
			</Form.Item>
	})));

	return (
		<Spin spinning={matchLoading || playersLoading || matchStatisticsImportLoading} delay={0}>
			{matchStatisticsImportSuccess ?
				<Alert
					message="Data controleren"
					description="Check de data met gerespecteerde databronnen (bv. Opta). Duid ook de MOTM aan volgens de officiële kanalen van FIFA/UEFA."
					type="warning"
					showIcon
				/>
				:
				<Button
					icon={<DownloadOutlined />}
					onClick={() => importMatchStatistics(+(id || 0))}
				>
					{t("admin.gamestatistic.import")}
				</Button>
			}
			<CustomForm
				colon={false}
				form={form}
				layout="horizontal"
				name={`form_match_${id}`}
				onFieldsChange={() => console.log(form.getFieldsValue())}
				style={{ padding: "2rem 0" }}
			>

				{/* <GameStatsHeaderTable name={match?.home?.name} score={state.homeScore} type={'home'} /> */}
				{/* {homePlayers?.map((player: Player, index: number) =>
				(
					<GameStatsRowTable player={player} idx={index} key={`match-player-${player.id}`} />
				))} */}
				<TableStyle
					columns={columns}
					dataSource={sortedEvents}
					rowKey={"playerId"}
					pagination={false}
					sticky={true}
				/>


				{/* <GameStatsHeaderTable name={match?.away?.name} score={state.awayScore} type={'away'} />
				{awayPlayers?.map((player: Player, index: number) =>
				(
					<GameStatsRowTable player={player} idx={(homePlayers?.length || 0) + index} key={`match-player-${player.id}`} />
				))} */}

			</CustomForm>
			<Row justify="center" align="middle">
				<Col span={24}>
					<Button onClick={() => form.validateFields().then((obj: any) => updateMatchStats({ stats: Object.values(obj), matchId: +(id || 0) }))}>
						Opslaan
					</Button>
				</Col>
			</Row>
		</Spin>
	);
};