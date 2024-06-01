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
import { useTranslation } from "react-i18next";
import { NewGameStats } from "@/components/Stats/NewGameStats";
import { Team } from "@/components/Team/Team";

import teamBackground from "./../../assets/img/fpl-pitch-no-boarding.svg";
import { PlayerType } from "@/types/PlayerTypes";
import { theme } from "@/styles/theme";
import { Element, scroller } from "react-scroll";
import { SaveOutlined } from "@ant-design/icons";
import { PlayerList } from "@/components/PlayerList/PlayerList";
import { useGetMatchesQuery } from "@/services/matchesApi";
import { Button } from "@/components/UI/Button/Button";
import { Alert } from "@/components/UI/Alert/Alert";
import { useGetPlayersQuery } from "@/services/playersApi";
import { useGetClubsQuery } from "@/services/clubsApi";
import Title from "antd/es/typography/Title";

const _EditTeam = (props: AbstractTeamType) => {
	const { user, teams } = useAppSelector((state) => state.userState);
	const [t] = useTranslation();
	const { id } = useParams();
	const { data: teamResult, isSuccess: teamSucces, isError: teamError, error: teamErrorData } = useGetTeamQuery(+id || 0);
	const { data: deadlineInfo, isSuccess: deadlineInfoSuccess, isLoading: deadlineInfoLoading, isError: deadlineInfoError } = useGetDeadlineInfoQuery();
	const { data: matches, isSuccess: matchesSuccess, isLoading: matchesLoading } = useGetMatchesQuery();
	// const clubs = JSON.parse(localStorage.getItem("_static_clubs"));
	// const players = JSON.parse(localStorage.getItem("_static_players"));
	// const {competition, clubsSuccess, playersLoading} = useSelector((state: StoreState) => state.application);
	const {competition } = useSelector((state: StoreState) => state.application);
	const { data: clubs, isSuccess: clubsSuccess, isLoading: clubsLoading } = useGetClubsQuery();
	const { data: players, isSuccess: playersSuccess, isLoading: playersLoading } = useGetPlayersQuery();

	const getTeamInfo = () => {
		if (!teamSucces) {
			return;
		}
		const playerProps =
			["id", "name", "short", "positionId", "clubId", "value", "ban", "injury", "form", "forename", "surname", "portraitUrl", "pSelections", "points"];
		const selectionProps: any[] = [];
		const result = teamResult;
		const starting = result.players
			.filter((player: any) => player.selection.starting === 1)
			.map((player: any) => {
				const upcomingMatches = matches.filter((match: any) => match.weekId >= props.visibleWeekId && ([match.home?.id, match.away?.id].includes(player.clubId)));
				return Object.assign({ inStarting: true, upcomingMatches}, pick(player, playerProps), pick(player.selection, selectionProps));
			});
		const bench = result.players
			.filter((player: any) => player.selection.starting === 0)
			.map((player: any) => {
				const upcomingMatches = matches.filter((match: any) => match.weekId >= props.visibleWeekId && ([match.home?.id, match.away?.id].includes(player.clubId)));
				return Object.assign({ inStarting: false, upcomingMatches }, pick(player, playerProps), pick(player.selection, selectionProps));
			});
		const teamName = result.team.name;
		const teamId = result.team.id;
		let captainId = null;
		let viceCaptainId = null;

		captainId = result.players.find((player: any) => player.selection.captain === 1)?.id;
		viceCaptainId = result.players.find((player: any) => player.selection.captain === 2)?.id;

		const budget = result.team.budget !== null
			? result.team.budget
			: result.players.reduce((acc: any, player: any) => acc - player.value, competition.budget);

		const boosters = {
			tripleCaptain: teamResult.team.tripleCaptain,
			superSubs: teamResult.team.superSubs,
			freeHit: teamResult.team.freeHit,
			hiddenGem: teamResult.team.hiddenGem,
			goalRush: teamResult.team.goalRush,
			fanFavourite: teamResult.team.fanFavourite,
		};

		// const deadlineWeek = (deadlineInfo && deadlineInfo.deadlineInfo && deadlineInfo.deadlineInfo.deadlineWeek) || 0;
		// if((boosters.freeHit === deadlineWeek)) {

		// }

		props.initTeamState(starting, bench, teamName, teamId, captainId, budget, undefined, undefined, undefined, [], [], [], viceCaptainId, boosters);
	};

	const updateTeam = () => {
		props.onTeamEdit(props.teamId);
	};

	const onPlayerIn = (player: Player) => {
		player = {
			...player,
			upcomingMatches: matches.filter((match: any) => match.weekId >= props.visibleWeekId && ([match.home?.id, match.away?.id].includes(player.clubId))),
		};
		props.pickPlayer(player, false);
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
		savingTeamPending,
	} = props;

	const totalPlayersToPick = competition.lineupSize + competition.benchSize;
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
			&& deadlineInfo.deadlineInfo.deadlineWeek > competition.officialStartWeek,
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
					<Col lg={12} md={24} sm={24} xs={24} className="left">
						<div className="title">
							<Title level={2}>{t("general.team.edit")} {teamResult?.team.name}</Title>
							<p>{t("general.editTeamDescription")}</p>
						</div>
						<Team
							widthRatio={15}
							heightRatio={10}
							bg={teamBackground}
							selection={startingByPositions}
							assetsCdn={competition.assetsCdn}
							playerType={PlayerType.SoccerPortrait}
							captainId={captainId}
							viceCaptainId={viceCaptainId}
							showCaptainBadge={true}
							playerBadgeColor={"#fff"}
							playerBadgeBgColor={theme.primaryContrast}
							playerPointsColor={"#fff"}
							playerPointsBgColor={theme.primaryColor}
							showPlayerValueInsteadOfPoints={true}
							showPlayerValue={true}
							onCaptainSelect={props.onCaptainSelect}
							modalEnabled={true}
							onRemove={(player: Player) => props.removePlayer(player)}
							onPlaceholderClick={onPlaceHolderClick}
							clubs={clubs}
						/>
						<NewGameStats
							budget={budget}
							maxPlayersSameClub={deadlineInfo.deadlineInfo.sC}
							totalPlayers={totalPlayersToPick}
							selectedPlayers={totalPlayersPicked}
						/>
						{
							(team && <Button
								onClick={updateTeam}
								style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
								type="primary"
								disabled={savingTeamPending}
								loading={savingTeamPending}
								size="large">
								{/* TODO: get updating state to disable button */}
								<SaveOutlined style={{ marginRight: "10px" }} />
								{t("team.saveTeam")}
							</Button>)
						}
					</Col>
					<Col lg={12} md={24} sm={24} xs={24} className="right">
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
								assetsCdn={competition.assetsCdn}
								activePositionFilter={activePositionFilter}
								isPickable={props.isPickAble}
								onPick={onPlayerIn}
								action
								showHeader={false}
							/>
						</Element>
					</Col>
				</Row>
			}
		</NewTeamStyle>
	);
};


export const EditTeam = () => AbstractTeam(_EditTeam, {});