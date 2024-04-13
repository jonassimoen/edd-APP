import { useTranslation } from "react-i18next";
import { TeamBoosterStyle } from "./TeamBoosterStyle";
import Icon from "@ant-design/icons";
import { Button } from "../UI/Button/Button";
import { ComponentType, SVGProps } from "react";

declare type TeamBoosterProps = {
	type: string;
	iconSvg?: ComponentType<SVGProps<SVGSVGElement>>
	currentlyActive?: boolean;
	unusable?: boolean;
	onActivation: (type: string) => any;
}

export const TeamBooster = (props: TeamBoosterProps) => {
	const {t} = useTranslation();

	const onActivateClick = () => {
		if(!props.unusable) {
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
				disabled={props.unusable}
				onClick={onActivateClick}
				type="primary"
			>
				{props.currentlyActive?t("boosters.active"):t("boosters.activate")}
			</Button>
		</TeamBoosterStyle>
	);
};