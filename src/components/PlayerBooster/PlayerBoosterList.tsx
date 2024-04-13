import Title from "antd/es/typography/Title";
import { PlayerBoosterListStyle } from "./PlayerBoosterListStyle";
import { useTranslation } from "react-i18next";
import { useActivateBoosterMutation } from "@/services/teamsApi";
import { openErrorNotification, openSuccessNotification } from "@/lib/helpers";
import { useParams } from "react-router";
import { useMemo } from "react";
import { pick } from "lodash";
import { Row, Col } from "../UI/Grid/Grid";
import { PlayerBooster } from "./PlayerBooster";
import { HiddenGemSvg, GoalRushSvg } from "@/styles/custom-icons";

declare type PlayerBoosterListProps = {
	goalRushWeek?: number,
	hiddenGemWeek?: number,
	playersWithBoosters?: Player[],
	deadlineWeek?: number,
	assetsCdn?: string
}

export const PlayerBoosterList = (props: PlayerBoosterListProps) => {
	const {t} = useTranslation();
	const { id } = useParams();
	const [activateBooster] = useActivateBoosterMutation();

	const onBoosterActivation = (type: string) => {
		activateBooster({teamId: +id, type})
			.unwrap()
			.then(data => {
				openSuccessNotification({title: `${t("general.PlayerBooster")} "${t(`boosters.${type}`)}" ${t("general.activated")}!`});
			})
			.catch(err => openErrorNotification({title: err.data.message}));
	};

	const hiddenGemPlayer = useMemo(() => 
		pick(props.playersWithBoosters.filter((p: any) => p.booster == "HiddenGem")[0], ["id","short"]), 
	[props.playersWithBoosters]);
	const goalRushPlayer = useMemo(() => 
		pick(props.playersWithBoosters.filter((p: any) => p.booster == "GoalRush")[0], ["id","short"]),
	[props.playersWithBoosters]);
	
	return (
		<PlayerBoosterListStyle>
			<Title level={2}>{t("general.PlayerBoosters")}</Title>
			<Row>
				<Col xl={8} lg={12} md={12} sm={12} xs={12}>
					<PlayerBooster
						type={"hiddenGem"}
						player={hiddenGemPlayer}
						iconSvg={HiddenGemSvg}
						activatedWeek={props.hiddenGemWeek}
						deadlineWeek={props.deadlineWeek}
						onBoosterActivation={(type: string) => console.log("type", type, "activated")}
						assetsCdn={props.assetsCdn}
					/>
				</Col>
				<Col xl={8} lg={12} md={12} sm={12} xs={12}>
					<PlayerBooster
						type={"goalRush"}
						player={goalRushPlayer}
						iconSvg={GoalRushSvg}
						activatedWeek={props.goalRushWeek}
						deadlineWeek={props.deadlineWeek}
						onBoosterActivation={(type: string) => console.log("type", type, "activated")}
						assetsCdn={props.assetsCdn}
					/>
				</Col>
			</Row>
		</PlayerBoosterListStyle>
	);
};