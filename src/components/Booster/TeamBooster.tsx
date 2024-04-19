import { useTranslation } from "react-i18next";
import { TeamBoosterStyle } from "./TeamBoosterStyle";
import Icon from "@ant-design/icons";
import { Button } from "../UI/Button/Button";
import { ComponentType, SVGProps, useMemo } from "react";

declare type TeamBoosterProps = {
	type: string;
	iconSvg?: ComponentType<SVGProps<SVGSVGElement>>
	activatedWeek?: number
	deadlineWeek?: number
	boosterLimit: boolean
	onActivation: (type: string) => any;
}

export const TeamBooster = (props: TeamBoosterProps) => {
	const {t} = useTranslation();
	
	const boosterUsed = useMemo(() => !!(props.activatedWeek && props.activatedWeek <= props.deadlineWeek), [props]);
	const boosterActive = useMemo(() => !!(props.activatedWeek && props.activatedWeek == props.deadlineWeek), [props]);

	const onActivateClick = () => {
		if(!boosterActive && !props.boosterLimit && !boosterUsed) {
			props.onActivation(props.type);
		}
	};

	return (
		<TeamBoosterStyle className="booster">
			<p className="booster-type">{t(`boosters.${props.type}`)}</p>
			<Icon 
				component={props.iconSvg} 
				style={{display: "block", fontSize: 50, marginBottom: 20}}
			/>
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
						`${t("boosters.used")}: \n ${t("general.matchday")} ${props.activatedWeek}`
						: t("boosters.activate")}
			</Button>
		</TeamBoosterStyle>
	);
};