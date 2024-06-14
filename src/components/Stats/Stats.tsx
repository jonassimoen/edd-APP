import { useMemo, useState } from "react";
import { StatsStyle } from "./StatsStyle";
import { Col, Row } from "../UI/Grid/Grid";
import { useTranslation } from "react-i18next";
import React from "react";
import Icon from "@ant-design/icons";
import { ConfirmedSvg, UnConfirmedSvg } from "@/styles/custom-icons";
import { TransfersModal } from "../TransfersModal/TransfersModal";

const ConfirmedIcon = (props: any) => <Icon component={ConfirmedSvg} {...props} />;
const UnConfirmedIcon = (props: any) => <Icon component={UnConfirmedSvg} {...props} />;

declare type PointsConfirmation = {
    id: number
    seasonId: number
    weekId: number
    confirmed: number
}

declare type StatsOverviewState = {
    pointsConfirmation: PointsConfirmation[]
    transfersModalEnabled: boolean
}

declare type StatsOverviewProps = {
    weekPointsConfirmed?: boolean
    weekId: number
	boosters: BoostersWeekStatus
    visibleWeekPoints: number | string
    visibleWeekRank: number | string
    weekWinnerPoints?: number
    transfers: any[]
    generalPoints: number | string
    generalRank: number | string
}

export const Stats = (props: StatsOverviewProps) => {
	const { weekPointsConfirmed, boosters } = props;
	const [state, setState] = useState<StatsOverviewState>({
		pointsConfirmation: [],
		transfersModalEnabled: false,
	});
	const { t } = useTranslation();

	const showTransfersModal = () => {
		setState(state => ({ ...state, transfersModalEnabled: true }));
	};

	const hideTransfersModal = () => {
		setState(state => ({ ...state, transfersModalEnabled: false }));
	};

	const boosterUsed = useMemo(() => Object.entries(boosters).filter((val: [string, boolean]) => val[1])?.[0]?.[0], [boosters]);

	return (
		<StatsStyle>
			<Row className="stat">
				<Col lg={16} md={16} sm={16} xs={16} className="label">{t("pointsPage.weekStatusTitle")}</Col>
				<Col lg={8} md={8} sm={8} xs={8} className={`points result ${weekPointsConfirmed ? "confirmed" : "unconfirmed"}`}>
					{
						weekPointsConfirmed ?
							<React.Fragment>
								<ConfirmedIcon /> {t("pointsPage.weekStatusConfirmed")}
							</React.Fragment>
							:
							<React.Fragment>
								<UnConfirmedIcon /> {t("pointsPage.weekStatusNotConfirmed")}
							</React.Fragment>
					}
				</Col>
			</Row>
			<Row className="stat">
				<Col lg={15} md={15} sm={15} xs={15} className="label">{`${t("pointsPage.boosterWeekUsed")} ${props.weekId}`}</Col>
				<Col lg={9} md={9} sm={9} xs={9}  className="points">{boosterUsed ? t(`boosters.${boosterUsed}`) : "-"}</Col>
			</Row>
			<Row className="stat">
				<Col lg={15} md={15} sm={15} xs={15} className="label">{`${t("pointsPage.overviewWeekPoints")} ${props.weekId}`}</Col>
				<Col lg={9} md={9} sm={9} xs={9}  className="points">{props.visibleWeekPoints}</Col>
			</Row>
			<Row className="stat">
				<Col lg={15} md={15} sm={15} xs={15} className="label">{`${t("pointsPage.overviewWeekRank")} ${props.weekId}`}</Col>
				<Col lg={9} md={9} sm={9} xs={9}  className="points">{props.visibleWeekRank}</Col>
			</Row>
			<Row className="stat">
				<Col lg={15} md={15} sm={15} xs={15} className="label">{t("pointsPage.overviewGeneralPoints")}</Col>
				<Col lg={9} md={9} sm={9} xs={9}  className="points">{props.generalPoints}</Col>
			</Row>
			<Row className="stat">
				<Col lg={15} md={15} sm={15} xs={15} className="label">{t("pointsPage.overviewGeneralRank")}</Col>
				<Col lg={9} md={9} sm={9} xs={9}  className="points">{props.generalRank}</Col>
			</Row>
			<Row className="stat">
				<Col lg={15} md={15} sm={15} xs={15} className="label">{`${t("pointsPage.overviewWeekTotalTransfers")} ${props.weekId}`}</Col>
				<Col lg={9} md={9} sm={9} xs={9}  className={`points ${props.transfers.length ? "has-transfers" : ""}`}>
					<span onClick={props.transfers.length ? showTransfersModal: () => null}>{props.transfers.length}</span>
				</Col>
			</Row>

			<TransfersModal
				visible={state.transfersModalEnabled}
				transfers={props.transfers}
				onCancel={hideTransfersModal}
			/>
		</StatsStyle>
	);
};