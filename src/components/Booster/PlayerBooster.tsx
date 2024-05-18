import { useTranslation } from "react-i18next";
import { BoosterStyle } from "./BoosterStyle";
import Icon from "@ant-design/icons";
import { Button } from "../UI/Button/Button";
import { ComponentType, SVGProps, useMemo } from "react";
import { Player } from "../Player/Player";
import { PlayerType } from "@/types/PlayerTypes";
import { theme } from "@/styles/theme";

declare type PlayerBoosterProps = {
	type: string
	iconSvg?: ComponentType<SVGProps<SVGSVGElement>>
	player?: Player
	activatedWeek?: number
	deadlineWeek?: number
	assetsCdn?: string
	boosterLimit: boolean
	onBoosterActivation: (type?: string) => any
}

export const PlayerBooster = (props: PlayerBoosterProps) => {
	const {t} = useTranslation();

	const boosterUsed = useMemo(() => !!(props.activatedWeek && props.activatedWeek <= props.deadlineWeek), [props]);
	const boosterActive = useMemo(() => !!(props.activatedWeek && props.activatedWeek == props.deadlineWeek), [props]);
	const assignedPlayerValid = useMemo(() => props.player && Object.keys(props.player).length !== 0, [props.player]);
	
	const onActivateClick = () => {
		if(!boosterUsed && !props.boosterLimit && props.onBoosterActivation) {
			props.onBoosterActivation(props.type);
		}
	};

	return (
		<BoosterStyle className="booster">
			<p className="booster-type">{t(`boosters.${props.type}`)}</p>
			<div className="booster-icon">
				{
					boosterUsed && assignedPlayerValid ?
						<div className="booster-player">
							<Player
								badgeColor={"#fff"}
								badgeBgColor={theme.primaryContrast}
								pointsColor={"#000"}
								pointsBgColor={theme.primaryColor}
								player={props.player}
								avatarOnly={true}
								type={PlayerType.SoccerPortrait}
								face = {`${props.assetsCdn}/players/${props.player.id}.png`}
								faceFallback = {`${props.assetsCdn}/players/dummy.png`}
							/>
							<p className="player-name">{props.player.short}</p>
						</div>
						:
						<Icon 
							component={props.iconSvg} 
							style={{display: "block", fontSize: 50}}
						/>
				}
			</div>
			
			<Button
				disabled={boosterUsed || props.boosterLimit}
				onClick={onActivateClick}
				type="primary"
				className={boosterActive?"activeBooster":null}
			>
				{boosterActive ?
					t("boosters.active") 
					: 
					boosterUsed ? 
						`${t("general.matchday")} ${props.activatedWeek}`
						: t("boosters.activate")}
			</Button>
		</BoosterStyle>
	);
};