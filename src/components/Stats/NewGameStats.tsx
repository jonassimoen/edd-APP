import { useTranslation } from "react-i18next";
import { Col, Row } from "../UI/Grid/Grid";
import { StatsStyle } from "./StatsStyle";

declare type StatsProps =  {
    budget: number
	maxPlayersSameClub: number
    totalPlayers: number
    selectedPlayers: number
	tourRef?: any
}

export const NewGameStats = (props: StatsProps) => {
	const { t } = useTranslation();
	return (
		<StatsStyle ref={props.tourRef}>
			<Row className="stat-row">
				<Col span={8}>
					<p className="points">{props.selectedPlayers}
						<span className="lower">/{props.totalPlayers}</span>
					</p>
					<p className="label">{t("team.players")}</p>

				</Col>
				<Col span={8}>
					<p className="points">€{props.budget.toFixed(2)}M</p>
					<p className="label">{t("team.remainingBudget")}</p>
				</Col>
				<Col span={8}>
					<p className="points">{props.maxPlayersSameClub}</p>
					<p className="label">{t("team.playersSameClub")}</p>
				</Col>
			</Row>
		</StatsStyle>
	);
};