import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { NewTeamStyle } from "../NewTeam/NewTeamStyle";
import { useAppSelector } from "@/reducers";
import { useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useGetTeamQuery } from "@/services/teamsApi";
import { startingListToPositionsList } from "@/lib/helpers";
import { pick } from "lodash";
import { useSelector } from "react-redux";
import { useGetDeadlineInfoQuery } from "@/services/weeksApi";
import { Col, Row } from "@/components/UI/Grid/Grid";
import Title from "antd/lib/typography/Title";
import { useTranslation } from "react-i18next";
import { Block } from "@/components/Block/Block";
import { NewGameStats } from "@/components/Stats/NewGameStats";
import { Team } from "@/components/Team/Team";

import teamBackground from "./../../assets/img/fpl-pitch-no-boarding.svg";
import { PlayerType } from "@/types/PlayerTypes";
import { theme } from "@/styles/theme";
import { Element, scroller } from "react-scroll";
import { useGetClubsQuery } from "@/services/clubsApi";
import { SaveOutlined } from "@ant-design/icons";
import { PlayerList } from "@/components/PlayerList/PlayerList";
import { useGetMatchesQuery } from "@/services/matchesApi";
import { useGetPlayersQuery } from "@/services/playersApi";
import { Button } from "@/components/UI/Button/Button";
import { Alert } from "@/components/UI/Alert/Alert";

