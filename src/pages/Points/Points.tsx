import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { Block } from "@/components/Block/Block";
import { Team } from "@/components/Team/Team";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { startingListToPositionsList } from "@/lib/helpers";
import { useAppSelector } from "@/reducers";
import { useGetMatchesQuery } from "@/services/matchesApi";
import { useLazyGetPointsQuery } from "@/services/teamsApi";
import { useGetDeadlineInfoQuery, useGetWeeksQuery } from "@/services/weeksApi";
import { theme } from "@/styles/theme";
import Title from "antd/es/typography/Title";
import { pick } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { PlayerType } from "@/types/PlayerTypes";
import { Substitutes } from "@/components/Substitutes/Substitutes";
import { Calendar } from "@/components/Calendar/Calendar";
import { Stats } from "@/components/Stats/Stats";
import { PointsStats } from "@/components/PointsStats/PointsStats";
import teamBackground from "./../../assets/img/fpl-pitch-no-boarding.svg";
import { MatchdaySelector } from "@/components/MatchdaySelector/MatchdaySelector";
import { Spin } from "antd";
import { BoosterStats } from "@/components/BoosterStats/BoosterStats";

export const _TeamPoints = (props: AbstractTeamType) => {
	const { id } = useParams();
	const user = useAppSelector((state) => state.userState.user);
	const [state, setState] = useState({});

	const clubs = JSON.parse(localStorage.getItem("_static_clubs"));
	const players = JSON.parse(localStorage.getItem("_static_players"));
	const {competition, clubsSuccess, clubsLoading} = useSelector((state: StoreState) => state.application);

	const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSuccess } = useGetMatchesQuery();
	const { data: deadlineInfo, isLoading: deadlineInfoLoading, isError: deadlineInfoError, isSuccess: deadlineInfoSuccess } = useGetDeadlineInfoQuery();
	const { data: weeks, isLoading: weeksLoading, isError: weeksError, isSuccess: weeksSucces } = useGetWeeksQuery();
	const [getPointsTeam] = useLazyGetPointsQuery();
	const { t } = useTranslation();
	const location = useLocation();

	const {
		visibleWeekId,
	} = props;

	const deadlineWeek = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineWeek, [deadlineInfo]);
	const displayWeek = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.displayWeek, [deadlineInfo]);
	const deadlineDate = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineDate, [deadlineInfo]);
	const currentWeek = useMemo(() => deadlineInfoSuccess && deadlineInfo.weeks.find((week: Week) => week.id === visibleWeekId), [visibleWeekId, deadlineInfo]);


	const parsePlayerPointsValue = (value: string) => {
		try {
			return JSON.parse(value);
		} catch (error) {
			return {};
		}
	};

	const getTeamInfo = (weekId: number) => {
		// const pointsWeekId = deadlineInfo.deadlineInfo.displayWeek;
		const playerProps = ["id", "name", "short", "positionId", "clubId", "value", "ban", "injury", "form", "forename", "surname", "portraitUrl", "externalId"];
		const selectionProps: any[] = ["booster", "played", "points"];
		Promise.all([getPointsTeam({ teamId: +(id || 0), weekId: weekId })])
			.then(([result]: any[]) => {
				result = result.data;
				const pointsConfirmation: any[] = [];
				const weekStat = result.weekStat.find((stat: any) => stat.weekId === weekId);
				const weekConfirmation = pointsConfirmation.find((item: any) => item.weekId === weekId);
				const weekPointsConfirmed = weekConfirmation && weekConfirmation.confirmed;
				const provisionalPoints = result.players
					.filter((player: any) => player.selections[0].starting === 1)
					.reduce((acc: number, player: any) => {
						const stats = player && player.stats ? player.stats : [];
						const statsTotalPoints = stats
							.reduce((statsAcc: number, item: any) => statsAcc + item.points, 0);
						const points = player.selections[0].captain ? statsTotalPoints * 2 : statsTotalPoints;
						return acc + points + player.selections[0].endWinnerSelections;
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

				const starting = result.players
					.filter((player: any) => player.selections[0].starting === 1)
					.map((player: any) => {
						const playerStats = player.stats && player.stats[0];
						const endWinnerSelections = player.selections[0].endWinnerSelections;
						const pointsOverview = endWinnerSelections?{endWinnerSelections, ...playerStats}:playerStats;
						const displayWeekMatches = matches.filter((match: any) => match.weekId === weekId && ([match.home?.id, match.away?.id].includes(player.clubId)));
						return Object.assign({ inStarting: true, upcomingMatches: displayWeekMatches }, { pointsOverview }, pick(player, playerProps), {stats: player.stats}, pick(player.selections[0], selectionProps));
					});
				const bench = result.players
					.filter((player: any) => player.selections[0].starting === 0)
					.map((player: any) => {
						const playerStats = player.stats && player.stats[0];
						const endWinnerSelections = player.selections[0].endWinnerSelections;
						const pointsOverview = endWinnerSelections?{endWinnerSelections, ...playerStats}:playerStats;
						const displayWeekMatches = matches.filter((match: any) => match.weekId === weekId && ([match.home?.id, match.away?.id].includes(player.clubId)));
						return Object.assign({ inStarting: false, upcomingMatches: displayWeekMatches }, { pointsOverview }, pick(player, playerProps), {stats: player.stats}, pick(player.selections[0], selectionProps));
					}).sort((first: any, second: any) => {
						return (first.positionId === 1) ? -1 : 0;
					});
				const teamName = result.team?.name;
				const teamUser = result.user;
				const teamId = result.team.id;

				const captainPlayer = result.players.find((player: any) => player.selections[0].captain === 1);
				const captainId = captainPlayer && captainPlayer.id;

				const viceCaptainPlayer = result.players.find((player: any) => player.selections[0].captain === 2);
				const viceCaptainId = viceCaptainPlayer && viceCaptainPlayer.id;

				const budget = result.players.reduce((acc: any, player: any) => acc - player.value, competition.budget);

				const boosters = {
					tripleCaptain: result.team.tripleCaptain,
					superSubs: result.team.superSub,
					freeHit: result.team.freeHit,
					goalRush: result.team.goalRush,
					hiddenGem: result.team.hiddenGem,
					fanFavourite: result.team.fanFavourite,
				};

				const isTeamOwner = !!(result.team.userId === user.id);

				props.loadAllMatches();

				props.initTeamState(starting, bench, teamName, teamId, captainId, budget, undefined, weekId, teamPointsInfo, [], [], [], viceCaptainId, boosters, isTeamOwner, teamUser);
			})
			.catch(err => {
				console.log(err);
				setState({ notFound: true });
			});
	};

	useEffect(() => {
		if (deadlineInfoSuccess && clubsSuccess && matchesSuccess) {
			getTeamInfo(visibleWeekId);
		}
	}, [clubsSuccess, matchesSuccess, deadlineInfoSuccess, visibleWeekId]);

	const { starting, bench, initializedExternally, teamName, teamUser, captainId, viceCaptainId, teamPointsInfo, boosters } = props;

	const boosterWeekStatus: any = {
		tripleCaptain: boosters.tripleCaptain === visibleWeekId,
		goalRush: boosters.goalRush === visibleWeekId,
		hiddenGem: boosters.hiddenGem === visibleWeekId,
		superSubs: boosters.superSubs === visibleWeekId,
		freeHit: boosters.freeHit === visibleWeekId,
		fanFavourite: boosters.fanFavourite === visibleWeekId,
	};

	const captainSelection = useMemo(() => starting.find(player => player && player.id === captainId), [starting, captainId]);
	const captainBench = useMemo(() => bench.find(player => player && player.id === captainId), [bench, captainId]);
	// todo: check variable
	const captainHasPlayed = useMemo(() => !!((captainSelection && captainSelection.pointsOverview && captainSelection.pointsOverview.minutesPlayed > 0) || (boosterWeekStatus && boosterWeekStatus.bank && captainBench && captainBench.pointsOverview && captainBench.pointsOverview.time)), [captainBench, captainSelection]);
	const currentWeekName = useMemo(() => weeks?.find((week: Week) => week.id === visibleWeekId)?.name, [weeks, visibleWeekId]);
	const startingByPositions = startingListToPositionsList(starting, competition.lineupPositionRows);
	const isPowerSubEnabled = false;
	const isPublicRoute = location.pathname.includes("public");

	return (
		<Spin spinning={clubsLoading || matchesLoading || deadlineInfoLoading} delay={0}>
			{
				(initializedExternally && visibleWeekId &&
					<Row style={{ margin: 0 }}>
						<Col md={24} sm={24} xs={24}>
							<Block>
								<MatchdaySelector
									day={visibleWeekId}
									max={displayWeek ? displayWeek : visibleWeekId}
									min={1}
									name={currentWeekName?(`general.weeks.${currentWeekName}`):null}
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
								<Title level={2}>{t("pointsPage.statsBlockTitle")} {isPublicRoute ? `"${teamName}"` : ""}</Title>
								{/* {`Managed by ${teamUser?.firstName} ${teamUser?.lastName}`} */}
								<PointsStats
									visibleWeekPoints={teamPointsInfo.visibleWeekPoints}
									isPublic={isPublicRoute}
									weekWinnerPoints={teamPointsInfo.weekWinnerPoints}
									weekAveragePoints={teamPointsInfo.weekAveragePoints}
								/>
							</Block>
							<Block style={{ marginTop: "10px" }}>
								<Title level={2}>{t("general.lineup")}</Title>
								<Team widthRatio={15}
									heightRatio={10}
									clubs={clubs}
									captainId={captainId}
									captainHasPlayed={captainHasPlayed}
									viceCaptainId={viceCaptainId}
									centerAligned={true}
									selection={startingByPositions}
									assetsCdn={competition.assetsCdn}
									onSwap={props.onPlayerSwap}
									isSwapAble={(isPowerSubEnabled) ? props.isSwapAble : false}
									swapPlayerId={props.swapPlayerId}
									swappedFrom={props.swappedFrom}
									// boosterWeekStatus={boosterWeekStatus}
									replacePlayerPointsWithStatsPoints={false}
									showCaptainBadge={true}
									showBoosterBadge={true}
									
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
									assetsCdn={competition.assetsCdn}
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
									showBoosterBadge={true}

									onSwap={props.onPlayerSwap}
									swapPlayerId={props.swapPlayerId}
									swappedFrom={props.swappedFrom}
									isSwapAble={false} // todo: implement powersub
								/>
							</Block>
							<Block style={{ marginTop: "10px" }}>
								<Title level={2}>{t("pointsPage.boostersUsed")} </Title>
								<BoosterStats
									boosterWeekStatus={boosterWeekStatus}
									boostedPlayers={
										starting.concat(bench).filter(p => p.booster).map(p => 
											Object.assign(
												{generalPoints: p.stats[0]?.points},
												pick(p, ["booster","id","short","name","points"])
											)
										)
									}
									assetsCdn={competition.assetsCdn}
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
										<Title level={2}>{t("general.calendar")}</Title>
										<Calendar
											assetsCdn={competition.assetsCdn}
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