import {
	ClubBadgeBg,
	ClubName,
} from "@/components/Calendar/CalendarStyle";
import { Col, Row } from "@/components/UI/Grid/Grid";
import config from "@/config";
import {
	getPlayerPositionHexColor,
	openErrorNotification,
	openSuccessNotification,
} from "@/lib/helpers";
import {
	useGetMatchQuery,
	useGetMatchStatisticsQuery,
	useLazyImportMatchStatisticsQuery,
	useUpdateMatchStatisticsMutation,
} from "@/services/matchesApi";
import { useGetPlayersQuery } from "@/services/playersApi";
import {
	CheckOutlined,
	CloseOutlined,
	DownloadOutlined,
} from "@ant-design/icons";
import {
	Alert,
	Button,
	Spin,
	Tag,
	Tooltip,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { TableStyle } from "./GameStatsManagementStyle";
import { MatchStats } from "@/components/Stats/MatchStats";
import { theme } from "@/styles/theme";
import { useSelector } from "react-redux";
import { PlayerStatsModal } from "./PlayerStatsModal";
import styled from "@/styles/styled-components";

const GameStatsManagementStyle = styled.div`
	.ant-table-tbody > tr > td{
		padding: 0 !important;
	}
`;

type GameStatsMangementProps = {
  //todo
};

type GameStatsManagementState = {
  playerStats: any[];
  homeScore: number;
  awayScore: number;
  validStats: boolean;
  isProcessing: boolean;
};
type PlayerStatsModalState = {
  open: boolean;
  index: number;
};

export const GameStatsManagement = (props: GameStatsMangementProps) => {
	const { id } = useParams();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const application = useSelector((state: StoreState) => state.application);
	const assetsCdn = application.competition.assetsCdn;

	const PositionLabels: any = {
		0: t("player.coachShort"),
		1: t("player.goalkeeperShort"),
		2: t("player.defenderShort"),
		3: t("player.midfielderShort"),
		4: t("player.attackerShort"),
	};

	const [updateMatchStats] = useUpdateMatchStatisticsMutation();

	const [state, setState] = useState<GameStatsManagementState>({
		playerStats: [],
		homeScore: 0,
		awayScore: 0,
		validStats: true,
		isProcessing: false,
	});
	const [playerState, setPlayerState] = useState<PlayerStatsModalState>({
		open: false,
		index: 0,
	});
	const [spinning, setSpinning] = useState<boolean>(true);

	const {
		data: match,
		isFetching: matchLoading,
		isError: matchError,
		isSuccess: matchSuccess,
	} = useGetMatchQuery(+(id || 0));
	const {
		data: players,
		isLoading: playersLoading,
		isError: playersError,
		isSuccess: playersSucces,
	} = useGetPlayersQuery();
	const {
		data: stats,
		isLoading: statsLoading,
		isError: statsError,
		isSuccess: statsStucces,
	} = useGetMatchStatisticsQuery(+(id || 0));
	const [
		importMatchStatistics,
		{
			data: importedStats,
			isLoading: matchStatisticsImportLoading,
			isSuccess: matchStatisticsImportSuccess,
			isError: matchStatisticsImportError,
			error: matchStatisticsImportErrorData,
		},
	] = useLazyImportMatchStatisticsQuery();

	useEffect(() => {
		setSpinning(matchLoading || playersLoading || statsLoading);
	}, [matchLoading, playersLoading, matchStatisticsImportLoading]);

	const playersReduced = useMemo(
		() =>
			players
				?.filter((p: Player) =>
					[match?.home.id, match?.away?.id].includes(p.clubId)
				)
				.sort((pA: Player, pB: Player) => pA.positionId - pB.positionId)
				.sort((pA: Player, pB: Player) => pA.clubId - pB.clubId)
				.map((p: Player, index: number) => ({
					playerId: p.id,
					clubId: p.clubId,
					positionId: p.positionId,
					short: p.short,
				})),
		[players, match]
	);

	useEffect(() => {
		const playersWithStats = playersReduced?.map((p: any) => {
			const statsPlayer = stats?.find(
				(s: Statistic) => s.playerId == p.playerId
			);
			return statsPlayer ? { ...p, ...statsPlayer } : p;
		});
		setState((state: GameStatsManagementState) => ({
			...state,
			homeScore: playersWithStats?.filter((p: any) => p?.clubId === match.home?.id).reduce((acc: number, val: any) => acc + val.goals, 0),
			awayScore: playersWithStats?.filter((p: any) => p?.clubId === match.away?.id).reduce((acc: number, val: any) => acc + val.goals, 0),
			playerStats: playersWithStats,
		}));
	}, [playersReduced, stats]);

	useEffect(() => {
		if(matchStatisticsImportSuccess) {
			const playersWithImportedStats = playersReduced?.map((p: any) => {
				const importedStatsPlayer = importedStats?.find(
					(s: Statistic) => s.playerId == p.playerId
				);
				return importedStatsPlayer ? { ...p, ...importedStatsPlayer } : p;
			});
			setState((state: GameStatsManagementState) => ({
				...state,
				homeScore: playersWithImportedStats?.filter((p: any) => p?.clubId === match.home?.id).reduce((acc: number, val: any) => acc + val.goals, 0),
				awayScore: playersWithImportedStats?.filter((p: any) => p?.clubId === match.away?.id).reduce((acc: number, val: any) => acc + val.goals, 0),
				playerStats: playersWithImportedStats,
			}));
		}
	}, [playersReduced, importedStats]);

	useEffect(() => {
		if (matchStatisticsImportSuccess) {
			openSuccessNotification({
				title: "Matchdata is geïmporteerd.",
				icon: <CheckOutlined />,
				message: "Check de data grondig!",
			});
		} else if(matchStatisticsImportError) {
			openErrorNotification({
				title: "Fout bij importeren",
			});
		}
	}, [matchStatisticsImportSuccess, matchStatisticsImportError]);

	const openEditModal = (index: number) => {
		setPlayerState({ open: true, index });
	};

	const columns = [
		{
			title: () => <p>Club</p>,
			dataIndex: "clubId",
			width: "1rem",
			align: "center",
			render: (clubId: number, s: any, index: number) => (
				<ClubBadgeBg
					className="small"
					src={`${assetsCdn}/badges/${
						clubId === match.home.id ? match.home.id : match.away.id
					}.png`}
				/>
			),
		},
		{
			title: <p>Speler</p>,
			dataIndex: "short",
			width: "3.5rem",
			align: "left",
			render: (short: string, s: any, index: number) => (
				<Button onClick={() => openEditModal(index)}>
					<ClubName className="team-name" fullName={short} shortName={short} />
				</Button>
			),
		},
		{
			title: <p>Pos</p>,
			dataIndex: "positionId",
			width: "2rem",
			align: "center",
			render: (positionId: number, s: any, index: number) => (
				<Tag color={getPlayerPositionHexColor({ positionId }, theme)}>
					{PositionLabels[positionId]}
				</Tag>
			),
		},
	].concat(
		config.STATISTICS.reduce(
			(acc: any, value: any) => acc.concat(value),
			[]
		).map((stat: any) => ({
			title: () => (
				<Tooltip
					placement="top"
					title={stat.full}
					key={`${stat.type}-${stat.slug}`}
				>
					{stat.short}
				</Tooltip>
			),
			dataIndex: stat.slug,
			width: "1rem",
			align: "center",
			render: (statValue: any, s: any, index: number) => (
				<p>
					{stat.type === "number" ? (
						statValue
					) : statValue ? (
						<CheckOutlined />
					) : (
						<CloseOutlined />
					)}
				</p>
			),
		}))
	);

	const onFormSubmit = () => {
		updateMatchStats({
			matchId: +(id || 0),
			stats: state.playerStats.map((p: any) => ({
				...p,
				goalsAgainst: (p?.clubId === match?.home?.id ? match.awayScore : match.homeScore) || 0,
			})),
			score: { home: state.homeScore, away: state.awayScore },
		});
		navigate("/admin/games");
	};

	return (
		<GameStatsManagementStyle>
			<Spin spinning={spinning} style={{ padding: "2rem 0" }}>
				<MatchStats
					matchId={+id}
					homeScore={state.homeScore}
					awayScore={state.awayScore}
					assetsCdn={assetsCdn}
				/>
				{matchStatisticsImportSuccess ? (
					<Alert
						message="Data controleren"
						description="Check de data met gerespecteerde databronnen (bv. Opta). Duid ook de MOTM aan volgens de officiële kanalen van FIFA/UEFA."
						type="warning"
						showIcon
					/>
				) : (
					<Button
						icon={<DownloadOutlined />}
						onClick={() => importMatchStatistics(+(id || 0))}
					>
						{t("admin.gamestatistic.import")}
					</Button>
				)}
				{!state.validStats && (
					<Alert
						message="Ongeldige statistieken"
						description="Check de MOTM, er is er geen of meerdere toegekend. Er kan slechts één MOTM zijn."
						type="error"
						showIcon
					/>
				)}
				<TableStyle
					columns={columns}
					dataSource={state.playerStats}
					rowKey={"playerId"}
					pagination={false}
					sticky={true}
				/>
				<Row justify="center" align="middle">
					<Col span={24}>
						<Button onClick={() => onFormSubmit()}>Opslaan</Button>
					</Col>
				</Row>
				<PlayerStatsModal
					open={playerState.open}
					playerStats={state.playerStats?.at(playerState.index)}
					onConfirm={(ps: any) => {
						const playerStats = [...state.playerStats];
						if (playerStats.length > playerState.index && playerState.index >= 0) {
							playerStats[playerState.index] = {
								...playerStats[playerState.index],
								...ps,
								goalsAgainst: (ps.clubId === match.home?.id) ? state.awayScore : state.homeScore
							};
						}
						const homeScore = playerStats.filter((p: any) => p?.clubId === match.home?.id).reduce((acc: number, val: any) => acc + val.goals, 0);
						const awayScore = playerStats.filter((p: any) => p?.clubId === match.away?.id).reduce((acc: number, val: any) => acc + val.goals, 0);
						setState((state: GameStatsManagementState) => ({ ...state, playerStats, awayScore, homeScore }));
						setPlayerState({ index: 0, open: false });
					}}
					onCancel={() => setPlayerState({ ...playerState, open: false })}
				/>
			</Spin>
		</GameStatsManagementStyle>
	);
};