const _EditTeam = (props: AbstractTeamType) => {
	const { user, teams } = useAppSelector((state) => state.userState);
	const application = useSelector((state: StoreState) => state.application);
	const [t] = useTranslation();
	const { id } = useParams();
	const { data: teamResult, isSuccess: teamSucces, isError: teamError, error: teamErrorData } = useGetTeamQuery(+id || 0);
	const { data: deadlineInfo, isSuccess: deadlineInfoSuccess, isLoading: deadlineInfoLoading, isError: deadlineInfoError } = useGetDeadlineInfoQuery();
	const { data: matches, isSuccess: matchesSuccess, isLoading: matchesLoading } = useGetMatchesQuery();
	const { data: clubs, isSuccess: clubsSuccess, isLoading: clubsLoading } = useGetClubsQuery();
	const { data: players, isSuccess: playersSuccess, isLoading: playersLoading } = useGetPlayersQuery();

	const getTeamInfo = () => {
		if (!teamSucces) {
			return;
		}
		const playerProps =
			["id", "name", "short", "positionId", "clubId", "value", "ban", "injury", "form", "forename", "surname", "portraitUrl"];
		const selectionProps: any[] = [];
		const result = teamResult;
		const starting = result.players
			.filter((player: any) => player.selection.starting === 1)
			.map((player: any) => Object.assign({ inStarting: true }, pick(player, playerProps), pick(player.selection, selectionProps)));
		const bench = result.players
			.filter((player: any) => player.selection.starting === 0)
			.map((player: any) => Object.assign({ inStarting: false }, pick(player, playerProps), pick(player.selection, selectionProps)));
		const teamName = result.team.name;
		let captainId = null;
		let viceCaptainId = null;

		captainId = result.players.find((player: any) => player.selection.captain === 1)?.id;
		viceCaptainId = result.players.find((player: any) => player.selection.captain === 2)?.id;

		const budget = result.team.budget !== null
			? result.team.budget
			: result.players.reduce((acc: any, player: any) => acc - player.value, application.competition.budget);

		const boosters = {
			tripleCaptain: teamResult.team.tripleCaptain,
			viceVictory: teamResult.team.viceVictory,
			superSub: teamResult.team.superSub,
			hiddenGem: teamResult.team.hiddenGem,
			goalRush: teamResult.team.goalRush,
		};

		// const deadlineWeek = (deadlineInfo && deadlineInfo.deadlineInfo && deadlineInfo.deadlineInfo.deadlineWeek) || 0;
		// if((boosters.freeHit === deadlineWeek)) {

		// }

		props.initTeamState(starting, bench, teamName, captainId, budget, undefined, undefined, undefined, [], [], [], viceCaptainId, boosters);
	};

	const updateTeam = (teamId: number) => {
		props.onTeamEdit(teamId);
	};

	useEffect(() => {
		if (deadlineInfoSuccess && teamSucces && clubsSuccess) {
			getTeamInfo();
		}
	}, [clubsSuccess, teamSucces, deadlineInfoSuccess]);

	const onPlaceHolderClick = (player: any) => {
		if (player && player.positionId || player && player.positionId === 0) {
			props.setActivePositionFilter(player.positionId);
		}

		scroller.scrollTo("all-players", {
			duration: 1000,
			delay: 100,
			smooth: true,
			offset: 50,
		});
	};

	const {
		starting,
		bench,
		boosters,
		initializedExternally,
		budget,
		captainId,
		viceCaptainId,
		activePositionFilter,
	} = props;

	const totalPlayersToPick = application.competition.lineupSize + application.competition.benchSize;
	const startingPicked = starting.filter(player => !!player);
	const benchPicked = bench.filter(player => !!player);
	const totalPlayersPicked = startingPicked.length + benchPicked.length;

	const team = useMemo(() => teamResult && teamResult.team, [teamResult, id]);
	const notTeamOwner = useMemo(() => team && team.userId && user.id !== team.userId, [team, user]);
	const firstPlayingWeekPassed = useMemo(
		() => team && team.id && deadlineInfo && deadlineInfo.deadlineInfo && deadlineInfo.deadlineInfo.deadlineWeek
			&& deadlineInfo.deadlineInfo.deadlineWeek > team.weekId,
		[team, deadlineInfo]);
	const gameOfficialyStarted = useMemo(
		() => team && team.id && deadlineInfo && deadlineInfo.deadlineInfo && deadlineInfo.deadlineInfo.deadlineWeek
			&& deadlineInfo.deadlineInfo.deadlineWeek > application.competition.officialStartWeek,
		[team, deadlineInfo]);
	const deadlineWeek = useMemo(() => deadlineInfo && deadlineInfo.deadlineInfo && deadlineInfo.deadlineInfo.deadlineWeek, [deadlineInfo]);
	// TODO
	const wildCardOrFreeHitEnabled = useMemo(() => false/*boosters.wildCard === deadlineWeek || boosters.freeHit === deadlineWeek*/, [deadlineInfo]);
	const startingByPositions = startingListToPositionsList([].concat(starting as any, bench as any), [2, 5, 5, 3]);

	if(teamError) {
		return (
			<Alert
				description={(teamErrorData as any).data.message}
				type="error"
				showIcon
			/>
		);
	}

	return (
		<NewTeamStyle>
			{
				notTeamOwner && <Navigate to={{ pathname: "/home" }} />
			}
			{
				team && starting && starting.length === 0 && <Navigate to={{ pathname: "/new" }} />
			}
			{
				deadlineWeek && team && (firstPlayingWeekPassed && gameOfficialyStarted && !wildCardOrFreeHitEnabled)
				&& <Navigate to={{ pathname: `/transfers/${team.id}` }} />
			}
			{
				team && initializedExternally && players && clubs &&
				<Row>
					<Col md={12} sm={12} xs={24} className="left">
						<Title level={2}>{t("general.footballLineup")}</Title>
						<Block>
							<NewGameStats
								budget={budget}
								totalPlayers={totalPlayersToPick}
								selectedPlayers={totalPlayersPicked}
							/>
							<Team
								widthRatio={15}
								heightRatio={10}
								bg={teamBackground}
								selection={startingByPositions}
								assetsCdn={application.competition.assetsCdn}
								playerType={PlayerType.SoccerPortrait}
								captainId={captainId}
								viceCaptainId={viceCaptainId}
								showCaptainBadge={true}
								playerBadgeColor={"#fff"}
								playerBadgeBgColor={theme.primaryContrast}
								playerPointsColor={"#000"}
								playerPointsBgColor={theme.primaryColor}
								showPlayerValueInsteadOfPoints={true}
								showPlayerValue={true}
								onCaptainSelect={props.onCaptainSelect}
								modalEnabled={true}
								onRemove={(player: Player) => props.removePlayer(player)}
								onPlaceholderClick={onPlaceHolderClick}
								clubs={clubs}
							/>
							{
								(team && <Button
									onClick={(e: any) => updateTeam}
									style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
									type="primary"
									disabled={false}
									loading={false}
									size="large">
									{/* TODO: get updating state to disable button */}
									<SaveOutlined style={{ marginRight: "10px" }} />
									{t("team.saveTeam")}
								</Button>)
							}
							<Alert
								message="Tips"
								description="Selecteer 15 spelers"
								type="info"
								showIcon
								style={{margin: "10px auto"}}
							/>
						</Block>
					</Col>
					<Col md={12} sm={12} xs={24} className="right">
						<Block>
							<Title level={2}>{t("general.footballAllPlayers")}</Title>
							<Element name="all-players">
								<PlayerList
									data={players}
									clubs={clubs}
									isLoading={playersLoading}
									playerType={PlayerType.SoccerPortrait}
									size={10}
									matches={matches}
									deadlineWeek={deadlineWeek}
									hidePositions={false}
									assetsCdn={application.competition.assetsCdn}
									activePositionFilter={activePositionFilter}
									isPickable={props.isPickAble}
									onPick={props.pickPlayer}
									action
									showHeader={false}
								/>
							</Element>
						</Block>
					</Col>
				</Row>
			}
		</NewTeamStyle>
	);
};


export const EditTeam = () => AbstractTeam(_EditTeam, {});