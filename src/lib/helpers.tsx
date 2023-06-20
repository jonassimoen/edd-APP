import { notification } from "antd";
import { FootballPositionIds } from "./constants";
import { ReactNode } from "react";
import React from "react";
import { toast } from "react-toastify";

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
	const defaultHex = '#000';

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
}

export const firstLetterUppercased = (string: string) => {
	return string.charAt(0).toUpperCase();
}

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
}
export const openSuccessNotification = (config: NotificationConfig) => {
	toast.success(({ closeToast }) => (
		<React.Fragment>
			<b>{config.title}</b><br />
			{config.message}
		</React.Fragment>
	));
}