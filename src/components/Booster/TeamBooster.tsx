import { useTranslation } from "react-i18next";
import { BoosterStyle } from "./BoosterStyle";
import Icon from "@ant-design/icons";
import { Button } from "../UI/Button/Button";
import { ComponentType, SVGProps, useMemo } from "react";

declare type TeamBoosterProps = {
	type: string;
	iconSvg?: ComponentType<SVGProps<SVGSVGElement>>
	activatedWeek?: number
	deadlineWeek?: number
	boosterLimit: boolean
	onActivation: (type: string) => any
	onUse?: () => any
}

export const TeamBooster = (props: TeamBoosterProps) => {
	const {t} = useTranslation();
	
	const boosterUsed = useMemo(() => !!(props.activatedWeek && props.activatedWeek <= props.deadlineWeek), [props]);
	const boosterActive = useMemo(() => !!(props.activatedWeek && props.activatedWeek == props.deadlineWeek), [props]);

	const onActivateClick = () => {
		if(!boosterActive && !props.boosterLimit && !boosterUsed) {
			props.onActivation(props.type);
		}
		if(boosterActive && props.onUse) {
			props.onUse();
		}
	};

	return (
		<BoosterStyle className={`booster-${(boosterActive ? "active" : ((boosterUsed || props.boosterLimit) ? "disabled" : "available") )}`}>
			<div className="booster-icon">
				<Icon 
					component={props.iconSvg} 
					className={`booster ${boosterActive ? "boosterActive" : ""}`}
				/>
			</div>
			<Button
				disabled={(!boosterActive && (boosterUsed || props.boosterLimit)) || (boosterUsed && !props.onUse)}
				onClick={onActivateClick}
				type="primary"
				className={boosterActive?"activeBooster":null}
			>
				{boosterActive ?
					(props.onUse ? t("boosters.use") : t("boosters.active") )
					: 
					boosterUsed ? 
						`${t("general.matchdayCamelCase")} ${props.activatedWeek}`
						: t("boosters.activate")}
			</Button>
		</BoosterStyle>
	);
};