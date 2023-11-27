import { ClubBadgeBg, ClubDetails, ClubName } from "@/components/Calendar/CalendarStyle";
import { Form as CustomForm } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import config from "@/config";
import { getPlayerPositionHexColor, openErrorNotification, openSuccessNotification } from "@/lib/helpers";
import { useGetMatchQuery, useGetMatchStatisticsQuery, useLazyImportMatchStatisticsQuery, useUpdateMatchStatisticsMutation } from "@/services/matchesApi";
import { useGetPlayersQuery } from "@/services/playersApi";
import { CheckOutlined, DownloadOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Flex, Form, Skeleton, Space, Spin, Table, Tag, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { TableStyle } from "./GameStatsManagementStyle";
import { MatchStats } from "@/components/Stats/MatchStats";
import { theme } from "@/styles/theme";

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
	//todo
};

type GameStatsManagementState = {
	allEvents: { [n: number]: Statistic }
	homeScore: number
	awayScore: number
	validStats: boolean
	isProcessing: boolean
}

export const GameStatsManagement = (props: GameStatsMangementProps) => {
	const { id } = useParams();
	const { t } = useTranslation();
	const navigate = useNavigate();
	
	const PositionLabels: any = {
		0: t("player.coachShort"),
		1: t("player.goalkeeperShort"),
		2: t("player.defenderShort"),
		3: t("player.midfielderShort"),
		4: t("player.attackerShort")
	};

	const [updateMatchStats] = useUpdateMatchStatisticsMutation();

	const [state, setState] = useState<GameStatsManagementState>({
		allEvents: [],
		homeScore: 0,
		awayScore: 0,
		validStats: true,
		isProcessing: false,
	});

	const { data: match, isFetching: matchLoading, isError: matchError, isSuccess: matchSuccess } = useGetMatchQuery(+(id || 0));
	const { data: players, isLoading: playersLoading, isError: playersError, isSuccess: playersSucces } = useGetPlayersQuery();
	const { data: stats } = useGetMatchStatisticsQuery(+(id || 0));
	const [importMatchStatistics, { data: importedStats, isLoading: matchStatisticsImportLoading, isSuccess: matchStatisticsImportSuccess }] = useLazyImportMatchStatisticsQuery();

	const matchPlayers = useMemo(
		() => players?.filter((p: Player) => (p.clubId === match?.home?.id)).sort((a: Player, b:Player) => a.positionId - b.positionId)
			.concat(players?.filter((p: Player) => (p.clubId === match?.away?.id)).sort((a: Player, b:Player) => a.positionId - b.positionId))
		, [match, players]);
	const splitHomeAwayPlayers = useMemo(() => matchPlayers?.findIndex((p: Player) => p.clubId === match?.away?.id), [matchPlayers, match]);
	const sortedEvents = useMemo(() => Object.values(state.allEvents)?.sort(
		(s1: Statistic, s2: Statistic) => {
			const p1 = matchPlayers.find((v: Player) => v.id === s1.playerId);
			const p2 = matchPlayers.find((v: Player) => v.id === s2.playerId);
			if(p1 && p2) {
				if(p1.clubId == p2.clubId) {
					return p1.positionId - p2.positionId;
				} else {
					match.homeId < match.awayId ? p1.clubId - p2.clubId : p2.clubId - p1.clubId;
				}
			}
		}
	), [state.allEvents]);

	const [form] = Form.useForm();

	const onFieldsChange = (values: any) => {
		const playersArray = Object.values(values);
		const homePlayers = playersArray.slice(0, splitHomeAwayPlayers);
		const awayPlayers = playersArray.slice(splitHomeAwayPlayers);
		const homeScore = homePlayers.reduce((acc: number, value: any) => acc + (value.goals || 0), 0);
		const awayScore = awayPlayers.reduce((acc: number, value: any) => acc + (value.goals || 0), 0);
		const validStats = playersArray.reduce((acc: number, value: any) => acc + (value.motm || 0), 0) === 1;

		setState((state) => ({ ...state, homeScore, awayScore, validStats }));
	};

	useEffect(() => {
		if (stats && matchPlayers) {
			const allStats = matchPlayers?.map((p: Player) => {
				const playerStat = stats?.find((s: Statistic) => s.playerId === p.id);
				if (playerStat) {
					return { ...playerStat };
				} else {
					return {
						playerId: p.id,
						matchId: +(id || 0),
					};
				}
			}) || [];
			form.setFieldsValue(allStats);
			setState((state) => ({ ...state, allEvents: allStats }));
			onFieldsChange(allStats);
		}
	}, [matchPlayers, stats]);

	useEffect(() => {
		if (importedStats && matchPlayers) {
			const allStats = matchPlayers?.map((p: Player) => {
				const playerStat = importedStats?.find((s: Statistic) => s.playerId === p.externalId);
				if (playerStat) {
					return { ...playerStat, playerId: p.id };
				} else {
					return {
						playerId: p.id,
						matchId: +(id || 0),
					};
				}
			}) || [];
			const statsObj: Record<number, Statistic> = {};
			allStats.forEach((p, idx) => statsObj[idx] = p);
			form.setFieldsValue(allStats);
			setState((state) => ({ ...state, allEvents: statsObj }));
			onFieldsChange(allStats);
		}
	}, [importedStats]);

	useEffect(() => {
		if (matchStatisticsImportSuccess) {
			openSuccessNotification({
				title: "Matchdata is geïmporteerd.",
				icon: <CheckOutlined />,
				message: "Check de data grondig!"
			});
		}
	}, [matchStatisticsImportSuccess]);

	const columns = [
		{
			title: () => <>Speler</>,
			dataIndex: "playerId",
			width: "6rem",
			render: (txt: number, rec: any, index: number) => {
				const player = matchPlayers.find((v: Player) => v.id === txt);
				const playerPositionColor = getPlayerPositionHexColor(player, theme);
				const clubBadge = `${config.API_URL}/static/badges/${player?.clubId === match.home.id ? match.home.externalId : match.away.externalId}.png`;
				++index;
				return (
					<Flex justify={"space-between"}>
						<ClubBadgeBg src={clubBadge}/>
						<ClubName className="team-name" fullName={player?.short} shortName={player?.short}></ClubName>
						<Tag color={playerPositionColor}>{PositionLabels[player.positionId]}</Tag>
					</Flex>
				);
			}
		},
	].concat(config.STATISTICS.map((stat: any) => ({
		title: () => <Tooltip placement="top" title={stat.full} key={`${stat.type}-${stat.slug}`}>{stat.short}</Tooltip>,
		dataIndex: stat.slug,
		width: "1rem",
		textAlign: "center",
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

	const onFormSubmit = (form: any) => {
		setState((state) => ({ ...state, isProcessing: true }));
		form.validateFields()
			.then((formObj: any) => Object.values(formObj).map((value: any, idx: any) => ({ ...value, playerId: matchPlayers[idx].id })))
			.then((playerStats: any) => updateMatchStats({ matchId: +(id || 0), stats: playerStats, score: { home: state.homeScore, away: state.awayScore } }))
			.then(() => navigate("/admin/games"));
	};

	return (
		<Spin spinning={matchLoading || playersLoading || matchStatisticsImportLoading || state.isProcessing} delay={0} style={{ padding: "2rem 0" }}>
			<MatchStats matchId={+id} homeScore={state.homeScore} awayScore={state.awayScore} />
			{
				matchStatisticsImportSuccess ?
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
			{
				!state.validStats &&
				<Alert
					message="Ongeldige statistieken"
					description="Check de MOTM, er is er geen of meerdere toegekend. Er kan slechts één MOTM zijn."
					type="error"
					showIcon
				/>
			}
			<CustomForm
				colon={false}
				form={form}
				layout="horizontal"
				name={`form_match_${id}`}
				onFieldsChange={() => onFieldsChange(form.getFieldsValue())}
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
					<Button disabled={!state.validStats} onClick={() => onFormSubmit(form)}>
						Opslaan
					</Button>
				</Col>
			</Row>
		</Spin>
	);
};