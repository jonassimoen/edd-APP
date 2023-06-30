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
import { scroller } from "react-scroll";
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

	const user = useAppSelector((state) => state.userState.user);

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
			props.setTeamName(teamData.name);
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
			.then(() => setState({ ...state, redirectToPayments: true }))
			.catch(() => { });
	};

	const onTeamReset = (team: any) => {
		if (props.savingTeamPending) {
			return false;
		}
		props.onTeamReset(team)
			.then(() => setState({ ...state, redirectToPayments: true }))
			.catch(() => { });
	};

	const application = useSelector((state: StoreState.All) => state.application);
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
		// <Title>{props.starting.map(p => p.id)}</Title>
		<NewTeamStyle>
			{Object.entries(screens)
				.filter((screen) => !!screen[1])
				.map((screen) => (
					<Tag color="blue" key={screen[0]}>
						{screen[0]}
					</Tag>
				))}
			{team && team.id && hasPlayers && <Navigate to={{ pathname: `/team/${team.id}` }} />}
			{team && team.id && redirectToPayments && <Navigate to={{ pathname: `/team/${team.id}` }} />}

			{/* {clubs && clubs.data && clubs.data.length > 0 && */}
			{players && clubs &&
				<>
					<Row>
						<Col lg={12} md={24} sm={24} xs={24} className="left">
							<Title level={2}>{t("general.footballLineup")}</Title>
							{budget}
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
								playerBadgeBgColor={"#16002b"}
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
									<SaveOutlined />
									{t("team.saveTeam")}
								</Button>
								}
							</Row>
						</Col>
						<Col lg={12} md={24} sm={24} xs={24} className="right">

							<Title level={2}>{t("general.footballAllPlayers")}</Title>
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
							/>
						</Col>
					</Row>
				</>
			}
		</NewTeamStyle>
	);
};

export const NewTeam = () => AbstractTeam(_NewTeam, {});