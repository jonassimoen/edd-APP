import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { Team } from "@/components/Team/Team";
import Title from "antd/es/typography/Title";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetClubsQuery } from "@/services/clubsApi";
import { PlayerType } from "@/types/PlayerTypes";
import { theme } from "@/styles/theme";
import { Navigate, useParams } from "react-router-dom";
import { useGetTeamQuery } from "@/services/teamsApi";
import { pick } from "lodash";
import { useSelector } from "react-redux";
import { startingListToPositionsList } from "@/lib/helpers";
import { Substitutes } from "@/components/Substitutes/Substitutes";

import teamBackground from "./../../assets/img/fpl-pitch-no-boarding.svg";
import benchBackground from "./../../assets/img/fpl-bench-bg.svg";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { Calendar } from "@/components/Calendar/Calendar";
import { Button } from "@/components/UI/Button/Button";
import { useAppSelector } from "@/reducers";
import { SaveOutlined } from "@ant-design/icons";
import { useGetMatchesQuery } from "@/services/matchesApi";
import { useGetDeadlineInfoQuery } from "@/services/weeksApi";
import { Block } from "@/components/Block/Block";
import { DeadlineBar, TeamStyle } from "./TeamStyle";
import { Alert } from "@/components/UI/Alert/Alert";
import { BoosterList } from "@/components/Booster/BoosterList";
import dayjs from "dayjs";

