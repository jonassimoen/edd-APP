import Title from "antd/es/typography/Title";
import { BoosterListStyle } from "./TeamBoosterListStyle";
import { useTranslation } from "react-i18next";
import { Col, Row } from "../UI/Grid/Grid";
import { TripleCaptSvg, BenchSvg, HiddenGemSvg, GoalRushSvg } from "@/styles/custom-icons";
import { TeamBooster } from "./TeamBooster";
import { useParams } from "react-router";
import { useMemo, useState } from "react";
import { BoosterConfirmModal } from "../BoosterConfirmModal/BoosterConfirmModal";
import { PlayerBooster } from "./PlayerBooster";
import { pick } from "lodash";

declare type BoosterListProps = {
	goalRush?: number,
	hiddenGem?: number,
	tripleCaptain?: number
	viceVictory?: number
	superSub?: number
	
	possiblePlayers: Player[]
	assetsCdn?: string
	playersWithBoosters?: Player[],
	deadlineWeek?: number,
}

declare type BoosterListState = {
	open?: boolean
	selectedPlayer?: Player
	type?: string
}

export const BoosterList = (props: BoosterListProps) => {
	const {t} = useTranslation();
	const {id} = useParams();
	const [state, setState] = useState<BoosterListState>({
	});

	const {
		goalRush,
		hiddenGem,
		tripleCaptain,
		viceVictory,
		superSub,
		assetsCdn,
		deadlineWeek,
		possiblePlayers,
	} = props;

	const onBoosterActivation = (type: string) => {
		setState((state) => ({...state, open: true, type }));
	};

	const boosterLimitReached = useMemo(() => 
		[goalRush, hiddenGem, viceVictory, tripleCaptain].filter((v: number) => v == deadlineWeek).length >= 2
	, [props]);

	const hiddenGemPlayer = useMemo(() => 
		pick(props.playersWithBoosters.filter((p: any) => p.booster == "HiddenGem")[0], ["id","short"]), 
	[props.playersWithBoosters]);
	const goalRushPlayer = useMemo(() => 
		pick(props.playersWithBoosters.filter((p: any) => p.booster == "GoalRush")[0], ["id","short"]),
	[props.playersWithBoosters]);

	return (
		<BoosterListStyle>
			<Title level={2}>{t("general.playerBoosters")}</Title>
			<Row>
				<Col xl={8} lg={12} md={12} sm={12} xs={12}>
					<PlayerBooster
						type={"hiddenGem"}
						player={hiddenGemPlayer}
						iconSvg={HiddenGemSvg}
						activatedWeek={hiddenGem}
						deadlineWeek={deadlineWeek}
						onBoosterActivation={onBoosterActivation}
						assetsCdn={assetsCdn}
						boosterLimit={boosterLimitReached}
					/>
				</Col>
				<Col xl={8} lg={12} md={12} sm={12} xs={12}>
					<PlayerBooster
						type={"goalRush"}
						player={goalRushPlayer}
						iconSvg={GoalRushSvg}
						activatedWeek={goalRush}
						deadlineWeek={deadlineWeek}
						onBoosterActivation={onBoosterActivation}
						assetsCdn={assetsCdn}
						boosterLimit={boosterLimitReached}
					/>
				</Col>
			</Row>
			<Title level={2}>{t("general.teamBoosters")}</Title>
			<Row>
				<Col xl={8} lg={12} md={12} sm={12} xs={12}>
					<TeamBooster 
						iconSvg={TripleCaptSvg}
						type="tripleCaptain" 
						onActivation={onBoosterActivation}
						activatedWeek={tripleCaptain}
						deadlineWeek={deadlineWeek}
						boosterLimit={boosterLimitReached}
					/>
				</Col>
				<Col xl={8} lg={12} md={12} sm={12} xs={12}>
					<TeamBooster 
						iconSvg={BenchSvg}
						type="viceVictory" 
						onActivation={onBoosterActivation}
						activatedWeek={viceVictory}
						deadlineWeek={deadlineWeek}
						boosterLimit={boosterLimitReached}
					/>
				</Col>
			</Row>
			<BoosterConfirmModal
				teamId={+id}
				open={state.open}
				type={state.type}
				onCancel={() => setState((state) => ({...state, open: false}))}
				possiblePlayers={possiblePlayers}
			/>
		</BoosterListStyle>
	);
};