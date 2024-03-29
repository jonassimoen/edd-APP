import { notification } from "antd";
import { FootballPositionIds } from "./constants";
import { ReactNode } from "react";
import React from "react";
import { toast } from "react-toastify";
import { UserOutlined, DownloadOutlined, SyncOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { TFunction } from "i18next";
import dayjs from "dayjs";
import { LiveIcon } from "@/components/UI/AnimatedIcon/AnimatedIcon";

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
}

export const openErrorNotification = (config: NotificationConfig) => {
	toast.error(({ closeToast }) => (
		<React.Fragment>
			<b>{config.title}</b>
		</React.Fragment>
	));
};
export const openSuccessNotification = (config: NotificationConfig) => {
	toast.success(({ closeToast }) => (
		<React.Fragment>
			{config.icon} <b>{config.title}</b><br />
			{config.message}
		</React.Fragment>
	));
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
	playedUpTo60Min: { 1: 1, 2: 1, 3: 1, 4: 1 },
	playedMoreThan60Min: { 1: 2, 2: 2, 3: 2, 4: 2 },
	goals: { 1: 6, 2: 6, 3: 5, 4: 4 },
	assists: { 1: 3, 2: 3, 3: 3, 4: 3 },
	yellow: { 1: -1, 2: -1, 3: -1, 4: -1 },
	red: { 1: -3, 2: -3, 3: -3, 4: -3 },
	cleanSheet: { 1: 4, 2: 4, 3: 1, 4: 0 },
	ownGoal: { 1: -2, 2: -2, 3: -2, 4: -2 },
	penaltyMissed: { 1: -5, 2: -2, 3: -2, 4: -2 },
	penaltySaved: { 1: 5, 2: 15, 3: 15, 4: 15 },
	stoppedPenalty: { 1: 5, 2: 0, 3: 0, 4: 0 },
	savesPerTwo: { 1: 1, 2: 0, 3: 0, 4: 0 },
	motm: { 1: 5, 2: 5, 3: 5, 4: 5 },
	concededTwo: {1: -2, 2: -1, 3: 0, 4: 0},
	passAccMore85: {1: 2, 2: 3, 3: 4, 4: 3},
	keyPassPerTwo: {1: 5, 2: 3, 3: 3, 4: 3},
	successDribblesPerFive: {1: 5, 2: 3, 3: 3, 4: 3},
	moreDuelsWon: {1: 1, 2: 1, 3: 1, 4: 1},
	interceptionsPerSeven: {1: 2, 2: 2, 3: 2, 4: 2},
	commitedFoulsPerThree: {1:-2, 2:-2, 3: -2, 4: -2},
	bonus: {}
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
			case "savesPerTwo": {
				const saves = player.pointsOverview && player.pointsOverview.saves;
				const savesPerTwo = Math.floor(saves / 2);

				if (savesPerTwo) {
					pointsOverview.push({ action: t("player.savedPerTwoLabel"), quantity: saves, points: savesPerTwo * actionPoints });
				}
				break;
			}
			case "goals": {
				const goals = player.pointsOverview && player.pointsOverview.goals || 0;
				if (goals) {
					pointsOverview.push({ action: t("player.goalsLabel"), quantity: goals, points: goals * actionPoints });
				}
				break;
			}
			case "assists": {
				const assists = player.pointsOverview && player.pointsOverview.assists || 0;
				if (assists) {
					pointsOverview.push({ action: t("player.assistsLabel"), quantity: assists, points: assists * actionPoints });
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
			case "penaltyMissed" : {
				const penaltyMissed = player.pointsOverview && player.pointsOverview.penaltyMissed || 0;
				if (penaltyMissed) {
					pointsOverview.push({ action: t("player.penaltyMissedLabel"), quantity: penaltyMissed, points: penaltyMissed * actionPoints });
				}
				break;
			}
			case "penaltySaved" : {
				const penaltySaved = player.pointsOverview && player.pointsOverview.penaltySaved || 0;
				if (penaltySaved) {
					pointsOverview.push({ action: t("player.penaltySavedLabel"), quantity: penaltySaved, points: penaltySaved * actionPoints });
				}
				break;
			}
			case "stoppedPenalty" : {
				const stoppedPenalty = player.pointsOverview && player.pointsOverview.stoppedPenalty || 0;
				if (stoppedPenalty) {
					stoppedPenalty.push({ action: t("player.stoppedPenaltyLabel"), quantity: stoppedPenalty, points: stoppedPenalty * actionPoints });
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
			case "cleanSheet": {
				const cleanSheet = (player.pointsOverview && !player.pointsOverview.red && player.pointsOverview.minutesPlayed >= 60 && player.pointsOverview.goalsAgainst == 0) || 0;
				if(cleanSheet && actionPoints) {
					pointsOverview.push({action: t("player.cleanSheetLabel"), quantity: 1, points: actionPoints});
				}
				break;
			}
			case "passAccMore85": {
				const passAcc = player.pointsOverview && player.pointsOverview.totalPasses && player.pointsOverview.accuratePasses / player.pointsOverview.totalPasses || 0;
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
			case "successDribblesPerFive": {
				const dribblesSuccess = player.pointsOverview && player.pointsOverview.dribblesSuccess || 0;
				const dribblesSuccessPerTwo = Math.floor(dribblesSuccess / 5);
				if(dribblesSuccessPerTwo) {
					pointsOverview.push({action: t("player.dribblesSuccessPerTwoLabel"), quantity: dribblesSuccess, points: dribblesSuccessPerTwo * actionPoints});
				}
				break;
			}
			case "moreDuelsWon": {
				const duelsDiff = player.pointsOverview && player.pointsOverview.duelsWon - (player.pointsOverview.duelsTotal - player.pointsOverview.duelsWon) || 0;
				if(duelsDiff && duelsDiff > 0) {
					pointsOverview.push({action: t("player.duelsWonMoreThanLostLabel"), quantity: duelsDiff, points: duelsDiff ? actionPoints : 0});
				}
				break;
			}
			case "interceptionsPerSeven": {
				const interceptions = player.pointsOverview && player.pointsOverview.interceptions || 0;
				const interceptionsPerSeven = Math.floor(interceptions / 7);
				if(interceptionsPerSeven) {
					pointsOverview.push({action: t("player.interceptionsPerSevenLabel"), quantity: interceptions, points: interceptionsPerSeven * actionPoints});
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
			case "motm" : {
				const motm = player.pointsOverview && player.pointsOverview.motm;
				if (motm) {
					pointsOverview.push({ action: t("player.motmLabel"), quantity: 1, points: motm * actionPoints });
				}
				break;
			}

			default: {
				const amount = player.pointsOverview && player.pointsOverview[actionName] || 0;
				if (amount) {
					pointsOverview.push({ action: t(`player.${actionName}Label`), quantity: amount, points: amount * actionPoints });
				}
			}
			}
		});
	return pointsOverview;
};

export const calendarLiveScoreComponent = (match: Match) => {
	const matchDate = dayjs(match.date);
	let text = null;
	let icon = null;
	let className = "";
	if(dayjs().isBefore(matchDate)) {
		text = matchDate.format("HH:mm");
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