export const _Team = (props: AbstractTeamType) => {
	const { id } = useParams();
	const user = useAppSelector((state) => state.userState.user);
	const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSuccess } = useGetClubsQuery();
	const { data: teamResult, isLoading: teamLoading, isError: teamError, isSuccess: teamSuccess, error: teamErrorData } = useGetTeamQuery(+(id || 0));
	const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSuccess } = useGetMatchesQuery();
	const { data: deadlineInfo, isLoading: deadlineInfoLoading, isError: deadlineInfoError, isSuccess: deadlineInfoSuccess } = useGetDeadlineInfoQuery();
	const { t } = useTranslation();
	const application = useSelector((state: StoreState) => state.application);

	const getTeamInfo = (weekId: number) => {
		const playerProps = ["id", "name", "short", "positionId", "clubId", "value", "ban", "injury", "form", "forename", "surname", "points", "portraitUrl", "externalId", "pSelections"];
		const selectionProps: any[] = ["booster"];
		const starting = teamResult.players.filter((p: any) => p.selection.starting === 1)
			.map((p: any) => {
				const displayWeekMatches: any[] = matches.filter(
					(match: Match) => match.weekId === weekId && ([match.home?.id, match.away?.id].includes(p.clubId))
				);
				return Object.assign({ inStarting: true, currentMatches: displayWeekMatches }, pick(p, playerProps), pick(p.selection, selectionProps));
			});

		const bench = teamResult.players.filter((p: any) => p.selection.starting === 0)
			.map((p: any) => {
				const displayWeekMatches: any[] = matches.filter(
					(match: Match) => match.weekId === weekId && ([match.home?.id, match.away?.id].includes(p.clubId))
				);
				return Object.assign({ inStarting: false, currentMatches: displayWeekMatches }, pick(p, playerProps), pick(p.selection, selectionProps));
			});

		const teamName = teamResult.team?.name;
		const teamId = teamResult.team?.id;
		const captainPlayer = teamResult.players.find((p: any) => p && p.selection && p.selection.captain === 1);
		const captainId = captainPlayer && captainPlayer.id;

		const viceCaptainPlayer = teamResult.players.find((p: any) => p && p.selection && p.selection.captain === 2);
		const viceCaptainId = viceCaptainPlayer && viceCaptainPlayer.id;

		const budget = teamResult.players.reduce((acc: any, player: Player) => acc - player.value, application.competition.budget);

		const isTeamOwner = !!(teamResult.team?.userId === user?.id);

		const boosters = {
			tripleCaptain: teamResult.team.tripleCaptain,
			superSubs: teamResult.team.superSubs,
			freeHit: teamResult.team.freeHit,
			hiddenGem: teamResult.team.hiddenGem,
			goalRush: teamResult.team.goalRush,
			fanFavourite: teamResult.team.fanFavourite,
		};

		props.initTeamState(starting, bench, teamName, teamId, captainId, budget, undefined, undefined, undefined, [], [], [], viceCaptainId, boosters, isTeamOwner);
	};

	useEffect(() => {
		if (deadlineInfoSuccess && clubsSuccess && teamSuccess && matchesSuccess && teamResult) {
			getTeamInfo(props.visibleWeekId);
		}
	}, [clubsSuccess, teamSuccess, matchesSuccess, deadlineInfoSuccess, teamResult]);

	const startingByPositions = useMemo(() => startingListToPositionsList(props.starting, application.competition.lineupPositionRows), [props.starting]);
	const deadlineWeek = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineWeek, [deadlineInfo]);
	const deadlineDate = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineDate, [deadlineInfo]);
	const notTeamOwner = useMemo(() => teamResult && teamResult.team && teamResult.team.userId && user && user.id &&( user.id != teamResult.team.userId), [teamResult, user]);
	const gameInProgress = useMemo(() => deadlineInfoSuccess && !!deadlineInfo.deadlineInfo.deadlineWeek, [deadlineInfo]);
	const boostedPlayers = useMemo(() => props.starting?.concat(props.bench).filter((p: any) => p?.booster), [props.starting, props.bench]);
	const unboostedPlayers = useMemo(() => props.starting?.concat(props.bench).filter((p: any) => !p?.booster), [props.starting, props.bench]);
	
	if(teamError) {
		return (
			<Alert
				description={(teamErrorData as any)?.data?.message}
				type="error"
				showIcon
			/>
		);
	}

	return (
		<TeamStyle>
			{
				teamResult && (
					!teamResult.team && <Navigate to="/home" /> ||
					teamResult.team && notTeamOwner && <Navigate to={`/public/${id}`} /> ||
					teamResult.team && teamResult.players && teamResult.players.length === 0 && <Navigate to="/new" /> ||	
					!gameInProgress && <Navigate to={`/points/${id}`} />
					
				)
			}
			<Row>				
				<Col xl={16} lg={14} md={24} sm={24} xs={24}>
					<div className="header">
						<div className="title">
							<Title level={2}>{t("general.team.name")} {teamResult?.team.name}</Title>
							<p>{`${t("general.deadline")} ${t("general.matchday")} ${deadlineWeek}:`} <span className="deadline-date">{dayjs(deadlineDate).format("dddd DD MMMM HH:mm")}</span></p>
						</div>
						<Button
							onClick={(e: any) => props.onTeamSelectionsUpdate(teamResult.team.id, props.visibleWeekId)}
							type="primary"
							loading={teamLoading || clubsLoading || props.savingTeamPending}
							disabled={teamLoading || clubsLoading || props.savingTeamPending}
							size="large">
							<SaveOutlined style={{ marginRight: "10px" }} />
							{t("team.saveTeam")}
						</Button>
					</div>
					{
						clubs && matches && (
							<>
								<Team
									widthRatio={15}
									heightRatio={10}
									bg={teamBackground}
									clubs={clubs || []}
									centerAligned={true}
									captainId={props.captainId}
									viceCaptainId={props.viceCaptainId}
									modalEnabled={true}
									showBoosterBadge={true}
									selection={startingByPositions}
									assetsCdn={application.competition.assetsCdn}
									playerType={PlayerType.SoccerPortrait}
									onCaptainSelect={props.onCaptainSelect}
									onViceCaptainSelect={props.onViceCaptainSelect}
									onSwap={props.onPlayerSwap}
									showCaptainBadge={true}
									isSwapAble={props.isSwapAble}
									swapPlayerId={props.swapPlayerId}
									swappedFrom={props.swappedFrom}
									playerBadgeColor={"#fff"}
									playerBadgeBgColor={theme.primaryContrast}
									playerPointsColor={"#fff"}
									playerPointsBgColor={theme.primaryColor}
								/>
								<Substitutes
									selection={props.bench || []}
									title={"De Bank"}
									clubs={clubs}
									bgImage={benchBackground}
									modalEnabled={true}
									showBoosterBadge={true}
									showPositionNumber={true}
									playerType={PlayerType.SoccerPortrait}
									assetsCdn={application.competition.assetsCdn}
									onSwap={props.onPlayerSwap}
									isSwapAble={props.isSwapAble}
									swapPlayerId={props.swapPlayerId}
									swappedFrom={props.swappedFrom}
									playerBadgeColor={"#fff"}
									playerBadgeBgColor={theme.primaryContrast}
									playerPointsColor={"#fff"}
									playerPointsBgColor={theme.primaryColor}
								/>
							</>
						)
					}
				</Col>
				
				<Col xl={8} lg={10} md={24} sm={24} xs={24} className="right-col">
					<BoosterList 
						teamId={props.teamId}
						boosters={props.boosters}
						deadlineWeek={deadlineWeek}
						assetsCdn={application.competition.assetsCdn}
						playersWithBoosters={boostedPlayers}
						possiblePlayers={unboostedPlayers}
					/>
					<Calendar
						assetsCdn={application.competition.assetsCdn}
						weekId={props.visibleWeekId}
						showHeader={false}
						size={30}
						maxHeight={500}
					/>
				</Col>
			</Row>
		</TeamStyle>
	);
};

export const TeamPage = () => AbstractTeam(_Team, {});