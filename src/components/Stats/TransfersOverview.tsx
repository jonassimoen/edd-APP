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
				<Col lg={8} md={8} sm={8} xs={8}>
					<p className="points">{props.budget.toFixed(2)}M</p>
					<p className="label">{t("TransfersPage.overviewBudget")}</p>
				</Col>
				<Col lg={8} md={8} sm={8} xs={8}>
					<p className="points">{props.totalPlayersSelected}/{props.totalPlayers}</p>
					<p className="label">{t("TransfersPage.overviewPlayers")}</p>
				</Col>
				<Col lg={8} md={8} sm={8} xs={8}>
					<p className="points">{props.remainingFreeTransfers < 0 ? 0 : props.remainingFreeTransfers}</p>
					<p className="label">{t("TransfersPage.overviewTransfers")}</p>
				</Col>
			</Row>
		</StatsStyle>
	);
};