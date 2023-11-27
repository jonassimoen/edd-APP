import { AbstractTeam } from "@/components/AbstractTeam/AbstractTeam";
import { useGetMatchQuery } from "@/services/matchesApi";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { MatchStyles } from "./MatchStyles";
import { Col, Row } from "@/components/UI/Grid/Grid";
import { Block } from "@/components/Block/Block";
import Title from "antd/lib/typography/Title";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Team } from "@/components/Team/Team";
import { useSelector } from "react-redux";
import { pick } from "lodash";
import { startingListToPositionsList } from "@/lib/helpers";
import { PlayerType } from "@/types/PlayerTypes";
import { theme } from "@/styles/theme";
import { useGetClubsQuery } from "@/services/clubsApi";
import { Substitutes } from "@/components/Substitutes/Substitutes";

import teamBackground from "./../../assets/img/fpl-pitch-no-boarding.svg";

const playerProps =
		["id", "name", "short", "positionId", "clubId", "injury", "form", "forename", "surname", "points", "pointsOverview", "stats", "portraitUrl"];


const calculatePointsByPlayerStats = (players: Player[]) => {
	return players
		.map((player: Player) => player.stats.reduce((acc: number, stat: any) => acc + stat.points, 0))
		.reduce((acc: number, points: number) => acc + points, 0);
};

const formatPlayers = (players: Player[], starting: boolean) => {
	return players
		.filter((player: Player) => {
			const firstStat = player && player.stats && player.stats[0];
			return firstStat && (starting ? firstStat.starting : !firstStat.starting && firstStat.minutesPlayed > 0);
		})
		.map((player: Player) => {
			const firstStat = player && player.stats && player.stats[0];
			return pick(
				{ ...player, ...{ points: firstStat.points, pointsOverview: (firstStat && { ...firstStat }) || {} } },
				playerProps
			);
		});
};

const _MatchContainer = (props: AbstractTeamType) => {
	const { id } = useParams();
	const [t] = useTranslation();
	const application = useSelector((state: StoreState) => state.application);

	const { data: match, isLoading: matchLoading } = useGetMatchQuery(+id);
	const { data: clubs, isLoading: clubsLoading } = useGetClubsQuery();

	const homeStartingPlayers = useMemo(() => match && match.home && match.home.players && formatPlayers(match.home.players, true), [match]);
	const awayStartingPlayers = useMemo(() => match && match.away && match.away.players && formatPlayers(match.away.players, true), [match]);
	const homeStartingPlayersByPositions = useMemo(() => homeStartingPlayers && startingListToPositionsList(homeStartingPlayers, application.competition.lineupPositionRows), [homeStartingPlayers]);
	const awayStartingPlayersByPositions = useMemo(() => awayStartingPlayers && startingListToPositionsList(awayStartingPlayers, application.competition.lineupPositionRows), [awayStartingPlayers]);

	const homeBenchPlayers = useMemo(() => match && match.home && formatPlayers(match.home.players, false), [match]);
	const awayBenchPlayers = useMemo(() => match && match.away && formatPlayers(match.away.players, false), [match]);
	const homeTotalPoints = useMemo(() => match && match.home && calculatePointsByPlayerStats(match.home.players), [match]);
	const awayTotalPoints = useMemo(() => match && match.away && calculatePointsByPlayerStats(match.away.players), [match]);

	return (
		<Spin spinning={matchLoading || clubsLoading} delay={0} style={{ padding: "2rem 0" }}>
			{match && clubs &&
								<MatchStyles>
									<Row>
										<Col md={12} sm={24} xs={24} className="left">
											<Block>
												<Title level={2}>
													{match!.home!.name}
												</Title>
												<span style={{ display: "block", fontSize: "16px", textAlign: "center" }}>{homeTotalPoints} {t("general.points")}</span>
												<Team
													widthRatio={15}
													heightRatio={10}
													clubs={clubs}
													bg={teamBackground}
													assetsCdn={application.competition.assetsCdn}
													replacePlayerPointsWithStatsPoints={true}
													selection={homeStartingPlayersByPositions}
													centerAligned={true}
													playerType={PlayerType.SoccerShirt}
													playerBadgeColor={"#fff"}
													modalEnabled={true}
													captainId={undefined}
													playerBadgeBgColor={theme.primaryColor}
													playerPointsColor={"#fff"}
													playerPointsBgColor={theme.primaryColor}
												/>
												<Substitutes
													selection={homeBenchPlayers.sort((a: any, b: any) => a.positionId - b.positionId)}
													clubs={clubs}
													title="De bank"
													bgImage={"#F4F8FF"}
													playerType={PlayerType.SoccerShirt}
													modalEnabled={true}
													assetsCdn={application.competition.assetsCdn}
													playerBadgeColor={"#000"}
													playerBadgeBgColor={theme.primaryColor}
													playerPointsColor={"#000"}
													playerPointsBgColor={theme.primaryColor}
												/>
											</Block>
										</Col>
										<Col md={12} sm={24} xs={24} className="right">
											<Block>
												<Title level={2}>
													{match!.away!.name}
												</Title>
												<span style={{ display: "block", fontSize: "16px", textAlign: "center" }}>{awayTotalPoints} {t("general.points")}</span>
												<Team
													widthRatio={15}
													heightRatio={10}
													clubs={clubs}
													bg={teamBackground}
													assetsCdn={application.competition.assetsCdn}
													replacePlayerPointsWithStatsPoints={true}
													selection={awayStartingPlayersByPositions}
													centerAligned={true}
													playerType={PlayerType.SoccerShirt}
													playerBadgeColor={"#fff"}
													modalEnabled={true}
													captainId={undefined}
													playerBadgeBgColor={theme.primaryColor}
													playerPointsColor={"#fff"}
													playerPointsBgColor={theme.primaryColor}
												/>
												<Substitutes
													selection={awayBenchPlayers.sort((a: any, b: any) => a.positionId - b.positionId)}
													clubs={clubs}
													title="De bank"
													bgImage={"#F4F8FF"}
													playerType={PlayerType.SoccerShirt}
													modalEnabled={true}
													assetsCdn={application.competition.assetsCdn}
													playerBadgeColor={"#000"}
													playerBadgeBgColor={theme.primaryColor}
													playerPointsColor={"#000"}
													playerPointsBgColor={theme.primaryColor}
												/>
											</Block>
										</Col>
									</Row>
								</MatchStyles>
			}
		</Spin>
	);
};

export const MatchContainer = () => AbstractTeam(_MatchContainer, {});