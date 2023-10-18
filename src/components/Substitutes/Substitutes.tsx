import React from "react";
import { SubstitutesStyle } from "./SubstitutesStyle";
import { PlayerType } from "@/types/PlayerTypes";
import { Player } from "../Player/Player";
import { useTranslation } from "react-i18next";

type SubstitutesProps = {
    title: string
    bgColor?: string
    selection: any[]
    assetsCdn: string
    playerType: PlayerType
    onPlaceholderClick?: any
    actionsLessPlayerIds?: any[]

    playerBadgeColor: string
    playerBadgeBgColor: string
    playerPointsColor: string
    playerPointsBgColor: string

    modalEnabled?: boolean
    showPlayerValue?: boolean
    showPlayerValueInsteadOfPoints?: boolean
    showPositionNumber?: boolean

    captainId?: number
    viceCaptainId?: number
    showCaptainBadge?: boolean

    onRemove?: any
    onSwap?: any
    isSwapAble?: any
    swapPlayerId?: number | null
    swappedFrom?: string | null
}

export const Substitutes = (props: SubstitutesProps) => {
	const {t} = useTranslation();

	return (
		<SubstitutesStyle bgColor={props.bgColor}>
			<div className="substitutes">
				{props.selection.map((player: any, idx: number) => {

					let positionLabel = "";
					if(props.showPositionNumber)  {
						positionLabel = player && player.positionId == 1 ? t("player.goalkeeperShort") : idx.toString();
					}

					return <React.Fragment key={`substitute-${idx}`}>
						<Player
						 	className={"substitutes-player"}
							pointsColor={props.playerPointsColor}
							pointsBgColor={props.playerPointsBgColor}
							badgeColor={props.playerBadgeColor}
							badgeBgColor={player.playerBadgeBgColor}
							player={player}
							// type={props.playerType}
							modalEnabled={props.modalEnabled}
							// showPlayerValue={props.showPlayerValue}
							onRemove={props.onRemove}
							isSwapable={props.isSwapAble}
							captainId={props.captainId}
							viceCaptainId={props.viceCaptainId}
							showCaptainBadge={props.showCaptainBadge}
							// showPlayerValueInsteadOfPoints={props.showPlayerValueInsteadOfPoints}
							onSwap={props.onSwap}
							swapPlayerId={props.swapPlayerId}
							swappedFrom={props.swappedFrom}
							// benchPlayer={true}
							positionLabel={positionLabel}
							onPlaceholderClick={props.onPlaceholderClick}
							actionLessPlayerIds={props.actionsLessPlayerIds}
						/>
					</React.Fragment>;
				})}
			</div>
		</SubstitutesStyle>
	);
};