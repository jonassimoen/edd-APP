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
    showPlayerStatsPoints?: boolean;
    clubs: Club[];
    showPlayerValueInsteadOfPoints?: boolean;
    captainId?: number;
    captainHasPlayed?: boolean;
    showCaptainBadge?: boolean;
    // boosterWeekStatus?: BoostersWeekStatus;
    viceCaptainId?: number;
    centerAligned?: boolean | undefined;
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
		showPlayerStatsPoints, 
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
		onViceCaptainSelect 
	} = props;

	return (
		<TeamStyle bg={bg} widthRatio={widthRatio} heightRatio={heightRatio} centerAligned={centerAligned}>
			{selection ? selection.map((position: any, positionIdx: number) => {
				return (
					<div className={"position"} key={`posIdx-${positionIdx}`}>
						{
							position.map((player: any, playerIdx: number) => {
								const club = clubs.find((item: Club, index: number) => player && item.id === player.clubId);
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
										player={player}
										// showPlayerStatsPoints={showPlayerStatsPoints}
										showPlayerValue={showPlayerValue}
										showCaptainBadge={showCaptainBadge}
										// type={playerType}
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