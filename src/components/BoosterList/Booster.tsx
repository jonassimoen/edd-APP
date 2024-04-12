import { useTranslation } from "react-i18next";
import { BoosterStyle } from "./BoosterStyle";
import Icon from "@ant-design/icons";
import { Button } from "../UI/Button/Button";

declare type BoosterProps = {
	type: string;
	iconSvg: any;
	currentlyActive?: boolean;
	unusable?: boolean;
	onActivation: (type: string) => any;
}

export const Booster = (props: BoosterProps) => {
	const {t} = useTranslation();

	const onActivateClick = () => {
		if(!props.unusable) {
			props.onActivation(props.type);
		}
	};

	return (
		<BoosterStyle className="booster">
			<p className="booster-type">{t(`boosters.${props.type}`)}</p>
			<Icon 
				component={props.iconSvg} 
				style={{display: "block", fontSize: 40, marginBottom: 20}}
			/>
			<Button
				disabled={props.unusable}
				onClick={onActivateClick}
				type="primary"
			>
				{props.currentlyActive?t("boosters.active"):t("boosters.activate")}
			</Button>
		</BoosterStyle>
	);
};