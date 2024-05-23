import { StatsStyle } from "@/components/Stats/StatsStyle";
import { Col, Row } from "../UI/Grid/Grid";
import { useTranslation } from "react-i18next";

type TransfersOverviewProps = {
	budget: number
	totalPlayers: number
	totalPlayersSelected: number
	remainingFreeTransfers: number
	minusPoints: number
}

export const TransfersOverview = (props: TransfersOverviewProps) => {
	const {t} = useTranslation();
	return (
		<StatsStyle>
			<Row className="stat-row">
				<Col lg={6} md={6} sm={6} xs={6}>
					<p className="points">{props.budget.toFixed(2)}M</p>
					<p className="label">{t("transfersPage.overviewBudget")}</p>
				</Col>
				<Col lg={6} md={6} sm={6} xs={6}>
					<p className="points">{props.totalPlayersSelected}/{props.totalPlayers}</p>
					<p className="label">{t("transfersPage.overviewPlayers")}</p>
				</Col>
				<Col lg={6} md={6} sm={6} xs={6}>
					<p className="points">{props.minusPoints}</p>
					<p className="label">{t("transfersPage.minusPoints")}</p>
				</Col>
				<Col lg={6} md={6} sm={6} xs={6}>
					<p className="points">{props.remainingFreeTransfers < 0 ? 0 : props.remainingFreeTransfers}</p>
					<p className="label">{t("transfersPage.overviewFreeTransfers")}</p>
				</Col>
			</Row>
		</StatsStyle>
	);
};