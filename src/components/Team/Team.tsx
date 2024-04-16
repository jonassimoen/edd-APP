import { Player } from "../Player/Player";
import { PlayerType } from "@/types/PlayerTypes";
import { TeamStyle } from "./TeamStyle";
import { useEffect } from "react";

export declare type TeamProps = {
    bg: string;
    bgSponsor?: string;
    widthRatio: number;
    heightRatio: number;
    playerType: PlayerType;
    selection: any;
    startedThisWeek?: any;
    playerBadgeColor: string;
    playerBadgeBgColor: string;
    playerPointsColor: string;
    playerPointsBgColor: string;
    onRemove?: any;
    onSwap?: any;
    isSwapAble?: any;
    onCaptainSelect?: any;
    onViceCaptainSelect?: any;
    modalEnabled?: boolean;
    onPlaceholderClick?: any;
    swapPlayerId?: number | null;
    swappedFrom?: string | null;
    assetsCdn: string;
    actionLessPlayerIds?: any[];
    showPlayerValue?: boolean;
    replacePlayerPointsWithStatsPoints?: boolean;
    clubs: Club[];
    showPlayerValueInsteadOfPoints?: boolean;
    captainId?: number;
    captainHasPlayed?: boolean;
    showCaptainBadge?: boolean;
	showBoosterBadge?: boolean
    // boosterWeekStatus?: BoostersWeekStatus;
    viceCaptainId?: number;
    centerAligned?: boolean | undefined;
	motmId?: number
    // t: i18next.TFunction;
};

export const Team = (props: TeamProps) => {
	const { 
		bg, 
		bgSponsor,
		widthRatio, 
		heightRatio, 
		selection, 
		playerBadgeColor, 
		playerBadgeBgColor, 
		playerPointsColor, 
		playerPointsBgColor, 
		playerType,
		onRemove, 
		onSwap, 
		onPlaceholderClick, 
		swapPlayerId, 
		swappedFrom, 
		assetsCdn, 
		actionLessPlayerIds, 
		showPlayerValue, 
		replacePlayerPointsWithStatsPoints, 
		showPlayerValueInsteadOfPoints, 
		clubs, 
		onCaptainSelect, 
		modalEnabled, 
		captainId, 
		centerAligned, 
		isSwapAble, 
		captainHasPlayed, 
		viceCaptainId, 
		showCaptainBadge,
		showBoosterBadge,
		onViceCaptainSelect,
		motmId,
	} = props;

	return (
		<TeamStyle bg={bg} widthRatio={widthRatio} heightRatio={heightRatio} centerAligned={centerAligned}>
			{selection ? selection.map((position: any, positionIdx: number) => {
				const imgProps: {
					shirt?: string,
					face?: string,
					faceFallback?: string,
					shirtFallback?: string,
				} = {};

				return (
					<div className={"position"} key={`posIdx-${positionIdx}`}>
						{
							position.map((player: any, playerIdx: number) => {
								const club = clubs.find((item: Club, index: number) => player && item.id === player.clubId);
								
								if(PlayerType.SoccerPortrait === playerType) {
									imgProps.face = `${assetsCdn}/players/${player.id}.png`;
									imgProps.faceFallback = `${assetsCdn}/players/dummy.png`;
								} else if(PlayerType.SoccerShirt === playerType) {
									imgProps.shirt = `${assetsCdn}/jerseys/${player.clubId}.png`;
									imgProps.shirtFallback = `${assetsCdn}/jerseys/dummy.png`;
								}

								return (
									<Player
										key={`player-${positionIdx}-${playerIdx}`}
										pointsColor={playerPointsColor}
										pointsBgColor={playerPointsBgColor}
										badgeColor={playerBadgeColor}
										badgeBgColor={playerBadgeBgColor}
										positionIndex={positionIdx + 1}
										modalEnabled={modalEnabled}
										captainId={captainId}
										viceCaptainId={viceCaptainId}
										captainHasPlayed={captainHasPlayed}
										player={player}
										replacePlayerPointsWithStatsPoints={replacePlayerPointsWithStatsPoints}
										showPlayerValue={showPlayerValue}
										showCaptainBadge={showCaptainBadge}
										showBoosterBadge={showBoosterBadge}
										onRemove={onRemove}
										showPlayerValueInsteadOfPoints={showPlayerValueInsteadOfPoints}
										onSwap={onSwap}
										isSwapable={isSwapAble}
										onCaptainSelect={onCaptainSelect}
										onViceCaptainSelect={onViceCaptainSelect}
										onPlaceholderClick={onPlaceholderClick}
										swapPlayerId={swapPlayerId}
										actionLessPlayerIds={actionLessPlayerIds}
										swappedFrom={swappedFrom}
										club={club}
										type={playerType}
										motm={motmId===player.id}
										{...imgProps}
									/>
								);
							})
						}
					</div>
				);
			})
				: "Deze ploeg heeft geen opstelling voor deze speeldag."
			}
		</TeamStyle>
	);
};