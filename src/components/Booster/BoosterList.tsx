import Title from "antd/es/typography/Title";
import { BoosterListStyle } from "./BoosterListStyle";
import { useTranslation } from "react-i18next";
import { Col, Row } from "../UI/Grid/Grid";
import { TripleCaptSvg, HiddenGemSvg, GoalRushSvg, SuperSubsSvg, WildcardSvg, FanFavouriteSvg } from "@/styles/custom-icons";
import { TeamBooster } from "./TeamBooster";
import { useNavigate, useParams } from "react-router";
import { useMemo, useState } from "react";
import { BoosterConfirmModal } from "../BoosterConfirmModal/BoosterConfirmModal";
import { PlayerBooster } from "./PlayerBooster";
import { pick } from "lodash";

declare type BoosterListProps = {
	teamId?: number
	boosters?: Boosters
	
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
	const navigate = useNavigate();
	const {id} = useParams();
	const [state, setState] = useState<BoosterListState>({
	});

	const {
		teamId,
		assetsCdn,
		deadlineWeek,
		possiblePlayers,
	} = props;

	const {
		tripleCaptain,
		superSubs,
		freeHit,
		goalRush,
		hiddenGem,
		fanFavourite,
	} = props.boosters;

	const onBoosterActivation = (type: string) => {
		setState((state) => ({...state, open: true, type }));
	};
	const onFreeHitBoosterUse = () => {
		navigate(`/edit/${teamId}`);
	};

	const boosterLimitReached = useMemo(() => 
		[tripleCaptain, freeHit, superSubs, goalRush, hiddenGem, fanFavourite].filter((v: number) => v == deadlineWeek).length >= 2
	, [props]);

	const hiddenGemPlayer = useMemo(() => 
		pick(props.playersWithBoosters.filter((p: any) => p.booster == "HiddenGem")[0], ["id","short"]), 
	[props.playersWithBoosters]);
	const goalRushPlayer = useMemo(() => 
		pick(props.playersWithBoosters.filter((p: any) => p.booster == "GoalRush")[0], ["id","short"]),
	[props.playersWithBoosters]);
	const fanFavouritePlayer = useMemo(() => 
		pick(props.playersWithBoosters.filter((p: any) => p.booster == "FanFavourite")[0], ["id","short"]),
	[props.playersWithBoosters]);

	return (
		<BoosterListStyle>
			<Title level={4}>Boosters</Title>
			<Row justify={"center"}>
				<Col span={8}>
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
				<Col span={8}>
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
				<Col span={8}>
					<PlayerBooster
						type={"fanFavourite"}
						player={fanFavouritePlayer}
						iconSvg={FanFavouriteSvg}
						activatedWeek={fanFavourite}
						deadlineWeek={deadlineWeek}
						onBoosterActivation={onBoosterActivation}
						assetsCdn={assetsCdn}
						boosterLimit={boosterLimitReached}
					/>
				</Col>
			</Row>
			<Row justify={"center"}>
				<Col span={8}>
					<TeamBooster 
						iconSvg={TripleCaptSvg}
						type="tripleCaptain" 
						onActivation={onBoosterActivation}
						activatedWeek={tripleCaptain}
						deadlineWeek={deadlineWeek}
						boosterLimit={boosterLimitReached}
					/>
				</Col>
				<Col span={8}>
					<TeamBooster 
						iconSvg={SuperSubsSvg}
						type="superSubs" 
						onActivation={onBoosterActivation}
						activatedWeek={superSubs}
						deadlineWeek={deadlineWeek}
						boosterLimit={boosterLimitReached}
					/>
				</Col>
				<Col span={8}>
					<TeamBooster 
						iconSvg={WildcardSvg}
						type="freeHit" 
						onActivation={onBoosterActivation}
						activatedWeek={freeHit}
						deadlineWeek={deadlineWeek}
						boosterLimit={boosterLimitReached}
						onUse={onFreeHitBoosterUse}
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