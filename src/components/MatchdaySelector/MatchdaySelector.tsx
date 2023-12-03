import { useTranslation } from "react-i18next";
import { ButtonStyle, MatchdaySelectorStyle } from "./MatchdaySelectorStyle";

type MatchdaySelectorProps = {
	day: number
	name: string
	min: number
	max: number
	onNext: any
	onPrev: any
}

export const MatchdaySelector = (props: MatchdaySelectorProps) => {
	const [t] = useTranslation();
	const previousDisabled = props.min && props.day === props.min;
	const nextDisabled = props.max && props.day === props.max - 1;

	return (
		<MatchdaySelectorStyle>
			<ButtonStyle
				type="previous"
				className={previousDisabled ? "disabled" : ""}
				onClick={previousDisabled ? () => ({}) : props.onPrev}
			/>
			{t("general.footballWeek")} {props.day} {props.name ? ` - ${props.name}` : ""}
			<ButtonStyle
				type="next"
				className={nextDisabled ? "disabled" : ""}
				onClick={nextDisabled ? () => ({}) : props.onNext}
			/>
		</MatchdaySelectorStyle>
	);
};