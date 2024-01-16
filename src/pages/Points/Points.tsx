import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { Block } from "@/components/Block/Block";
import { Team } from "@/components/Team/Team";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { startingListToPositionsList } from "@/lib/helpers";
import { useAppSelector } from "@/reducers";
import { useGetClubsQuery } from "@/services/clubsApi";
import { useGetMatchesQuery } from "@/services/matchesApi";
import { useGetTeamQuery, useLazyGetPointsQuery } from "@/services/teamsApi";
import { useGetDeadlineInfoQuery, useGetWeeksQuery } from "@/services/weeksApi";
import { theme } from "@/styles/theme";
import Title from "antd/es/typography/Title";
import { pick } from "lodash";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { PlayerType } from "@/types/PlayerTypes";
import { useGetPlayersQuery } from "@/services/playersApi";
import { Substitutes } from "@/components/Substitutes/Substitutes";
import { Calendar } from "@/components/Calendar/Calendar";
import { Stats } from "@/components/Stats/Stats";
import { PointsStats } from "@/components/PointsStats/PointsStats";
import teamBackground from "./../../assets/img/fpl-pitch-no-boarding.svg";
import { MatchdaySelector } from "@/components/MatchdaySelector/MatchdaySelector";
import { Spin } from "antd";

export const _TeamPoints = (props: AbstractTeamType) => {
	const { id } = useParams();
	const user = useAppSelector((state) => state.userState.user);
	const [state, setState] = useState({});
	const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSuccess } = useGetClubsQuery();
	const { data: players, isLoading: playersLoading, isError: playersError, isSuccess: playersSuccess } = useGetPlayersQuery();
	const { data: teamResult, isLoading: teamLoading, isError: teamError, isSuccess: teamSuccess } = useGetTeamQuery(+(id || 0));
	const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSuccess } = useGetMatchesQuery();
	const { data: deadlineInfo, isLoading: deadlineInfoLoading, isError: deadlineInfoError, isSuccess: deadlineInfoSuccess } = useGetDeadlineInfoQuery();
	const { data: weeks, isLoading: weeksLoading, isError: weeksError, isSuccess: weeksSucces } = useGetWeeksQuery();
	const [getPointsTeam] = useLazyGetPointsQuery();
	const { t } = useTranslation();
	const application = useSelector((state: StoreState) => state.application);
	const location = useLocation();

	const {
		visibleWeekId,
	} = props;

	const deadlineWeek = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineWeek, [deadlineInfo]);
	const deadlineDate = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineDate, [deadlineInfo]);
	// const visibleWeekId = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.displayWeek, [deadlineInfo]);
	const currentWeek = useMemo(() => deadlineInfoSuccess && deadlineInfo.weeks.find((week: Week) => week.id === visibleWeekId), [visibleWeekId, deadlineInfo]);


	const parsePlayerPointsValue = (value: string) => {
		try {
			return JSON.parse(value);
		} catch (error) {
			return {};
		}
	};

	const getTeamInfo = (weekId: number) => {
		if (!teamResult) {
			return;
		}
		const pointsWeekId = deadlineInfo.deadlineInfo.deadlineWeek;
		const playerProps = ["id", "name", "short", "positionId", "clubId", "value", "ban", "injury", "form", "forename", "surname", "points", "portraitUrl", "externalId", "stats"];
		const selectionProps: any[] = ["points"];
		Promise.all([getPointsTeam({ teamId: +(id || 0), weekId: pointsWeekId })])
			.then(([result]: any[]) => {
				console.log(pointsWeekId);
				result = result.data;
				const pointsConfirmation: any[] = [];
				const weekStat = result.weekStat.find((stat: any) => stat.weekId === pointsWeekId);
				const weekConfirmation = pointsConfirmation.find((item: any) => item.weekId === pointsWeekId);
				const weekPointsConfirmed = weekConfirmation && weekConfirmation.confirmed;
				const provisionalPoints = result.players
					.filter((player: any) => player.selection[0].starting === 1)
					.reduce((acc: number, player: any) => {
						const stats = player && player.stats ? player.stats : [];
						const statsTotalPoints = stats
							.reduce((statsAcc: number, item: any) => statsAcc + item.points, 0);
						const points = player.selection[0].captain ? statsTotalPoints * 2 : statsTotalPoints;
						return acc + points;
					}, 0);


				const teamPointsInfo = {
					generalPoints: result.team.points !== null ? result.team.points : "-",
					generalRank: result.team.rank !== null ? result.team.rank : "-",
					visibleWeekPoints: (weekStat && weekStat.points) || "-",
					visibleWeekRank: (weekStat && weekStat.rank) || "-",
					weekWinnerPoints: (weekStat && weekStat.winner) || "-",
					weekPointsConfirmed: !!weekPointsConfirmed,
					provisionalPoints: provisionalPoints,
					totalTransfers: result.transfers.length,
					transfers: result.transfers.map((transfer: any) => {
						const outPlayer = players.find((item: any) => item.id === transfer.outId);
						const inPlayer = players.find((item: any) => item.id === transfer.inId);
						return { ...transfer, outPlayer, inPlayer };
					}),
					weekAveragePoints: (weekStat && weekStat.average) || "-"
				};

				const startedThisWeek = { started: result.team.weekId <= pointsWeekId, weekId: result.team.weekId };

				const starting = result.players
					.filter((player: any) => player.selection[0].starting === 1)
					.map((player: any) => {
						const playerStats = player.stats && player.stats[0];
						const pointsOverview = playerStats;
						const displayWeekMatches = matches.filter((match: any) => match.weekId === pointsWeekId && ([match.homeId, match.awayId].includes(player.clubId)));
						return Object.assign({ inStarting: true, upcomingMatches: displayWeekMatches }, { pointsOverview }, pick(player, playerProps, pick(player.selection, selectionProps)));
					});
				const bench = result.players
					.filter((player: any) => player.selection[0].starting === 0)
					.map((player: any) => {
						const playerStats = player.stats && player.stats[0];
						const pointsOverview = playerStats;
						const displayWeekMatches = matches.filter((match: any) => match.weekId === pointsWeekId && ([match.homeId, match.awayId].includes(player.clubId)));
						return Object.assign({ inStarting: false, upcomingMatches: displayWeekMatches }, { pointsOverview }, pick(player, playerProps, pick(player.selection, selectionProps)));
					}).sort((first: any, second: any) => {
						return (first.positionId === 1) ? -1 : 0;
					});
				const teamName = result.team?.name;
				const teamUser = result.user;

				const captainPlayer = result.players.find((player: any) => player.selection[0].captain === 1);
				const captainId = captainPlayer && captainPlayer.id;

				const viceCaptainPlayer = result.players.find((player: any) => player.selection[0].captain === 2);
				const viceCaptainId = viceCaptainPlayer && viceCaptainPlayer.id;

				const budget = result.players.reduce((acc: any, player: any) => acc - player.value, application.competition.budget);

				const boosters = {
					freeHit: result.team.freeHit,
					bank: result.team.bank,
					tripleCaptain: result.team.tripleCaptain,
					wildCard: result.team.wildCard
				};

				const isTeamOwner = !!(result.team.userId === user.id);

				props.loadAllMatches();

				props.initTeamState(starting, bench, teamName, captainId, budget, undefined, pointsWeekId, teamPointsInfo, [], [], [], viceCaptainId, boosters, isTeamOwner, teamUser);
			})
			.catch(err => {
				console.log(err);
				setState({ notFound: true });
			});
	};

	useEffect(() => {
		console.log("EFFECT, visibleweekid", visibleWeekId);
		if (deadlineInfoSuccess && clubsSuccess && teamSuccess && matchesSuccess) {
			getTeamInfo(visibleWeekId);
		}
	}, [clubsSuccess, teamSuccess, matchesSuccess, deadlineInfoSuccess, visibleWeekId]);

	const { starting, bench, initializedExternally, teamName, teamUser, captainId, viceCaptainId, teamPointsInfo } = props;

	// TODO --
	// const boosterWeekStatus: BoostersWeekStatus = {
	//		 // bank: boosters.bank === visibleWeekId,
	//		 // tripleCaptain: boosters.tripleCaptain === visibleWeekId,
	//		 // freeHit: boosters.freeHit === visibleWeekId,
	//		 // wildCard: boosters.wildCard === visibleWeekId
	// };
	const boosterWeekStatus: any = {
		bank: false,
		tripleCaptain: false,
		freeHit: false,
		wildCard: false
	};

	const captainSelection = useMemo(() => starting.find(player => player && player.id === captainId), [starting, captainId]);
	const captainBench = useMemo(() => bench.find(player => player && player.id === captainId), [bench, captainId]);
	// todo: check variable
	const captainHasPlayed = useMemo(() => !!((captainSelection && captainSelection.pointsOverview && captainSelection.pointsOverview.time) || (boosterWeekStatus && boosterWeekStatus.bank && captainBench && captainBench.pointsOverview && captainBench.pointsOverview.time)), [captainBench, captainSelection]);

	const startingByPositions = startingListToPositionsList(starting, application.competition.lineupPositionRows);
	const isPowerSubEnabled = false;
	const isPublicRoute = location.pathname.includes("public");

	return (
		// clubsSuccess && playersSuccess && matchesSuccess && teamSuccess && deadlineInfoSuccess &&
		<Spin spinning={clubsLoading || playersLoading || teamLoading || matchesLoading || deadlineInfoLoading} delay={0}>
			{
				(initializedExternally && visibleWeekId &&
					<Row style={{ margin: 0 }}>
						<Col md={24} sm={24} xs={24}>
							<Block>
								<MatchdaySelector
									day={visibleWeekId}
									max={deadlineWeek ? deadlineWeek : visibleWeekId}
									min={1}
									name={t(`general.weeks.${weeks.find((week: Week) => week.id === visibleWeekId)?.name}`)}
									onPrev={(e: any) => props.onDayChange(false)}
									onNext={(e: any) => props.onDayChange(true)}
								/>
							</Block>
						</Col>
					</Row>)
				|| null
			}
			{
				(initializedExternally &&
					<Row style={{ margin: 0 }}>
						<Col lg={12} md={12} sm={24} xs={24}>
							<Block style={{ marginTop: "10px" }}>
								{
									<Title level={2}>{t("pointsPage.statsBlockTitle")} {isPublicRoute ? `"${teamName}"` : ""}</Title>
								}
								{/* {`Managed by ${teamUser?.firstName} ${teamUser?.lastName}`} */}
								<PointsStats
									visibleWeekPoints={teamPointsInfo.visibleWeekPoints}
									isPublic={isPublicRoute}
									weekWinnerPoints={teamPointsInfo.weekWinnerPoints}
									weekAveragePoints={teamPointsInfo.weekAveragePoints}
								/>
							</Block>
							<Block style={{ marginTop: "10px" }}>
								<Title level={2}>{t("general.footballLineup")}</Title>
								<Team widthRatio={15}
									heightRatio={10}
									clubs={clubs}
									captainId={captainId}
									captainHasPlayed={captainHasPlayed}
									viceCaptainId={viceCaptainId}
									centerAligned={true}
									selection={startingByPositions}
									assetsCdn={application.competition.assetsCdn}
									onSwap={props.onPlayerSwap}
									isSwapAble={(isPowerSubEnabled) ? props.isSwapAble : false}
									swapPlayerId={props.swapPlayerId}
									swappedFrom={props.swappedFrom}
									// boosterWeekStatus={boosterWeekStatus}
									replacePlayerPointsWithStatsPoints={true}
									showCaptainBadge={true}
									modalEnabled={true}
									playerBadgeColor={"#fff"}
									playerBadgeBgColor={theme.primaryContrast}
									playerPointsColor={"#000"}
									playerPointsBgColor={theme.primaryColor}
									bg={teamBackground}
									playerType={PlayerType.SoccerPortrait} />
								<Substitutes
									selection={bench}
									title={"De bank"}
									clubs={clubs}
									assetsCdn={application.competition.assetsCdn}
									playerType={PlayerType.SoccerPortrait}
									playerBadgeColor={"#fff"}
									playerBadgeBgColor={theme.primaryContrast}
									playerPointsColor={"#000"}
									playerPointsBgColor={theme.primaryColor}
									captainId={captainId}
									viceCaptainId={viceCaptainId}
									showCaptainBadge={true}
									modalEnabled={true}
									replacePlayerPointsWithStatsPoints={true}

									onSwap={props.onPlayerSwap}
									swapPlayerId={props.swapPlayerId}
									swappedFrom={props.swappedFrom}
									isSwapAble={false} // todo: implement powersub
								/>
							</Block>
						</Col>
						<Col lg={12} md={12} sm={24} xs={24}>
							{
								<Block style={{ marginTop: "10px" }}>
									<Title level={2}>{t("pointsPage.overviewBlockTitle")}</Title>
									<Stats
										visibleWeekPoints={teamPointsInfo.visibleWeekPoints}
										visibleWeekRank={teamPointsInfo.visibleWeekRank}
										transfers={teamPointsInfo.transfers}
										generalPoints={teamPointsInfo.generalPoints}
										generalRank={teamPointsInfo.generalRank}
										weekId={visibleWeekId}
										weekPointsConfirmed={currentWeek.validated}
									/>
								</Block>
							}
							{
								matches && matches.length && visibleWeekId ?
									<Block style={{ marginTop: "10px" }}>
										<Title level={2}>{t("general.footballCalendar")}</Title>
										<Calendar
											assetsCdn={application.competition.assetsCdn}
											size={30}
											weekId={visibleWeekId}
											showHeader={false}
										/>
									</Block>
									: null
							}
						</Col>
					</Row>
				)
			}
		</Spin >
	);
};

export const PointsPage = () => AbstractTeam(_TeamPoints, {}, { mode: "points" });