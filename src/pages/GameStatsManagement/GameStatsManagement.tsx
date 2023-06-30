import { Form as CustomForm } from "@/components/UI/Form/Form";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { InputNumber } from "@/components/UI/InputNumber/InputNumber";
import { useGetMatchQuery, useGetMatchStatisticsQuery, useLazyImportMatchStatisticsQuery, useUpdateMatchStatisticsMutation } from "@/services/matchesApi";
import { useGetPlayersQuery } from "@/services/playersApi";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const GameStatsHeaderTable = (props: { name?: string, score: number }) => {
	return (
		<Row style={{ fontWeight: 500 }}>
			<Col span={6} $zeroPadding>{props.name} {props.score}</Col>
			<Col span={1} $zeroPadding style={{ fontSize: "12px" }}>Goals</Col>
			<Col span={1} $zeroPadding style={{ fontSize: "12px" }}>Goals</Col>
			<Col span={1} $zeroPadding style={{ fontSize: "12px" }}>Goals</Col>
			<Col span={1} $zeroPadding style={{ fontSize: "12px" }}>Goals</Col>
			<Col span={1} $zeroPadding style={{ fontSize: "12px" }}>Goals</Col>

		</Row>
	);
};

const GameStatsRowTable = (props: { idx: number, player: Player }) => {
	return (
		<Row>
			<Col span={6} $zeroPadding>
				<Form.Item style={{ marginBottom: 0 }} hidden name={[props.idx, "playerId"]}>
					<InputNumber size={"small"} controls={false} style={{ width: "100%" }} />
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }} hidden name={[props.idx, "matchId"]}>
					<InputNumber size={"small"} controls={false} style={{ width: "100%" }} />
				</Form.Item>
				{props.player.short}
			</Col>
			<Col span={1} $zeroPadding>
				<Form.Item style={{ marginBottom: 0 }}
					name={[props.idx, "goals"]}
				>
					<InputNumber size={"small"} controls={false} style={{ width: "100%" }} />
				</Form.Item>
			</Col>
			<Col span={1} $zeroPadding>
				<Form.Item style={{ marginBottom: 0 }}
					name={[props.idx, "assists"]}
				>
					<InputNumber size={"small"} controls={false} style={{ width: "100%" }} />
				</Form.Item>
			</Col>
			<Col span={1} $zeroPadding>
				<Form.Item style={{ marginBottom: 0 }}
					name={[props.idx, "reds"]}
				>
					<InputNumber size={"small"} controls={false} style={{ width: "100%" }} />
				</Form.Item>
			</Col>
			<Col span={1} $zeroPadding>
				<Form.Item style={{ marginBottom: 0 }}
					name={[props.idx, "yellows"]}
				>
					<InputNumber size={"small"} controls={false} style={{ width: "100%" }} />
				</Form.Item>
			</Col>
		</Row>
	);
};


type GameStatsMangementProps = {
};

type GameStatsManagementState = {
    allEvents: Statistic[],
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
	const [importMatchStatistics, { data: importedStats }] = useLazyImportMatchStatisticsQuery();

	const matchPlayers = useMemo(() =>
		players?.filter((p: Player) => (p.clubId === match?.home?.id) || (p.clubId === match?.away?.id))
			.sort((a: Player, b: Player) => a.clubId - b.clubId), [match, players]);

	const homePlayers = useMemo(() => matchPlayers?.filter((p: Player) => p.clubId === match?.home?.id), [matchPlayers]);
	const awayPlayers = useMemo(() => matchPlayers?.filter((p: Player) => p.clubId === match?.away?.id), [matchPlayers]);

	const [form] = Form.useForm();

	useEffect(() => {
		if (stats && matchPlayers) {
			const allStats = matchPlayers?.map((p: Player) => {
				const playerStat = stats?.find((s: Statistic) => s.playerId === p.id);
				if (playerStat) {
					return { ...playerStat };
				} else {
					return {
						id: 0,
						playerId: p.id,
						matchId: +(id || 0),
						goals: 0,
						assists: 0,
						reds: 0,
						yellows: 0,
					};
				}
			}) || [];
			form.setFieldsValue(allStats);
		}
	});

	useEffect(() => {
		console.log(importedStats && matchPlayers);
		if (importedStats && matchPlayers) {
			const allStats = matchPlayers?.map((p: Player) => {
				const playerStat = importedStats?.find((s: Statistic) => s.playerId === p.externalId);
				if (playerStat) {
					return { ...playerStat };
				} else {
					return {
						id: 0,
						playerId: p.id,
						matchId: +(id || 0),
						goals: 0,
						assists: 0,
						reds: 0,
						yellows: 0,
					};
				}
			}) || [];
			form.setFieldsValue(allStats);
		}

	}, [importedStats]);

	// const onChangeStatistics = (s: Statistic[]) => {
	//     setState({
	//         ...state,
	//         homeScore: s.filter((s: Statistic) => players?.find((p: Player) => p.id === s.playerId)?.clubId === match?.home?.id).map((s: Statistic) => s.goals || 0).reduce((prev: number, cur: number) => prev + cur, 0),
	//         awayScore: s.filter((s: Statistic) => players?.find((p: Player) => p.id === s.playerId)?.clubId === match?.away?.id).map((s: Statistic) => s.goals || 0).reduce((prev: number, cur: number) => prev + cur, 0),
	//         allEvents: s
	//     });
	// }

	// useEffect(() => {
	//     onChangeStatistics(FilledStats);
	// }, [FilledStats])

	return (
		<>
			<Button
				icon={<DownloadOutlined />}
				onClick={() => importMatchStatistics(+(id || 0))}
			>
				{t("admin.gamestatistic.import")}
			</Button>
			<CustomForm
				colon={false}
				form={form}
				layout="vertical"
				name={`form_match_${id}`}
				// onFieldsChange={() => onChangeStatistics(Object.values(form.getFieldsValue()))}
				style={{ padding: "2rem" }}
			>

				<GameStatsHeaderTable name={match?.home?.name} score={state.homeScore} />
				{homePlayers?.map((player: Player, index: number) =>
					(
						<GameStatsRowTable player={player} idx={index} key={`match-player-${player.id}`} />
					))}

				<GameStatsHeaderTable name={match?.away?.name} score={state.awayScore} />
				{awayPlayers?.map((player: Player, index: number) =>
					(
						<GameStatsRowTable player={player} idx={(homePlayers?.length || 0) + index} key={`match-player-${player.id}`} />
					))}

			</CustomForm>
			<Row justify="center" align="middle">
				<Col span={24}>
					<Button onClick={() => form.validateFields().then((obj: any) => updateMatchStats({ stats: Object.values(obj), matchId: +(id || 0) }))}>
                        Opslaan
					</Button>
				</Col>
			</Row>
		</>
	);
};