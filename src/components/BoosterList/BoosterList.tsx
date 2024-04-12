import Title from "antd/es/typography/Title";
import { BoosterListStyle } from "./BoosterListStyle";
import { useTranslation } from "react-i18next";
import { Col, Row } from "../UI/Grid/Grid";
import { TripleCaptSvg, BenchSvg, WildcardSvg, DaySvg } from "@/styles/custom-icons";
import { Booster } from "./Booster";
import { useActivateBoosterMutation } from "@/services/teamsApi";
import { openErrorNotification, openSuccessNotification } from "@/lib/helpers";
import { useParams } from "react-router";
import { useMemo } from "react";

declare type BoosterListProps = {
	tripleCaptain?: number
	viceVictory?: number
	superSub?: number
	deadlineWeek: number
}

export const BoosterList = (props: BoosterListProps) => {
	const {t} = useTranslation();
	const { id } = useParams();
	const [activateBooster] = useActivateBoosterMutation();

	const onBoosterActivation = (type: string) => {
		activateBooster({teamId: +id, type})
			.unwrap()
			.then(data => {
				openSuccessNotification({title: `${t("general.teamBooster")} "${t(`boosters.${type}`)}" ${t("general.activated")}!`});
			})
			.catch(err => openErrorNotification({title: err.data.message}));
	};

	const {
		tripleCaptain,
		viceVictory,
		superSub,
		deadlineWeek,
	} = props;

	const teamBoosterActiveCurrentWeek = useMemo(
		() => (props.tripleCaptain == props.deadlineWeek) || 
			(props.viceVictory == props.deadlineWeek) || (props.superSub == props.deadlineWeek)
		, [props]);

	return (
		<BoosterListStyle>
			<Title level={2}>{t("general.teamBoosters")}</Title>
			<Row>
				<Col md={12} sm={12} xs={12}>
					<Booster 
						iconSvg={TripleCaptSvg}
						type="tripleCaptain" 
						onActivation={onBoosterActivation}
						unusable={teamBoosterActiveCurrentWeek || (tripleCaptain != null)}
						currentlyActive={tripleCaptain === deadlineWeek}
					/>
				</Col>
				<Col md={12} sm={12} xs={12}>
					<Booster 
						iconSvg={BenchSvg}
						type="viceVictory" 
						onActivation={onBoosterActivation}
						unusable={teamBoosterActiveCurrentWeek || (viceVictory != null)}
						currentlyActive={viceVictory === deadlineWeek}
					/>
				</Col>
			</Row>
		</BoosterListStyle>
	);
};