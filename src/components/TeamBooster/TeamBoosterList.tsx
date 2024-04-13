import Title from "antd/es/typography/Title";
import { TeamBoosterListStyle } from "./TeamBoosterListStyle";
import { useTranslation } from "react-i18next";
import { Col, Row } from "../UI/Grid/Grid";
import { TripleCaptSvg, BenchSvg, WildcardSvg, DaySvg } from "@/styles/custom-icons";
import { TeamBooster } from "./TeamBooster";
import { useActivateBoosterMutation } from "@/services/teamsApi";
import { openErrorNotification, openSuccessNotification } from "@/lib/helpers";
import { useParams } from "react-router";
import { useMemo } from "react";

declare type TeamBoosterListProps = {
	tripleCaptain?: number
	viceVictory?: number
	superSub?: number
	deadlineWeek: number
}

export const TeamBoosterList = (props: TeamBoosterListProps) => {
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
		<TeamBoosterListStyle>
			<Title level={2}>{t("general.teamBoosters")}</Title>
			<Row>
				<Col xl={8} lg={12} md={12} sm={12} xs={12}>
					<TeamBooster 
						iconSvg={TripleCaptSvg}
						type="tripleCaptain" 
						onActivation={onBoosterActivation}
						unusable={teamBoosterActiveCurrentWeek || (tripleCaptain != null)}
						currentlyActive={tripleCaptain === deadlineWeek}
					/>
				</Col>
				<Col xl={8} lg={12} md={12} sm={12} xs={12}>
					<TeamBooster 
						iconSvg={BenchSvg}
						type="viceVictory" 
						onActivation={onBoosterActivation}
						unusable={teamBoosterActiveCurrentWeek || (viceVictory != null)}
						currentlyActive={viceVictory === deadlineWeek}
					/>
				</Col>
			</Row>
		</TeamBoosterListStyle>
	);
};