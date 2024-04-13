import { useTranslation } from "react-i18next";
import { Col, Row } from "../UI/Grid/Grid";
import { BoosterStatsTable, PlayerBg } from "./BoosterStatsStyle";
import { useMemo, useState } from "react";
import Icon from "@ant-design/icons";
import { GoalRushSvg, HiddenGemSvg, TripleCaptSvg } from "@/styles/custom-icons";

declare type BoosterStatsProps = {
	boosterWeekStatus: BoostersWeekStatus;
	boostedPlayers: Partial<Player>[];
	assetsCdn: string;
}

export const BoosterStats = (props: BoosterStatsProps) => {	
	const { t } = useTranslation();
	const BoosterIcons: {[type: string]: () => JSX.Element} = {
		"tripleCaptain": TripleCaptSvg,
		"viceVictory": TripleCaptSvg,
		"goalRush": GoalRushSvg,
		"hiddenGem": HiddenGemSvg,
		"superSub": TripleCaptSvg,
	};

	const usedBoosterTypes = useMemo(() => Object.entries(props.boosterWeekStatus)
		.filter(([key, value]) => value === true)
		.map(([key, value]) => key)
	,[props.boosterWeekStatus]);

	const { boostedPlayers } = props;

	return (
		<BoosterStatsTable>
			<thead>
				<tr>
					<th></th>
					<th>{t("pointsPage.boosterStats.type")}</th>
					<th colSpan={2}>{t("pointsPage.boosterStats.player")}</th>
					<th>{t("pointsPage.boosterStats.extraPoints")}</th>
				</tr>
			</thead>
			<tbody>
				{
					usedBoosterTypes.map((type: string) => {
						const affectedPlayer = boostedPlayers.filter((p: any) => p?.booster?.toLowerCase() == type.toLowerCase())[0];
						const faceUrl = `${props.assetsCdn}/players/${affectedPlayer?.id}.png`;
						return (
							<tr key={type}>
								<td><Icon component={BoosterIcons[type]} style={{fontSize: 20}} /></td>
								<td>{t(`boosters.${type}`)}</td>
								<td width={50}>
									<PlayerBg 
										src={faceUrl} 
										onError={({currentTarget}: any) => currentTarget.src = `${props.assetsCdn}/players/dummy.png`} 
									/>
								</td>
								<td>
									{affectedPlayer?.short}
								</td>
								<td>
									{affectedPlayer?.points || 0}
								</td>
							</tr>
						);
					})
				}
			</tbody>
		</BoosterStatsTable>
	);
};