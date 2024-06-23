import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { Block } from "@/components/Block/Block";
import { Team } from "@/components/Team/Team";
import { Col, Row } from "@/components/UI/Grid/Grid";
import {
	roundNextHalf,
	selectionPlayerSellValue,
	startingListToPositionsList,
} from "@/lib/helpers";
import { useAppSelector } from "@/reducers";
import { useGetTeamQuery } from "@/services/teamsApi";
import { useGetDeadlineInfoQuery } from "@/services/weeksApi";
import Title from "antd/es/typography/Title";
import { pick } from "lodash";
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

import teamBackground from "./../../assets/img/fpl-pitch-no-boarding.svg";
import { PlayerType } from "@/types/PlayerTypes";
import { theme } from "@/styles/theme";
import { TransfersList } from "@/components/TransfersList/TransfersList";
import { Button } from "@/components/UI/Button/Button";
import { CloseCircleFilled, SaveFilled } from "@ant-design/icons";
import { Element, scroller } from "react-scroll";
import { PlayerList } from "@/components/PlayerList/PlayerList";
import { useGetMatchesQuery } from "@/services/matchesApi";
import { notification } from "antd";
import { TransfersOverview } from "@/components/Stats/TransfersOverview";
import { ConfirmModal } from "@/components/ConfirmModal/ConfirmModal";
import { Alert } from "@/components/UI/Alert/Alert";
import { TransfersStyle } from "./TransfersStyle";
import { useGetPlayersQuery } from "@/services/playersApi";
import { useGetClubsQuery } from "@/services/clubsApi";

type TransfersState = {
  notFound: boolean;
  performingTransfer: boolean;
  performingTransferReset: boolean;
  transferConfirmModalVisible: boolean;
};

