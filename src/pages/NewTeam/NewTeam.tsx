import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { PlayerList } from "@/components/PlayerList/PlayerList";
import { Team } from "@/components/Team/Team";
import { startingListToPositionsList } from "@/lib/helpers";
import { useAuth } from "@/lib/stores/AuthContext";
import { useLazyGetTeamQuery } from "@/services/teamsApi";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Element, scroller } from "react-scroll";
import Title from "antd/es/typography/Title";
import { PlayerType } from "@/types/PlayerTypes";
import { NewTeamStyle } from "./NewTeamStyle";
import { Button } from "@/components/UI/Button/Button";
import { SaveOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/reducers";
import { Grid, Tag, Tour, TourProps } from "antd";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { NewGameStats } from "@/components/Stats/NewGameStats";
import { Input } from "@/components/UI/Input/Input";
import { setTeams } from "@/features/userSlice";
import { useLazyGetTeamsQuery } from "@/services/usersApi";
import { theme } from "@/styles/theme";
import { ButtonStyle } from "@/components/UI/Button/ButtonStyle";
const { useBreakpoint } = Grid;

declare type NewTeamState = {
	redirectToPayments: boolean;
	hasPlayers: boolean
}

const _NewTeam = (props: AbstractTeamType) => {
	const { t } = useTranslation();
	const clubs = JSON.parse(localStorage.getItem("_static_clubs"));
	const players = JSON.parse(localStorage.getItem("_static_players"));
	const {competition, clubsSuccess, playersLoading} = useSelector((state: StoreState) => state.application);
	const [getTeam, { data: teamData, isSuccess: teamSuccess }] = useLazyGetTeamQuery();
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
			.then((result) => setState({ ...state, hasPlayers: result.data.status === "success", redirectToPayments: true }))
			.then(() => getTeams())
			.catch((err) => console.error(err));
	};

	const onTeamReset = (team: any) => {
		if (props.savingTeamPending) {
			return false;
		}
		props.onTeamReset(team)
			.then(() => setState({ ...state, redirectToPayments: true }))
			.catch(() => {/*todo*/ });
	};

	// matches from props/state
	const { starting, bench, captainId, viceCaptainId, teamName, budget, savingTeamPending, activePositionFilter } = props;
	const { redirectToPayments, hasPlayers } = state;

	const startingByPositions = useMemo(() => startingListToPositionsList([].concat(props.starting as any, props.bench as any), [2, 5, 5, 3]), [props.starting, props.bench]);
	const totalPlayersToPick = competition.lineupSize + competition.benchSize;
	const startingPicked = useMemo(() => starting?.filter(player => !!player.id), [props.starting]);
	const benchPicked = useMemo(() => bench?.filter(player => !!player.id), [props.bench]);
	const totalPlayersPicked = useMemo(() => (startingPicked?.length || 0) + (benchPicked?.length || 0), [startingPicked, benchPicked]);
	const team = user && user.teams && user.teams[0];

	const nameRef = useRef(null);
	const playerListRef = useRef(null);
	const specificPlayerRef = useRef(null);
	const statsRef = useRef(null);
	const prevButtonProps: { children: React.ReactNode, style?: React.CSSProperties; } = {
		children: t("general.previous"),
	};
	const nextButtonProps: { children: React.ReactNode, style?: React.CSSProperties; } = {
		children: t("general.next"),
	};
	const steps: TourProps["steps"] = [
		{
			title: t("tour.newTeam.pickTeamName.title"),
			target: nameRef.current,
			prevButtonProps, nextButtonProps,
		},
		{
			title: t("tour.newTeam.specificPlayer.title"),
			description: t("tour.newTeam.specificPlayer.description"),
			target: specificPlayerRef.current,
			placement: "bottom",
			prevButtonProps, nextButtonProps,
		},
		{
			title: t("tour.newTeam.pickPlayer.title"),
			description: t("tour.newTeam.pickPlayer.description"),
			target: playerListRef.current,
			placement: "left",
			prevButtonProps, nextButtonProps,
		},
		{
			title: t("tour.newTeam.stats.title"),
			description: t("tour.newTeam.stats.description"),
			target: statsRef.current,
			placement: "top",
			prevButtonProps, nextButtonProps,
		},
		{
			title: t("tour.newTeam.end.title"),
			target: null,
			prevButtonProps, nextButtonProps: {children: t("general.finish")},
		},
	];
	const [tourOpen, setTourOpen] = useState<boolean>(true);

	return (
		<NewTeamStyle>
			{team && team.id && hasPlayers ? <Navigate to={{ pathname: `/team/${team.id}` }} /> :

				(players && clubs) &&
					<>
						<Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={steps} />
						<Row>
							<Col lg={12} md={24} sm={24} xs={24} className="left">
								<Title level={2}>{t("general.lineup")}</Title>
								<Input
									onChange={props.onTeamNameChange}
									style={{ maxWidth: "100%" }}
									placeholder={t("team.newTeamNameInput")}
									value={teamName}
									maxLength={55}
									tourRef={nameRef}
								/>

								<NewGameStats
									budget={budget}
									totalPlayers={totalPlayersToPick}
									selectedPlayers={totalPlayersPicked}
									tourRef={statsRef}
								/>
								<Team
									widthRatio={15}
									heightRatio={10}
									clubs={clubs}
									bg={""}
									assetsCdn={competition.assetsCdn}
									selection={startingByPositions}
									showCaptainBadge={true}
									showPlayerValue={true}
									// playerType={}
									playerType={PlayerType.SoccerPortrait}
									captainId={captainId}
									viceCaptainId={viceCaptainId}
									onPlaceholderClick={onPlaceHolderClick}
									showPlayerValueInsteadOfPoints={true}
									onCaptainSelect={props.onCaptainSelect}
									onViceCaptainSelect={props.onViceCaptainSelect}
									onRemove={(player: Player) => props.removePlayer(player)}
									modalEnabled={true}
									playerBadgeColor={"#fff"}
									playerBadgeBgColor={theme.primaryContrast}
									playerPointsColor={"#000"}
									playerPointsBgColor={theme.primaryColor} 
									tourRef={specificPlayerRef}
								/>

								<Row>
									{(team && hasPlayers &&
										<Button
											onClick={onTeamSave}
											type="primary"
											disabled={savingTeamPending}
											loading={savingTeamPending}
											style={{ width: "100%", maxWidth: "100%", margin: "10px 0" }}
											size="large">
											<SaveOutlined style={{ marginRight: "10px" }} />
											{t("team.saveTeam")}
										</Button>
									)}
								</Row>
							</Col>
							<Col lg={12} md={24} sm={24} xs={24} className="right">

								<Title level={2}>{t("general.allPlayers")}</Title>
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
										assetsCdn={competition.assetsCdn}
										tourRef={playerListRef}
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