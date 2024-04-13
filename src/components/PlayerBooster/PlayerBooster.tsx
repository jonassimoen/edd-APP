import { useTranslation } from "react-i18next";
import { PlayerBoosterStyle } from "./PlayerBoosterStyle";
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
	onBoosterActivation: (type?: string) => any
}

export const PlayerBooster = (props: PlayerBoosterProps) => {
	const {t} = useTranslation();

	const boosterUsed = useMemo(() => !!(props.activatedWeek && props.activatedWeek <= props.deadlineWeek), [props]);
	const boosterActive = useMemo(() => !!(props.activatedWeek && props.activatedWeek == props.deadlineWeek), [props]);
	
	const onActivateClick = () => {
		if(!boosterUsed && props.onBoosterActivation) {
			props.onBoosterActivation(props.type);
		}
	};

	return (
		<PlayerBoosterStyle>
			<p className="booster-type">{t(`boosters.${props.type}`)}</p>
			<div className="booster-icon">
				{
					boosterUsed ?
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
				disabled={boosterUsed}
				onClick={onActivateClick}
				type="primary"
				className={boosterActive?"activeBooster":null}
			>
				{boosterActive ?
					t("boosters.active") 
					: 
					boosterUsed ? 
						`${t("boosters.used")}: \n ${t("general.footballWeek")} ${props.activatedWeek}`
						: t("boosters.activate")}
			</Button>
		</PlayerBoosterStyle>
	);
};