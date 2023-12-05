import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { PlayerList } from "@/components/PlayerList/PlayerList";
import { Team } from "@/components/Team/Team";
import { startingListToPositionsList } from "@/lib/helpers";
import { useAuth } from "@/lib/stores/AuthContext";
import { useLazyGetTeamQuery } from "@/services/teamsApi";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Element, scroller } from "react-scroll";
import { useGetPlayersQuery } from "@/services/playersApi";
import Title from "antd/es/typography/Title";
import { useGetClubsQuery } from "@/services/clubsApi";
import { PlayerType } from "@/types/PlayerTypes";
import { NewTeamStyle } from "./NewTeamStyle";
import { Button } from "@/components/UI/Button/Button";
import { SaveOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/reducers";
import { Grid, Tag } from "antd";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { NewGameStats } from "@/components/Stats/NewGameStats";
import { Input } from "@/components/UI/Input/Input";
import { setTeams } from "@/features/userSlice";
import { useLazyGetTeamsQuery } from "@/services/usersApi";
import { theme } from "@/styles/theme";
const { useBreakpoint } = Grid;

declare type NewTeamState = {
	redirectToPayments: boolean;
	hasPlayers: boolean
}

const _NewTeam = (props: AbstractTeamType) => {
	const { t } = useTranslation();
	const { data: clubs, isLoading: clubsLoading, isError: clubsError, isSuccess: clubsSucces } = useGetClubsQuery();
	const { data: players, isLoading: playersLoading, isError: playersError, isSuccess: playersSuccess } = useGetPlayersQuery();
	const [getTeam, { data: teamData, isLoading: teamLoading, isError: teamError, isSuccess: teamSuccess }] = useLazyGetTeamQuery();
	const [getTeams] = useLazyGetTeamsQuery();
	// add team
	// drop team

	const user = useAppSelector((state) => state.userState);

	const [state, setState] = useState<NewTeamState>({
		redirectToPayments: false,
		hasPlayers: false,
	});

	useEffect(() => {
		if (user && user.teams && user.teams[0]) {
			getTeam(user.teams[0].id);
		}
	}, [user]);


	useEffect(() => {
		if (teamSuccess && teamData) {
			setState({ ...state, hasPlayers: (teamData.players.length !== 0) });
			props.setTeamName(teamData.team.name);
		}
	}, [teamData]);

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

	const onTeamSave = () => {
		if (props.savingTeamPending) {
			return false;
		}

		props.onTeamSave()
			.then((result) => setState({ ...state, hasPlayers: (result.data.players.length !== 0), redirectToPayments: true }))
			.then(() => getTeams())
			.catch(() => {/*todo*/ });
	};

	const onTeamReset = (team: any) => {
		if (props.savingTeamPending) {
			return false;
		}
		props.onTeamReset(team)
			.then(() => setState({ ...state, redirectToPayments: true }))
			.catch(() => {/*todo*/ });
	};

	const application = useSelector((state: StoreState) => state.application);
	// matches from props/state
	const { starting, bench, captainId, viceCaptainId, teamName, budget, savingTeamPending, activePositionFilter } = props;
	const { redirectToPayments, hasPlayers } = state;

	const startingByPositions = useMemo(() => startingListToPositionsList([].concat(props.starting as any, props.bench as any), [2, 5, 5, 3]), [props.starting, props.bench]);
	const totalPlayersToPick = application.competition.lineupSize + application.competition.benchSize;
	const startingPicked = useMemo(() => starting?.filter(player => !!player.id), [props.starting]);
	const benchPicked = useMemo(() => bench?.filter(player => !!player.id), [props.bench]);
	const totalPlayersPicked = useMemo(() => (startingPicked?.length || 0) + (benchPicked?.length || 0), [startingPicked, benchPicked]);
	const team = user && user.teams && user.teams[0];

	const screens = useBreakpoint();
	return (
		<NewTeamStyle>
			{team && team.id && hasPlayers && <Navigate to={{ pathname: `/team/${team.id}` }} />}

			{players && clubs &&
				<>
					<Row>
						<Col lg={12} md={24} sm={24} xs={24} className="left">
							<Title level={2}>{t("general.footballLineup")}</Title>
							<Input
								onChange={props.onTeamNameChange}
								style={{ maxWidth: "100%" }}
								placeholder={t("team.newTeamNameInput")}
								value={teamName}
								maxLength={55}
							/>

							<NewGameStats
								budget={budget}
								totalPlayers={totalPlayersToPick}
								selectedPlayers={totalPlayersPicked}
							/>
							<Team
								widthRatio={15}
								heightRatio={10}
								clubs={clubs}
								bg={""}
								assetsCdn={application.competition.assetsCdn}
								selection={startingByPositions}
								showCaptainBadge={true}
								showPlayerValue={true}
								// playerType={}
								playerBadgeColor="#fff"
								playerType={PlayerType.SoccerPortrait}
								captainId={captainId}
								viceCaptainId={viceCaptainId}
								playerBadgeBgColor={theme.primaryContrast}
								onPlaceholderClick={onPlaceHolderClick}
								showPlayerValueInsteadOfPoints={true}
								onCaptainSelect={props.onCaptainSelect}
								onViceCaptainSelect={props.onViceCaptainSelect}
								onRemove={(player: Player) => props.removePlayer(player)}
								modalEnabled={true}
								playerPointsColor={"#000"}
								playerPointsBgColor="#84FF00" />

							<Row>
								{(team && !hasPlayers &&
									<Button
										onClick={(e: any) => onTeamReset(team)}
										type="primary"
										disabled={savingTeamPending}
										loading={savingTeamPending}
										style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
										size="large">
										<SaveOutlined />
										{t("team.saveTeam")}
									</Button>
								) || <Button
									onClick={onTeamSave}
									type="primary"
									disabled={savingTeamPending}
									loading={savingTeamPending}
									style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
									size="large">
									<SaveOutlined style={{ marginRight: "10px" }} />
									{t("team.saveTeam")}
								</Button>
								}
							</Row>
						</Col>
						<Col lg={12} md={24} sm={24} xs={24} className="right">

							<Title level={2}>{t("general.footballAllPlayers")}</Title>
							<Element name="all-players">
								<PlayerList
									data={players}
									clubs={clubs}
									isLoading={playersLoading}
									playerType={PlayerType.SoccerPortrait}
									size={10}
									activePositionFilter={activePositionFilter}
									showHeader={false}
									hidePositions={false}
									action={true}
									isPickable={props.isPickAble}
									onPick={props.pickPlayer}
									assetsCdn={application.competition.assetsCdn}
								/>
							</Element>
						</Col>
					</Row>
				</>
			}
		</NewTeamStyle>
	);
};

export const NewTeam = () => AbstractTeam(_NewTeam, {});