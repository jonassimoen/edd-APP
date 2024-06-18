import { notification } from "antd";
import { FootballPositionIds } from "./constants";
import { ReactNode } from "react";
import React from "react";
import { toast } from "react-toastify";
import { UserOutlined, DownloadOutlined, SyncOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { TFunction } from "i18next";
import dayjs from "dayjs";
import { LiveIcon } from "@/components/UI/AnimatedIcon/AnimatedIcon";
import { Link } from "react-router-dom";
import { Button } from "@/components/UI/Button/Button";
import { theme } from "@/styles/theme";

declare type RowToPos = {
	rowNumber: number,
	positionId: number,
}

export const startingListToPositionsList = (starting: any, rowConfig: number[], rowToPosList?: RowToPos[]) => {
	const res: any[] = [];

	if (!rowToPosList) {
		const GK = starting.filter((player: any) => player && player.positionId === FootballPositionIds.Goalkeeper);
		const DF = starting.filter((player: any) => player && player.positionId === FootballPositionIds.Defender);
		const MD = starting.filter((player: any) => player && player.positionId === FootballPositionIds.Midfielder);
		const FW = starting.filter((player: any) => player && player.positionId === FootballPositionIds.Forward);

		res.push(GK, DF, MD, FW);
	} else {
		const rows = rowConfig.length;

		for (let row = 0; row < rows; row++) {
			const rowsPosMapList = rowToPosList && rowToPosList.length ? rowToPosList : [];
			const rowPos = rowsPosMapList.find((item: RowToPos) => item.rowNumber === (row + 1));
			const totalPicked: number = res
				.map(items => items.length)
				.reduce((acc, item) => acc + item, 0);

			const lastPickedIdx: number = totalPicked;
			const sliceFrom: number = row === 0 ? 0 : lastPickedIdx;
			const sliceTo: number = row === 0 ? rowConfig[row] : lastPickedIdx + rowConfig[row];

			const items: any[] = starting
				.slice(sliceFrom, sliceTo)
				.map((item: any) => {
					if (rowPos) {
						const posObj = { positionId: rowPos.positionId };
						return item === null ? posObj : { ...item, ...posObj };
					} else {
						return item;
					}
				});
			res.push(items);
		}
	}
	return res;
};



export const getPlayerPositionHexColor = (player: any, theme: any) => {
	const defaultHex = "#000";

	if (!player) {
		return defaultHex;
	}

	if (player.positionId === 1) {
		return theme.positionGk;
	} else if (player.positionId === 2) {
		return theme.positionDf;
	} else if (player.positionId === 3) {
		return theme.positionMf;
	} else if (player.positionId === 4) {
		return theme.positionFw;
	} else {
		return defaultHex;
	}
};


export const selectionPlayerSellValue = (player: any) => {
	const current = Object.assign({}, player);
	const currentValue = current.value;
	const selectionValue = player.selection.value;
	const diff = currentValue - selectionValue;
	let playerSellValue = null;

	if (selectionValue >= currentValue) {
		playerSellValue = currentValue;
	} else {
		// const profit = roundDownDecimal()
		const profit = diff / 2;
		playerSellValue = selectionValue + profit;
	}
	return parseFloat((playerSellValue).toFixed(2));
};

export const roundNextHalf = (number: number) => {
	const integerPart = Math.floor(number);
	const decimalPart = number - integerPart;

	if (decimalPart === 0) {
		return integerPart;
	} else if (decimalPart <= 0.5) {
		return integerPart + 0.5;
	} else {
		return integerPart + 1;
	}
};

export const firstLetterUppercased = (string: string) => {
	return string.charAt(0).toUpperCase();
};

type NotificationConfig = {
	title: string
	icon?: ReactNode
	message?: string
	readMore?: string
	onClick?: () => any
}

export const openErrorNotification = (config: NotificationConfig) => {
	toast.error(({ closeToast }) => (
		<React.Fragment>
			<b>{config.title}</b>
			{/* <br />{config.message} */}
		</React.Fragment>
	));
};
export const openSuccessNotification = (config: NotificationConfig) => {
	toast.success(({ closeToast }) => (
		<React.Fragment>
			<b>{config.title}</b><br />
			{config.message}
		</React.Fragment>
	));
};
export const openInfoNotification = (config: NotificationConfig) => {
	toast.info(({ closeToast }) => 
		(<div onClick={config.onClick}>
			<b style={{color: theme.primaryContrast}}>{config.title.toUpperCase()}</b><br />
			{config.message}<br /><br />
			<b style={{color: theme.primaryColor}}>{config.readMore}</b>
		</div>), {
		position: "top-center",
		autoClose: 500000,
	});
};

export const statusToIconColor = (status: string) => {
	switch (status) {
	case "PLAYED":
		return { color: "purple", icon: <UserOutlined /> };
		break;
	case "STATS_IMPORTED":
		return { color: "warning", icon: <DownloadOutlined /> };
		break;
	case "STATS_UPDATED":
		return { color: "processing", icon: <SyncOutlined spin /> };
		break;
	case "VALIDATED":
		return { color: "success", icon: <CheckCircleOutlined /> };
		break;
	default:
		return { color: "error", icon: <ClockCircleOutlined /> };
		break;
	}
};

const PlayerActionsPoints: any = {
	// General
	playedUpTo60Min: [0, 1, 1, 1, 1],
	playedMoreThan60Min: [0, 2, 2, 2, 2],
	motm: [0, 5, 5, 5, 5],
	// Important
	goals: [0, 7, 6, 5, 4],
	assists: [0, 3, 3, 3, 3],
	yellow: [0, -1, -1, -1, -1],
	red: [0, -3, -3, -3, -3],
	ownGoals: [0, -2, -2, -2, -2],
	// Goalkeeper
	savesPerTwo: [0, 1, 0, 0, 0],
	highClaimsPerTwo: [0, 1, 0, 0, 0],
	penaltySaved: [0, 5, 15, 15, 15],
	// Attacking
	shotsOffTargetPerTwo: [0, -1, -1, -1, -1],
	shotsOnTargetPerThree: [0, 1, 1, 1, 1],
	// Passing
	passAccMore85: [0, 2, 2, 3, 2],
	keyPassPerTwo: [0, 2, 2, 2, 2],
	accCrossesPerTwo: [0, 1, 1, 1, 1],
	// Defending
	clearancesPerFive: [0, 1, 1, 1, 1],
	blocksPerThree: [0, 1, 1, 1, 1],
	interceptionsPerFive: [0, 1, 1, 1, 1],
	tacklesPerThree: [0, 1, 1, 1, 1],
	lineClearances: [0, 3, 3, 3, 3],
	// Dribbles
	successDribblesPerThree: [0, 1, 1, 1, 1],
	pastDribblesPerThree: [0, -1, -1, -1, -1],
	// Fouls
	commitedFoulsPerThree: [0, -1, -1, -1, -1],
	drawnFoulsPerThree: [0, 1, 1, 1, 1],
	// Duels
	groundMoreDuelsWon: [0, 1, 1, 1, 1],
	aerialMoreDuelsWon: [0, 1, 1, 1, 1],
	// Magic
	errorLeadingShot: [0, -1, -1, -1, -1],
	errorLeadingGoal: [0, -3, -3, -3, -3],
	bigChancesCreated: [0, 2, 2, 2, 2],
	bigChancesMissed: [0, -2, -2, -2, -2],
	// Penalty's
	penaltyMissed: [0, -3, -3, -3, -3],
	penaltyWon: [0, 1, 1, 1, 1],
	penaltyCommited: [0, -2, -2, -2, -2],
	// Calculated
	cleanSheet: [0, 4, 4, 1, 0],
	concededTwo: [0, -2, -1, 0, 0],
	endWinnerSelections: [0, 1, 1, 1, 1],
};

export const getPointsOverviewList = (player: any, t: TFunction<"translation", undefined, "translation">) => {
	const pointsOverview: any = [];
	Object.keys(PlayerActionsPoints)
		.map((actionName: string) => {
			const actionPoints = PlayerActionsPoints[actionName][player.positionId];
			switch (actionName) {
			case "playedUpTo60Min": {
				const playedUpTo60Min = player.pointsOverview && player.pointsOverview.minutesPlayed && player.pointsOverview.minutesPlayed < 60;

				if (playedUpTo60Min) {
					pointsOverview.push({ action: t("player.playedUpTo60MinLabel"), quantity: 1, points: actionPoints });
				}
				break;
			}
			case "playedMoreThan60Min": {
				const playedMoreThan60Min = player.pointsOverview && player.pointsOverview.minutesPlayed && player.pointsOverview.minutesPlayed >= 60;

				if (playedMoreThan60Min) {
					pointsOverview.push({ action: t("player.playedMoreThan60MinLabel"), quantity: 1, points: actionPoints });
				}
				break;
			}
			case "motm" : {
				const motm = player.pointsOverview && player.pointsOverview.motm;
				if (motm) {
					pointsOverview.push({ action: t("player.motmLabel"), quantity: 1, points: motm * actionPoints });
				}
				break;
			}
			case "yellow": {
				const yellow = player.pointsOverview && player.pointsOverview.yellow || 0;
				if (yellow) {
					pointsOverview.push({ action: t("player.yellowLabel"), quantity: 1, points: actionPoints });
				}
				break;
			}
			case "red": {
				const red = player.pointsOverview && player.pointsOverview.red || 0;
				if (red) {
					pointsOverview.push({ action: t("player.redLabel"), quantity: 1, points: actionPoints });
				}
				break;
			}
			case "savesPerTwo": {
				const saves = player.pointsOverview && player.pointsOverview.saves;
				const savesPerTwo = Math.floor(saves / 2);

				if (savesPerTwo) {
					pointsOverview.push({ action: t("player.savedPerTwoLabel"), quantity: saves, points: savesPerTwo * actionPoints });
				}
				break;
			}
			case "highClaimsPerTwo": {
				const highClaims = player.pointsOverview && player.pointsOverview.highClaims;
				const highClaimsPerTwo = Math.floor(highClaims / 2);

				if (highClaimsPerTwo) {
					pointsOverview.push({ action: t("player.highClaimsPerTwo"), quantity: highClaims, points: highClaimsPerTwo * actionPoints });
				}
				break;
			}
			case "shotsOffTargetPerTwo": {
				const shotsOffTarget = player.pointsOverview && player.pointsOverview.shotsOffTarget;
				const shotsOffTargetPerTwo = Math.floor(shotsOffTarget / 2);

				if (shotsOffTargetPerTwo) {
					pointsOverview.push({ action: t("player.shotsOffTargetPerTwoLabel"), quantity: shotsOffTarget, points: shotsOffTargetPerTwo * actionPoints });
				}
				break;
			}
			case "shotsOnTargetPerThree": {
				const shotsOnTarget = player.pointsOverview && player.pointsOverview.shotsOnTarget;
				const shotsOnTargetPerThree = Math.floor(shotsOnTarget / 3);

				if (shotsOnTargetPerThree) {
					pointsOverview.push({ action: t("player.shotsOnTargetPerThreeLabel"), quantity: shotsOnTarget, points: shotsOnTargetPerThree * actionPoints });
				}
				break;
			}
			case "passAccMore85": {
				const passAcc = player.pointsOverview && player.pointsOverview.totalPasses && player.pointsOverview.totalPasses > 10 && player.pointsOverview.accuratePasses / player.pointsOverview.totalPasses || 0;
				if(passAcc && passAcc > 0.85) {
					pointsOverview.push({action: t("player.passAccOver85Label"), quantity: passAcc.toPrecision(2), points: passAcc > 0.85 ? actionPoints : 0});
				}
				break;
			}
			case "keyPassPerTwo": {
				const keyPasses = player.pointsOverview && player.pointsOverview.keyPasses || 0;
				const keyPassesPerTwo = Math.floor(keyPasses / 2);
				if(keyPassesPerTwo) {
					pointsOverview.push({action: t("player.keyPassesPerTwoLabel"), quantity: keyPasses, points: keyPassesPerTwo * actionPoints});
				}
				break;
			}
			case "accCrossesPerTwo": {
				const accCrosses = player.pointsOverview && player.pointsOverview.accurateCrosses || 0;
				const accCrossesPerTwo = Math.floor(accCrosses / 2);
				if(accCrossesPerTwo) {
					pointsOverview.push({action: t("player.accCrossesPerTwoLabel"), quantity: accCrosses, points: accCrossesPerTwo * actionPoints});
				}
				break;
			}
			case "clearancesPerFive": {
				const clearances = player.pointsOverview && player.pointsOverview.clearances || 0;
				const clearancesPerFive = Math.floor(clearances / 5);
				if(clearancesPerFive) {
					pointsOverview.push({action: t("player.clearancesPerFiveLabel"), quantity: clearances, points: clearancesPerFive * actionPoints});
				}
				break;
			}
			case "blocksPerThree": {
				const blocks = player.pointsOverview && player.pointsOverview.blocks || 0;
				const blocksPerThree = Math.floor(blocks / 3);
				if(blocksPerThree) {
					pointsOverview.push({action: t("player.blocksPerThreeLabel"), quantity: blocks, points: blocksPerThree * actionPoints});
				}
				break;
			}
			case "interceptionsPerFive": {
				const interceptions = player.pointsOverview && player.pointsOverview.interceptions || 0;
				const interceptionsPerFive = Math.floor(interceptions / 5);
				if(interceptionsPerFive) {
					pointsOverview.push({action: t("player.interceptionsPerFiveLabel"), quantity: interceptions, points: interceptionsPerFive * actionPoints});
				}
				break;
			}
			case "tacklesPerThree": {
				const tackles = player.pointsOverview && player.pointsOverview.tackles || 0;
				const tacklesPerThree = Math.floor(tackles / 3);
				if(tacklesPerThree) {
					pointsOverview.push({action: t("player.tacklesPerThreeLabel"), quantity: tackles, points: tacklesPerThree * actionPoints});
				}
				break;
			}
			case "successDribblesPerThree": {
				const dribblesSuccess = player.pointsOverview && player.pointsOverview.dribblesSuccess || 0;
				const successDribblesPerThree = Math.floor(dribblesSuccess / 3);
				if(successDribblesPerThree) {
					pointsOverview.push({action: t("player.dribblesSuccessPerThreeLabel"), quantity: dribblesSuccess, points: successDribblesPerThree * actionPoints});
				}
				break;
			}
			case "pastDribblesPerThree": {
				const pastDribbles = player.pointsOverview && player.pointsOverview.dribblesPast || 0;
				const pastDribblesPerThree = Math.floor(pastDribbles / 3);
				if(pastDribblesPerThree) {
					pointsOverview.push({action: t("player.pastDribblesPerThree"), quantity: pastDribbles, points: pastDribblesPerThree * actionPoints});
				}
				break;
			}
			case "commitedFoulsPerThree": {
				const commitedFouls = player.pointsOverview && player.pointsOverview.foulsCommited || 0;
				const commitedFoulsPerThree = Math.floor(commitedFouls / 3);
				if(commitedFoulsPerThree) {
					pointsOverview.push({action: t("player.commitedFoulsPerThreeLabel"), quantity: commitedFouls, points: commitedFoulsPerThree * actionPoints});
				}
				break;
			}
			case "drawnFoulsPerThree": {
				const drawnFouls = player.pointsOverview && player.pointsOverview.foulsDrawn || 0;
				const drawnFoulsPerThree = Math.floor(drawnFouls / 3);
				if(drawnFoulsPerThree) {
					pointsOverview.push({action: t("player.drawnFoulsPerThreeLabel"), quantity: drawnFouls, points: drawnFoulsPerThree * actionPoints});
				}
				break;
			}
			case "groundMoreDuelsWon": {
				const duelsDiff = player.pointsOverview && player.pointsOverview.duelsWon - (player.pointsOverview.duelsTotal - player.pointsOverview.duelsWon) || 0;
				if(duelsDiff && duelsDiff > 0) {
					pointsOverview.push({action: t("player.groundDuelsWonMoreThanLostLabel"), quantity: duelsDiff, points: duelsDiff ? actionPoints : 0});
				}
				break;
			}
			// // TEMPORARY NOT INCLUDED
			// // case "aerialMoreDuelsWon": {
			// // 	const duelsDiff = player.pointsOverview && player.pointsOverview.duelsWon - (player.pointsOverview.duelsTotal - player.pointsOverview.duelsWon) || 0;
			// // 	if(duelsDiff && duelsDiff > 0) {
			// // 		pointsOverview.push({action: t("player.groundDuelsWonMoreThanLostLabel"), quantity: duelsDiff, points: duelsDiff ? actionPoints : 0});
			// // 	}
			// // 	break;
			// // }
			case "cleanSheet": {
				const cleanSheet = (player.pointsOverview && !player.pointsOverview.red && player.pointsOverview.minutesPlayed >= 60 && player.pointsOverview.goalsAgainst == 0) || 0;
				if(cleanSheet && actionPoints) {
					pointsOverview.push({action: t("player.cleanSheetLabel"), quantity: 1, points: actionPoints});
				}
				break;
			}
			case "concededTwo": {
				const goalsAgainst = player.pointsOverview && player.pointsOverview.goalsAgainst || 0;
				const goalsAgainstPerTwo = Math.floor(goalsAgainst / 2);
				if(goalsAgainstPerTwo && actionPoints) {
					pointsOverview.push({action: t("player.concededTwoLabel"), quantity: goalsAgainst, points: goalsAgainstPerTwo * actionPoints});
				}
				break;
			}
			case "endWinnerSelections" : {
				const ews = player.pointsOverview && player.pointsOverview.endWinnerSelections;
				if (ews) {
					pointsOverview.push({ action: t("player.endWinnerSelectionsLabel"), quantity: ews, points: ews });
				}
				break;
			}

			default: {
				// When points = points_per_stat * stat_amount
				// This is the case for the following stats
				//	GOALS - ASSISTS - OWN GOALS - PEN. SAVED - LINE CLEARANCE - ERR. SHOT - ERR. GOAL - BC MISSED - BC CREATED - PEN. MISSED - PEN. WON - PEN. COMMITED
				const amount = player.pointsOverview && player.pointsOverview[actionName] || 0;
				if (amount) {
					pointsOverview.push({ action: t(`player.${actionName}Label`), quantity: amount, points: amount * actionPoints });
				}
			}
			}
		});
	return pointsOverview;
};

export const calendarLiveScoreComponent = (match: Match, includeDay?: boolean) => {
	const matchDate = dayjs(match.date);
	let text = null;
	let icon = null;
	let className = "";
	if(dayjs().isBefore(matchDate)) {
		text = includeDay ? matchDate.format("DD MMM[\n]HH:mm") : matchDate.format("HH:mm");
	} else {
		if(dayjs().isBefore(matchDate.add(2, "hour"))) {
			className = "live";
			text = "live";
			icon = <LiveIcon />;
		} else {
			className = match.status.toLowerCase().replace("_","");
			text = `${match.homeScore} - ${match.awayScore}`;
		}
	}

	
	return <b className={`score ${className}`}>{icon?icon:null} {text}</b>;
};