const _Transfers = (props: AbstractTeamType) => {
	const [state, setState] = useState<TransfersState>({
		notFound: false,
		performingTransfer: false,
		performingTransferReset: false,
		transferConfirmModalVisible: false,
	});
	const { user, teams } = useAppSelector((state) => state.userState);

	const { id } = useParams();
	const { t } = useTranslation();

	const {competition } = useSelector((state: StoreState) => state.application);
	const { data: teamResult, isLoading: teamLoading, isError: teamError, isSuccess: teamSuccess, error: teamErrorData } = useGetTeamQuery(+(id || 0));
	const { data: deadlineInfo, isSuccess: deadlineInfoSuccess, isLoading: deadlineInfoLoading, isError: deadlineInfoError } = useGetDeadlineInfoQuery();
	const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSuccess } = useGetMatchesQuery();
	const { data: clubs, isSuccess: clubsSuccess, isLoading: clubsLoading } = useGetClubsQuery();
	const { data: players, isSuccess: playersSuccess, isLoading: playersLoading } = useGetPlayersQuery();
	
	// const clubs = JSON.parse(localStorage.getItem("_static_clubs"));
	// const players = JSON.parse(localStorage.getItem("_static_players"));
	// const {competition, playersLoading} = useSelector((state: StoreState) => state.application);

	useEffect(() => {
		if (teamSuccess && matches) {
			const weekId = props.visibleWeekId;
			const playerProps = ["id", "externalId", "name", "short", "positionId", "clubId", "value", "banned", "injury", "form", "forename", "surname", "portraitUrl"];
			const selectionProps: any[] = [];

			const starting = teamResult.players
				.filter((player: any) => player.selection.starting === 1)
				.map((player: any) => {
					const tfValue = selectionPlayerSellValue(player);
					const displayWeekMatches = matches.filter((match: any) => match.weekId >= weekId && ([match.home?.id, match.away?.id].includes(player.clubId)));
					return Object.assign({ inStarting: true, upcomingMatches: displayWeekMatches }, pick(player, playerProps), pick(player.selection, selectionProps), { value: tfValue });
				});
			const bench = teamResult.players
				.filter((player: any) => player.selection.starting === 0)
				.map((player: any) => {
					const tfValue = selectionPlayerSellValue(player);
					const displayWeekMatches = matches.filter((match: any) => match.weekId >= weekId && ([match.home?.id, match.away?.id].includes(player.clubId)));
					return Object.assign({ inStarting: false, upcomingMatches: displayWeekMatches }, pick(player, playerProps), pick(player.selection, selectionProps), { value: tfValue });
				});
			const teamName = teamResult.team.name;
			const teamId = teamResult.team.id;

			const captainPlayer = teamResult.players.find((player: any) => player.selection.captain === 1);
			const captainId = captainPlayer && captainPlayer.id;
			const viceCaptainPlayer = teamResult.players.find((player: any) => player.selection.captain === 2);
			const viceCaptainId = (viceCaptainPlayer && viceCaptainPlayer.id) || null;

			const pastTransfers = !teamResult.transfers ? ([] as Transfer[]) :
				teamResult.transfers
					.filter((tf: any) => props.visibleWeekId && (tf.weekId < props.visibleWeekId))
					.map((tf: any) => ({ inId: tf.inId, outId: tf.outId, weekId: tf.weekId }));
			const deadlineWeekTransfers = !teamResult ? ([] as Transfer[]) :
				teamResult.transfers
					.filter((tf: any) => props.visibleWeekId && (tf.weekId === props.visibleWeekId))
					.map((tf: any) => ({ inId: tf.inId, outId: tf.outId, weekId: tf.weekId, extra: tf.extra }));

			const getPlayersValueWithTransfers = (players: any) => {
				const playersValue = players
					.reduce((acc: any, player: any) => {
						const wasTfed = teamResult.transfers.find((tf: any) => tf.inId === player.id);
						const playerValue = wasTfed ?
							roundNextHalf(player.value + (player.value * (competition.transferTaxPercentage || 0) / 100)) :
							player.value;
						return acc + playerValue;
					}, 0);
				return competition.budget - playersValue;
			};

			const budget = (teamResult.team.budget !== null) ? teamResult.team.budget : getPlayersValueWithTransfers(teamResult.players);

			const boosters = {
				tripleCaptain: teamResult.team.tripleCaptain,
				superSubs: teamResult.team.superSubs,
				freeHit: teamResult.team.freeHit,
				hiddenGem: teamResult.team.hiddenGem,
				goalRush: teamResult.team.goalRush,
				fanFavourite: teamResult.team.fanFavourite,
			};

			props.initTeamState(starting, bench, teamName, teamId, captainId, budget, undefined, undefined, undefined, teamResult.transfers, deadlineWeekTransfers, pastTransfers, viceCaptainId, boosters);
		}
		if (teamError) {
			console.error(teamError);
			setState({ ...state, notFound: true });
		}
	}, [teamResult, matches]);

	const formatTransfers = (tf: any) => {
		const inPIDmeta = tf && tf.inId && Object.keys(tf.inId).length;
		const outPIDmeta = tf && tf.outId && Object.keys(tf.outId).length;

		const inPlayer = players && players.find((player: any) => player.id === tf.inId);
		const outPlayer = players && players.find((player: any) => player.id === tf.outId);
		return {
			inPlayer: inPIDmeta ? tf.inId : inPlayer,
			outPlayer: outPIDmeta ? tf.outId : outPlayer,
			weekId: tf && tf.weekId,
			inId: inPIDmeta ? tf.inId.id : tf.inId,
			outId: outPIDmeta ? tf.outId.id : tf.outId,
		};
	};

	const showTransferConfirmModal = () => {
		setState({ ...state, transferConfirmModalVisible: true });
	};

	const onTransferConfirmCancel = () => {
		setState({ ...state, transferConfirmModalVisible: false });
	};

	const onTransferConfirmAccept = () => {
		props.onTransfersSubmit(+(id || 0));
		setState({ ...state, transferConfirmModalVisible: false });
	};

	const isNotExtraTransfer = (transfer: any) => {
		return !transfer.extra;
	};

	const playerIsExtra = (player: Player) => {
		console.error("playerIsExtra not implemented");
	};

	const onPlayerOut = (player: Player, isLineup: boolean, extraOutTransfer: boolean, clubsWithExtraPlayers: any[]) => {
		const clubsWithExtraPlayersIds = clubsWithExtraPlayers.map((club: any) => club.id);
		if (extraOutTransfer && !clubsWithExtraPlayersIds.includes(player.clubId)) {
			const clubNames = clubsWithExtraPlayers.map((club => club.name)).join(",");
			notification.warning({ message: `Je team is momenteel ongeldig. Je kan enkel een speler van ${clubNames} transfereren.` });
			return;
		}
		if (isLineup) {
			props.removeStartingPlayer(player);
		} else {
			props.removeBenchPlayer(player);
		}

		const playerExtra = playerIsExtra(player);
		props.onTransferPlayerOut(player, false);
	};

	const onPlayerIn = (player: Player) => {
		player = {
			...player,
			upcomingMatches: matches.filter((match: any) => match.weekId >= props.visibleWeekId && ([match.home?.id, match.away?.id].includes(player.clubId))),
		};
		props.pickPlayer(player, false);
		props.onTransferPlayerIn(player);
	};

	const onPlaceHolderClick = (player: Player) => {
		if (player && player.positionId) {
			props.setActivePositionFilter(player.positionId);
		}
		scroller.scrollTo("all-players", {
			duration: 1000,
			delay: 100,
			smooth: true,
			offset: 50
		});
	};

	const {
		starting, bench, boosters, initializedExternally, captainId,
		viceCaptainId, deadlineWeekTransfers, draftTransfers, activePositionFilter,
		pastTransfers, budget
	} = props;

	const pastTransfersFormatted = pastTransfers.map(formatTransfers);
	const deadlineWeekTransfersFormatted = deadlineWeekTransfers
		.concat(draftTransfers)
		.map(formatTransfers);
	const canSaveDraftTransfers = draftTransfers.filter((draftTf) => !!draftTf.inId && !!draftTf.outId).length === draftTransfers.length;
	const deadlineWeekTransfersFormattedWithoutExtra = deadlineWeekTransfers
		.concat(draftTransfers)
		.filter(isNotExtraTransfer)
		.map(formatTransfers);

	const team = useMemo(() => teamResult && teamResult.team, [teamResult]);
	const notTeamOwner = useMemo(() => team && team.userId && user && (team.userId !== user.id), [team, user]);
	const gameStarted = useMemo(() => deadlineInfo && deadlineInfo.deadlineInfo && props.visibleWeekId && props.visibleWeekId > competition.officialStartWeek, [deadlineInfo, props.visibleWeekId]);
	const deadlineWeek = useMemo(() => deadlineInfo && deadlineInfo.deadlineInfo && props.visibleWeekId, [deadlineInfo, props.visibleWeekId]);
	const deadlineFreeTransfers = useMemo(() => deadlineInfo && deadlineInfo.deadlineInfo  && deadlineInfo.deadlineInfo.fT, [deadlineInfo]);
	
	const enabledWildOrFreeHit = useMemo(() => boosters.freeHit == deadlineWeek, [boosters]);
	const startingByPositions = useMemo(() => startingListToPositionsList([].concat(starting as any, bench as any), [2, 5, 5, 3]), [starting, bench]);
	const remainingTransfers = useMemo(() => {
		let remainingTransfers = null;
		if (competition.weeklyTransfers) {
			remainingTransfers = deadlineFreeTransfers - deadlineWeekTransfersFormattedWithoutExtra.length;
		} else if (competition.transferCanBeSaved) {
			remainingTransfers = competition.transfersAllowed * (deadlineWeek - 1) - (deadlineWeekTransfersFormattedWithoutExtra.length + pastTransfersFormatted.length);
		} else {
			remainingTransfers = competition.transfersAllowed - (deadlineWeekTransfersFormattedWithoutExtra.length + pastTransfersFormatted.length);
		}
		return remainingTransfers;
	}, [competition, deadlineWeekTransfersFormattedWithoutExtra, pastTransfersFormatted, deadlineWeek]);
	// const canTransferOut = useMemo(() => remainingTransfers > 0, [remainingTransfers]);
	const canTransferOut = useMemo(() => true, []);

	const minusPoints = useMemo(() => (remainingTransfers < 0) ? remainingTransfers  * -5 : 0, [remainingTransfers]);

	const startingPicked = useMemo(() => starting.filter(player => player && player.id), [starting]);
	const benchPicked = useMemo(() => bench.filter(player => player && player.id), [bench]);
	const draftPlayerInIds = useMemo(() => draftTransfers.map(transfer => transfer.inId).filter(inId => inId !== null), [draftTransfers]);

	if (teamError) {
		return (
			<Alert
				description={(teamErrorData as any).data.message}
				type="error"
				showIcon
			/>
		);
	}

	return (
		clubs && teamResult && matches && players && deadlineInfo && initializedExternally && (
			<TransfersStyle>
				{(notTeamOwner || state.notFound) && <Navigate to={"/home"} />}
				{team && props.visibleWeekId &&
					(!gameStarted || enabledWildOrFreeHit) && (<Navigate to={`/edit/${teamResult.team.id}`} />)}
				<Row>
					<Col md={12} sm={12} xs={24}>
						<div className="title">
							<Title level={2}>{t("general.transfers")}</Title>
							<p>{t("general.transferDescription")}</p>
						</div>
						{(initializedExternally && (
							<>
								<Team
									widthRatio={15}
									heightRatio={10}
									clubs={clubs}
									bg={teamBackground}
									captainId={captainId}
									selection={startingByPositions}
									playerType={PlayerType.SoccerPortrait}
									playerBadgeColor={"#fff"}
									playerBadgeBgColor={theme.primaryContrast}
									playerPointsColor={"#fff"}
									playerPointsBgColor={theme.primaryColor}
									modalEnabled={true}
									showCaptainBadge={true}
									showPlayerValue={true}
									viceCaptainId={viceCaptainId}
									showPlayerValueInsteadOfPoints={true}
									onRemove={canTransferOut && ((player: Player) => onPlayerOut(player, true, false, []))}
									onPlaceholderClick={onPlaceHolderClick}
									actionLessPlayerIds={draftPlayerInIds}
									assetsCdn={competition.assetsCdn}
								/>
								<React.Fragment>
									<div style={{ textAlign: "center", paddingTop: "5px" }}>
										{(draftTransfers && draftTransfers.length && canSaveDraftTransfers &&  team && (
											<span style={{ padding: "5px" }}>
												<Button
													onClick={(e: any) => showTransferConfirmModal()} // todo
													disabled={state.performingTransfer}
													type="primary"
													loading={state.performingTransfer}
												>
													{(!state.performingTransfer && <SaveFilled />) || null}
													{t("transfersPage.confirmTransfers")}
												</Button>
											</span>
										)) || null}
										{(draftTransfers && draftTransfers.length && (
											<span style={{ padding: "15px" }}>
												<Button
													onClick={(e: any) => props.onDraftTransfersClear()}
													type="primary"
												>
													<CloseCircleFilled />
													{t("transfersPage.clearTransfers")}
												</Button>
											</span>
										)) || null}
									</div>
								</React.Fragment>
								<div style={{ marginBottom: "15px" }}>
									<TransfersOverview
										data={deadlineWeekTransfersFormatted}
										tax={competition.transferTaxPercentage}
										size={15}
										budget={budget}
										maxPlayersSameClub={deadlineInfo.deadlineInfo.sC}
										totalPlayers={ competition.lineupSize + competition.benchSize}
										totalPlayersSelected={ startingPicked.length + benchPicked.length }
										minusPoints={minusPoints}
										remainingFreeTransfers={remainingTransfers}
									/>
								</div>
							</>
						)) ||
          null}
					</Col>
					<Col md={12} sm={12} xs={24}>
						<Element name="all-players">
							<PlayerList
								data={players}
								clubs={clubs}
								matches={matches}
								deadlineWeek={deadlineWeek}
								isLoading={playersLoading}
								hidePositions={false}
								activePositionFilter={activePositionFilter}
								setActivePositionFilter={props.setActivePositionFilter}
								isPickable={(player: Player) => props.isPickAble(player, false, true) && draftTransfers.filter((tf: Transfer) => tf.outId !== player.id).length === draftTransfers.length}
								playerType={PlayerType.SoccerPortrait}
								actionLabel={t("transfersPage.transferButtonLabel")}
								playerTax={competition.transferTaxPercentage}
								onPick={onPlayerIn}
								action
								assetsCdn={competition.assetsCdn}
								showHeader={false}
								size={10}
							/>
						</Element>
					</Col>
				</Row>
				<ConfirmModal
					visible={state.transferConfirmModalVisible}
					onCancel={(e: any) => onTransferConfirmCancel()}
					onConfirm={(e: any) => onTransferConfirmAccept()}
					title={t("transfersPage.transferConfirmTitle")}
					text={t("transfersPage.transferConfirmMessage")}
				/>
			</TransfersStyle>
		)
	);
};

export const TransfersPage = () => AbstractTeam(_Transfers, {});
