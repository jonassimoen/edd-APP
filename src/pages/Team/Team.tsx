import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { Team } from "@/components/Team/Team";
import Title from "antd/es/typography/Title";
import React, { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetClubsQuery } from "@/services/clubsApi";
import { PlayerType } from "@/types/PlayerTypes";
import { theme } from "@/styles/theme";
import { useParams } from "react-router-dom";
import { useGetTeamQuery } from "@/services/teamsApi";
import { pick } from "lodash";
import { useSelector } from "react-redux";
import { useAuth } from "@/lib/stores/AuthContext";
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
import { DeadlineBar } from "./TeamStyle";
import dayjs from "dayjs";

export const _Team = (props: AbstractTeamType) => {
	const { id } = useParams();
	const user = useAppSelector((state) => state.userState.user);
	const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSuccess } = useGetClubsQuery();
	const { data: teamResult, isLoading: teamLoading, isError: teamError, isSuccess: teamSuccess } = useGetTeamQuery(+(id || 0));
	const { data: matches, isLoading: matchesLoading, isError: matchesError, isSuccess: matchesSuccess } = useGetMatchesQuery();
	const { data: deadlineInfo, isLoading: deadlineInfoLoading, isError: deadlineInfoError, isSuccess: deadlineInfoSuccess } = useGetDeadlineInfoQuery();
	const { t } = useTranslation();
	const application = useSelector((state: StoreState.All) => state.application);

	useEffect(() => {
		if (deadlineInfoSuccess && clubsSuccess && teamSuccess && matchesSuccess) {
			getTeamInfo(visibleWeekId);
		}
	}, [clubsSuccess, teamSuccess, matchesSuccess, deadlineInfoSuccess]);

	const getTeamInfo = (weekId: number) => {
		const playerProps = ["id", "name", "short", "positionId", "clubId", "value", "ban", "injury", "form", "forename", "surname", "portraitUrl", "externalId"];
		const selectionProps: any[] = [];
		const starting = teamResult.players.filter((p: Player) => p.selection?.starting === 1)
			.map((p: Player) => {
				const displayWeekMatches: any[] = matches.filter(
					(match: Match) => match.weekId === weekId && ([match.homeId, match.awayId].includes(p.clubId))
				);
				return Object.assign({ inStarting: true, upcomingMatches: displayWeekMatches }, pick(p, playerProps), pick(p.selection, selectionProps));
			});

		const bench = teamResult.players.filter((p: Player) => p.selection?.starting === 0)
			.map((p: Player) => {
				const displayWeekMatches: any[] = matches.filter(
					(match: Match) => match.weekId === weekId && ([match.homeId, match.awayId].includes(p.clubId))
				);
				return Object.assign({ inStarting: false, upcomingMatches: displayWeekMatches }, pick(p, playerProps), pick(p.selection, selectionProps));
			});

		const teamName = teamResult.team.name;
		const captainPlayer = teamResult.players.find((p: Player) => p && p.selection && p.selection.captain === 1);
		const captainId = captainPlayer && captainPlayer.id;

		const viceCaptainPlayer = teamResult.players.find((p: Player) => p && p.selection && p.selection.captain === 2);
		const viceCaptainId = viceCaptainPlayer && viceCaptainPlayer.id;

		const budget = teamResult.players.reduce((acc: any, player: Player) => acc - player.value, application.competition.budget);
		const boosters = undefined; // todo

		const isTeamOwner = !!(teamResult.team.userId === user?.id);

		props.initTeamState(starting, bench, teamName, budget, captainId, viceCaptainId, true);
	};

	const startingByPositions = useMemo(() => startingListToPositionsList(props.starting, application.competition.lineupPositionRows), [props.starting]);
	const deadlineWeek = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineWeek, [deadlineInfo]);
	const deadlineDate = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.deadlineDate, [deadlineInfo]);
	const visibleWeekId = useMemo(() => deadlineInfoSuccess && deadlineInfo.deadlineInfo.displayWeek, [deadlineInfo]);

	return (
		(clubs && teamResult && matches && deadlineInfo) && (
			<React.Fragment>
				<Row>
					{
						(visibleWeekId && deadlineWeek && deadlineDate &&
							<Col lg={24} md={24} sm={24} xs={24}>
								<Block>
									<DeadlineBar>
										<p>{`${t('general.footballWeek')} ${deadlineWeek} deadline:`} <span className="deadline-date">{dayjs(deadlineDate).format('dddd DD MMMM HH:mm')}</span></p>
									</DeadlineBar>
								</Block>
							</Col>)
						|| null
					}
					<Col lg={12} md={12} sm={24} xs={24}>
						<Title level={2}>{t("general.footballLineup")}</Title>
						<Team
							widthRatio={15}
							heightRatio={10}
							bg={teamBackground}
							clubs={clubs || []}
							centerAligned={true}
							captainId={0} // todo
							viceCaptainId={0} // todo
							modalEnabled={true}
							selection={startingByPositions} // todo
							assetsCdn=""
							playerType={PlayerType.SoccerShirt}
							onCaptainSelect={props.onCaptainSelect}
							onViceCaptainSelect={props.onViceCaptainSelect}
							onSwap={props.onPlayerSwap}
							showCaptainBadge={true}
							isSwapAble={props.isSwapAble}
							swapPlayerId={props.swapPlayerId}
							swappedFrom={props.swappedFrom}
							playerBadgeColor={theme.primaryColor}
							playerPointsBgColor={theme.primaryColor}
							playerPointsColor="#000"
							playerBadgeBgColor="#84FF00"
						/>
						<Substitutes
							selection={props.bench || []}
							title="Bank"
							bgColor={benchBackground}
							modalEnabled={true}
							showPositionNumber={true}
							playerType={PlayerType.SoccerShirt}
							assetsCdn={application.competition.assetsCdn}
							onSwap={props.onPlayerSwap}
							isSwapAble={props.isSwapAble}
							swapPlayerId={props.swapPlayerId}
							swappedFrom={props.swappedFrom}
							playerBadgeColor={theme.primaryColor}
							playerBadgeBgColor={theme.primaryColor}
							playerPointsColor="#000"
							playerPointsBgColor="#84FF00"
						/>
						<Button
							onClick={(e: any) => props.onTeamSelectionsUpdate(teamResult.team.id, visibleWeekId)}
							type="primary"
							disabled={teamLoading || clubsLoading}
							style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
							size="large">
							<SaveOutlined style={{ marginRight: '10px' }} />
							{t("team.saveTeam")}
						</Button>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Title level={2}>{t("general.footballCalendar")}</Title>
						<Calendar
							weekId={visibleWeekId}
							showHeader={false}
							size={30}
						/>
					</Col>
				</Row>
			</React.Fragment>
		)
	);
};

export const TeamPage = () => AbstractTeam(_Team, {});