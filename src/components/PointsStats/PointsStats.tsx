import { useTranslation } from "react-i18next";
import { StatsStyle } from "../Stats/StatsStyle";
import { Col, Row } from "../UI/Grid/Grid";

declare type StatsOverviewProps = {
    visibleWeekPoints: number | string
    weekWinnerPoints: number
    isPublic: boolean
    weekAveragePoints: number
}

export const PointsStats = (props: StatsOverviewProps) => {
	const { t } = useTranslation();
	const { isPublic } = props;

	return (
		<StatsStyle>
			<Row className="stat-row">
				<Col lg={8} md={8} sm={8} xs={8}>
					<p className="points">{isNaN(props.weekAveragePoints as any) ? "-" : Math.floor(props.weekAveragePoints as number)}</p>
					<p className="label">{t("pointsPage.averagePoints")}</p>
				</Col>
				<Col lg={8} md={8} sm={8} xs={8}>
					<p className="points">{props.visibleWeekPoints}</p>
					<p className="label">{isPublic ? t("pointsPage.publicTeamPoints") : t("pointsPage.yourPoints")}</p>
				</Col> 
				<Col lg={8} md={8} sm={8} xs={8}>
					<p className="points">{props.weekWinnerPoints}</p>
					<p className="label">{t("pointsPage.weekWinnerPoints")}</p>
				</Col> 
			</Row>
		</StatsStyle>
	);
};