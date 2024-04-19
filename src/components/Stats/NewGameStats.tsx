import { useTranslation } from "react-i18next";
import { Col, Row } from "../UI/Grid/Grid";
import { StatsStyle } from "./StatsStyle";

declare type StatsProps =  {
    budget: number
    totalPlayers: number
    selectedPlayers: number
	tourRef?: any
}

export const NewGameStats = (props: StatsProps) => {
	const { t } = useTranslation();
	return (
		<StatsStyle ref={props.tourRef}>
			<Row className="stat-row">
				<Col lg={12} md={12} sm={12} xs={12}>
					<p className="points">{props.selectedPlayers}/{props.totalPlayers}</p>
					<p className="label">{t("team.players")}</p>

				</Col>
				<Col lg={12} md={12} sm={12} xs={12}>
					<p className="points">€{props.budget.toFixed(2)}M</p>
					<p className="label">{t("team.remainingBudget")}</p>
				</Col>
			</Row>
		</StatsStyle>
	);
};