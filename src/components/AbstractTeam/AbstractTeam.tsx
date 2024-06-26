import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FootballPicker } from "@/lib/football-picker";
import { FootballMaxPositionsPicks, FootballPositionIds } from "@/lib/constants";
import Decimal from "decimal.js";
import { useAddTeamMutation, useEditTeamMutation, useSubmitTransfersMutation, useUpdateTeamSelectionMutation } from "@/services/teamsApi";
import { openErrorNotification, openSuccessNotification } from "@/lib/helpers";
import { t } from "i18next";
import { useLazyGetTeamsQuery } from "@/services/usersApi";
import { useGetDeadlineInfoQuery } from "@/services/weeksApi";
import { pick } from "lodash";
import React from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

declare type AbstractTeamProps = {
	matches?: any;
	user?: any;
}

declare type Options = {
	type?: string
	mode?: string
	usevalidatorOnPick?: boolean
}

const defaultLineUp: { id?: number, positionId: number }[] = [
	{ id: null, positionId: 1 },
	{ id: null, positionId: 2 }, { id: null, positionId: 2 }, { id: null, positionId: 2 }, { id: null, positionId: 2 },
	{ id: null, positionId: 3 }, { id: null, positionId: 3 }, { id: null, positionId: 3 }, { id: null, positionId: 3 },
	{ id: null, positionId: 4 }, { id: null, positionId: 4 }
];
const defaultBench: { id?: number, positionId: number }[] = [
	{ id: null, positionId: 1 },
	{ id: null, positionId: 2 },
	{ id: null, positionId: 3 },
	{ id: null, positionId: 4 }
];

declare type AbstractTeamState = {
	starting: any[]
	bench: any[]
	budget: number
	captainId: number | undefined
	viceCaptainId: number | undefined
	teamName: string
	teamId: number
	initialTeamName: string
	teamNameChanged: boolean
	swapPlayerId: number | null
	swapPlayer: Player | null
	swappedFrom: string | null
	initialStarting: any[]
	initialBench: any[]
	initialBudget: number
	activePositionFilter: number
	teamUser?: any
	validator?: any
	visibleWeekId: number | null
	initializedExternally: boolean
	boosters: Boosters
	deadlineWeekTransfers: Transfer[]
	draftTransfers: Transfer[]
	pastTransfers: Transfer[]
	teamPointsInfo: any
}

function playersToValidatorFormat(players: any) {
	return players.filter((player: Player) => player && player.id);
}

const getInitializedList = (size: number, forStarting?: boolean) => {
	if (size) {
		return forStarting ? [].concat(defaultLineUp as any) : [].concat(defaultBench as any);
	} else {
		const list = [];
		for (let item = 0; item < size; item++) {
			list.push(null);
		}
		return list;
	}
};

export const AbstractTeam = (Component: (props: AbstractTeamType) => any, props: AbstractTeamProps, options?: Options,) => {
	const [addTeam, {isLoading: savingTeamPending, error: savingTeamError}] = useAddTeamMutation();
	const [editTeam, {isLoading: editTeamPending, error: editTeamError}] = useEditTeamMutation();
	const [updateTeamSelections, { isSuccess: updateTeamSelectionsSucces, data: updateTeamSelectionsResult, isLoading: updateTeamSelectionsLoading }] = useUpdateTeamSelectionMutation();
	const { data: deadlineInfo, isSuccess: deadlineInfoSuccess, isLoading: deadlineInfoLoading, isError: deadlineInfoError } = useGetDeadlineInfoQuery();
	const [submitTransfers, { isSuccess: submitTransfersSucces, data: submitTransfersResult, isLoading: submitTransfersLoading }] = useSubmitTransfersMutation();

	const application = useSelector((state: StoreState) => state.application);

	const [state, setState] = useState<AbstractTeamState>({
		validator: FootballPicker(FootballMaxPositionsPicks, FootballPositionIds),
		initializedExternally: false,

		starting: getInitializedList(application.competition.lineupSize, true),
		bench: getInitializedList(application.competition.benchSize),
		budget: application.competition.budget,

		captainId: undefined,
		viceCaptainId: undefined,
		teamName: "",
		teamId: undefined,
		initialTeamName: "",
		teamNameChanged: false,
		swapPlayerId: null,
		swapPlayer: null,
		swappedFrom: null,
		visibleWeekId: deadlineInfoSuccess ? (options && options.mode === "points" ? deadlineInfo.deadlineInfo.displayWeek : deadlineInfo.deadlineInfo.deadlineWeek) : 0,
		boosters: {},
		teamPointsInfo: {
			generalPoints: null,
			generalRank: null,
			visibleWeekPoints: null,
			visibleWeekRank: null,
			weekPointsConfirmed: false,
			provisionalPoints: null,
			weekWinnerPoints: null
		},

		deadlineWeekTransfers: [],
		draftTransfers: [],
		pastTransfers: [],

		initialStarting: getInitializedList(application.competition.lineupSize, true),
		initialBench: getInitializedList(application.competition.benchSize),
		initialBudget: application.competition.budget,

		teamUser: undefined,
		activePositionFilter: -1,
	});

	useEffect(() => {
		setState((state: any) => ({ ...state, visibleWeekId: (options && options.mode === "points" ? deadlineInfo?.deadlineInfo.displayWeek : deadlineInfo?.deadlineInfo.deadlineWeek) }));
	}, [deadlineInfo]);

	useEffect(() => {
		if(editTeamError || savingTeamError) {
			openErrorNotification({
				title: t("team.saveTeamFailed"),
				message: (((editTeamError || savingTeamError) as FetchBaseQueryError).data as any).message
			});
		}
	}, [editTeamError, savingTeamError]);

	const setStarting = (starting: any[]) => {
		setState({ ...state, starting });
	};
	const setBench = (bench: any[]) => {
		setState({ ...state, bench });
	};
	const setTeamName = (teamName: string) => {
		setState({ ...state, teamName });
	};
	const resetTeamName = () => {
		setState({ ...state, teamName: state.initialTeamName, teamNameChanged: false });
	};
	const updateTeamName = (teamId: number) => {
		setState({ ...state, teamNameChanged: false, initialTeamName: state.teamName });

		// updateTeamName(teamId, this.state.teamName); 
		// POST team/:teamid/name
	};
	const setCaptainId = (captainId: number) => {
		setState({ ...state, captainId });
	};

	const setBudget = (budget: number) => {
		setState({ ...state, budget });
	};

	const initTeamState = (
		starting: any[],
		bench: any[],
		teamName: string,
		teamId: number,
		captainId: number,
		budget: number,
		leagues?: any[] | undefined,
		visibleWeekId?: number | undefined,
		teamPointsInfo?: any,
		rawTransfers?: any[] | undefined,
		deadlineWeekTransfers?: any[] | undefined,
		pastTransfers?: any[] | undefined,
		viceCaptainId?: number,
		boosters?: Boosters,
		isTeamOwner?: boolean,
		teamUser?: any
	) => {
		const startingPlayersValidatorFormat = playersToValidatorFormat(starting);
		const benchPlayersValidatorFormat = playersToValidatorFormat(bench);

		state.validator.set(startingPlayersValidatorFormat, benchPlayersValidatorFormat);
		setState({
			...state,
			starting,
			bench,
			budget,
			teamName,
			teamId,
			captainId,
			viceCaptainId,
			initialTeamName: teamName,
			teamUser: teamUser || null,
			initialBench: bench,
			initialStarting: starting,
			initialBudget: budget,
			initializedExternally: true,
			visibleWeekId: visibleWeekId | state.visibleWeekId,
			boosters: boosters || {},
			deadlineWeekTransfers: deadlineWeekTransfers || [],
			draftTransfers: [],
			pastTransfers: pastTransfers || [],
			teamPointsInfo: teamPointsInfo || state.teamPointsInfo,
		});
	};

	const pickPlayer = (player: Player, taxForPicking?: boolean) => {
		const nilPlayer: any = null;

		const alreadyInTeam: Player = [].concat(state.initialStarting, state.initialBench).find((item: Player) => item && player && item.id === player.id);

		let pValue = player && player.value;
		if (alreadyInTeam) {
			pValue = alreadyInTeam.value;
		}

		const startingSpotEmpty = state.starting.find((p: Player) => (p && !p.id) && (p && p.positionId === player.positionId));
		const benchSpotEmpty = state.bench.find((p: Player) => (p && !p.id) && (p && p.positionId === player.positionId));

		if (startingSpotEmpty) {
			let firstIndex: any = null;
			state.starting.forEach(
				(p: any, idx: number) => {
					if (!firstIndex && (!p || (p && !p.id && p.positionId === player.positionId))) {
						firstIndex = idx;
					}
				}
			);

			const starting = state.starting.map((p: Player | null, pIdx: number) => {
				if (pIdx === firstIndex) {
					return alreadyInTeam ? alreadyInTeam : player;
				} else {
					return p;
				}
			});

			const budget = parseFloat(new Decimal(state.budget.toFixed(2)).minus(pValue.toFixed(2)).toString());

			const captains = {
				captainId: state.captainId,
				viceCaptainId: state.viceCaptainId
			};
			if (!state.captainId && player.positionId !== 0) {
				captains.captainId = player.id;
			}
			else if (!state.viceCaptainId && player.positionId !== 0) {
				captains.viceCaptainId = player.id;
			}
			setState({
				...state,
				starting,
				budget,
				captainId: captains.captainId,
				viceCaptainId: captains.viceCaptainId,
			});
		}

		else if (benchSpotEmpty) {
			let firstIndex: any = null;
			state.bench.forEach(
				(p: any, idx: number) => {
					if (!firstIndex && (!p || (p && !p.id && p.positionId === player.positionId))) {
						firstIndex = idx;
					}
				}
			);

			const bench = state.bench.map((p: Player | null, pIdx: number) => {
				if (pIdx === firstIndex) {
					return alreadyInTeam ? alreadyInTeam : player;
				} else {
					return p;
				}
			});

			const budget = parseFloat(new Decimal(state.budget.toFixed(2)).minus(pValue.toFixed(2)).toString());

			setState({ ...state, bench, budget });
		}
	};

	const removeStartingPlayer = (player: Player) => {
		const newStarting = state.starting
			.map((startingPlayer: Player | null) => {
				if (startingPlayer && startingPlayer.id && startingPlayer.id === player.id) {
					return { id: null, positionId: player.positionId };
				} else {
					return startingPlayer;
				}
			});

		const budget = parseFloat(new Decimal(state.budget.toFixed(2)).plus(player.value.toFixed(2)).toString());

		const captainId = state.captainId === player.id ? undefined : state.captainId;
		const viceCaptainId = state.viceCaptainId === player.id ? undefined : state.captainId;

		const removeResult = state.validator.remove(player);

		setState({ ...state, starting: newStarting, budget, captainId, viceCaptainId });
	};

	const removeBenchPlayer = (player: Player) => {
		const newBench = state.bench
			.map((benchPlayer: Player | null) => {
				if (benchPlayer && benchPlayer.id && benchPlayer.id === player.id) {
					return { id: null, positionId: player.positionId };
				} else {
					return benchPlayer;
				}
			});

		const budget = parseFloat(new Decimal(state.budget.toFixed(2))
			.plus(player.value.toFixed(2))
			.toString());

		const removeResult = state.validator.remove(player);

		setState({ ...state, bench: newBench, budget });
	};

	const removePlayer = (player: Player) => {
		const inStarting = state.starting.find((startingPlayer: Player | null) => !!(startingPlayer && startingPlayer.id === player.id));
		const inBench = state.bench.find((benchPlayer: Player | null) => !!(benchPlayer && benchPlayer.id === player.id));

		if (inStarting) {
			removeStartingPlayer(player);
		}
		if (inBench) {
			removeBenchPlayer(player);
		}
	};

	const onCaptainSelect = (player: Player, captainFirstInList?: boolean) => {
		const playerId: number = player.id;
		let playerIdx: number | null = null;

		state.starting
			.forEach((startingPlayer: Player | null, idx: number) => {
				if (startingPlayer && startingPlayer.id === playerId) {
					playerIdx = idx;
				}
			});

		const currentCaptain = state.starting
			.find((startingPlayer: any, idx: number) => idx === 0);

		const nextCaptain = state.starting
			.find((startingPlayer: any, idx: number) => startingPlayer && startingPlayer.id === playerId);

		if (playerIdx !== 0 && captainFirstInList) {
			const starting = state.starting
				.map((startingPlayer: any, idx: number) => {
					if (idx === 0) {
						return nextCaptain;
					} else if (idx === playerIdx) {
						return currentCaptain;
					} else {
						return startingPlayer;
					}
				});
			setState({ ...state, captainId: playerId, starting });
		} else {
			setState({ ...state, captainId: playerId, viceCaptainId: (state.viceCaptainId === playerId ? undefined : state.viceCaptainId) });
		}
	};

	const onViceCaptainSelect = (player: Player) => {
		const playerId: number = player.id;
		setState({ ...state, viceCaptainId: playerId, captainId: (state.captainId === playerId ? undefined : state.captainId) });
	};

	const onTeamNameChange = (e: any) => {
		setState({ ...state, teamName: e.target.value, teamNameChanged: e.target.value !== state.initialTeamName });
	};

	const validateTeam = (showNotifications?: boolean) => {
		const valid = true;
		return valid;
	};

	const getStartingAndBenchIdsWithCaptainCheck = () => {
		let starting: any[] = [].concat(state.starting as any);
		let bench: any[] = [].concat(state.bench as any);

		const captainInBench = bench.find((benchPlayer: Player, idx: number) => benchPlayer.id === state.captainId);
		const viceCaptainInBench = bench.find((benchPlayer: Player, idx: number) => benchPlayer.id === state.viceCaptainId);

		if (captainInBench) {
			const possibleStartingPlayerReplacement: any[] = starting
				.filter((startingPlayer: any) => startingPlayer.positionId === captainInBench.positionId && startingPlayer.id !== state.viceCaptainId);
			const replacementPlayer = possibleStartingPlayerReplacement[possibleStartingPlayerReplacement.length - 1];
			starting = starting.map((startingPlayer: Player, idx: number) => replacementPlayer && startingPlayer.id === replacementPlayer.id ? captainInBench : startingPlayer);
			bench = bench.map((benchPlayer: Player, idx: number) => replacementPlayer && benchPlayer.id === captainInBench.id ? replacementPlayer : benchPlayer);
		}

		if (viceCaptainInBench) {
			const possibleStartingPlayerReplacement: any[] = starting
				.filter((startingPlayer: any) => startingPlayer.positionId === viceCaptainInBench.positionId && startingPlayer.id !== state.captainId);
			const replacementPlayer = possibleStartingPlayerReplacement[possibleStartingPlayerReplacement.length - 1];
			starting = starting.map((startingPlayer: Player, idx: number) => replacementPlayer && startingPlayer.id === replacementPlayer.id ? viceCaptainInBench : startingPlayer);
			bench = bench.map((benchPlayer: Player, idx: number) => replacementPlayer && benchPlayer.id === viceCaptainInBench.id ? replacementPlayer : benchPlayer);
		}

		return { starting, bench };
	};

	const onTeamSave = () => {
		const valid = validateTeam(true);

		if (valid) {
			const { starting, bench } = getStartingAndBenchIdsWithCaptainCheck();
			const startingIds = starting.map(player => player && player.id);
			const benchIds = bench.map(player => player && player.id);

			setState({ ...state });

			// create function: /team/add
			return addTeam({
				starting: starting.map((p: any) => p.id),
				bench: bench.map((p: any) => p.id),
				teamName: state.teamName,
				captainId: state.captainId,
				viceCaptainId: state.viceCaptainId
			})
				.unwrap()
				.then((res) => {openSuccessNotification({ title: t("team.save.success") }); return res; })
				.catch((err) => openErrorNotification({ title: t("team.save.failed") }));
		} else {
			openErrorNotification({
				title: t("team.invalidTeamTitle"),
				message: t("team.invalidTeamDescription")
			});
		}
	};

	const onTeamReset = (team: any) => {
		const valid = validateTeam(true);

		if (valid) {
			setState({ ...state });

			// create function: POST /team/:id
		} else {
			return Promise.reject();
		}
	};

	const onTeamEdit = () => {
		const valid = validateTeam(true);

		if (valid) {
			const { starting, bench } = getStartingAndBenchIdsWithCaptainCheck();
			// create function: POST /team/:id
			return editTeam({
				teamId: state.teamId,
				starting: starting.map((p: any) => p.id),
				bench: bench.map((p: any) => p.id),
				teamName: state.teamName,
				captainId: state.captainId,
				viceCaptainId: state.viceCaptainId
			})
				.unwrap()
				.then((res) => openSuccessNotification({ title: t("team.edit.success") }))
				.catch((err) => openErrorNotification({ title: t("team.edit.failed") }));
		} else {
			openErrorNotification({
				title: t("team.invalidTeamTitle"),
				message: t("team.invalidTeamDescription")
			});
		}
	};

	const onTeamSelectionsUpdate = (teamId: number, weekId: number) => {
		const isValid = validateTeam(true);

		if (isValid) {
			const startingIds = state.starting.map((player: any) => player.id);
			const benchIds = state.bench.map((player: any) => player.id);

			updateTeamSelections({
				teamId,
				starting: startingIds,
				bench: benchIds,
				captainId: state.captainId,
				viceCaptainId: state.viceCaptainId,
				teamName: state.teamName,
			})
				.unwrap()
				.then((res) => openSuccessNotification({ title: res.msg }))
				.catch((err) => openErrorNotification({ title: t("team.updateSelection.failed") }));
		}
	};

	const onDayChange = (directionNext: boolean) => {
		if (directionNext) {
			const upcomingWeekExists = deadlineInfo.weeks.find((week: Week) => !!(state.visibleWeekId && (week.id > state.visibleWeekId)));
			if (upcomingWeekExists && state.visibleWeekId) {
				setState({ ...state, visibleWeekId: state.visibleWeekId + 1 });
			}
		} else {
			const previousWeekExists = deadlineInfo.weeks.find((week: Week) => !!(state.visibleWeekId && (week.id < state.visibleWeekId)));
			
			if (previousWeekExists && state.visibleWeekId) {
				setState({ ...state, visibleWeekId: state.visibleWeekId - 1 });
			}
		}
	};

	const onPlayerSwap = (player: Player) => {
		if (player && player.id === state.swapPlayerId) {
			const pickBackResult = state.validator.pick(player);
			setState({ ...state, swapPlayerId: null, swappedFrom: null, swapPlayer: null });
		}
		else if (state.swapPlayerId) {
			const previousSwapFromLineup = state.starting.find((startingPlayer: any) => startingPlayer && startingPlayer.id === state.swapPlayerId);
			const previousSwapFromBench = state.bench.find((benchPlayer: any) => benchPlayer && benchPlayer.id === state.swapPlayerId);

			let starting = null;
			let bench = null;
			const captainId: number = null;

			if (previousSwapFromLineup) {
				starting = state.starting
					.map((startingPlayer: any) => startingPlayer && (startingPlayer.id === state.swapPlayerId) ?
						Object.assign({}, player, { inStarting: true }) : startingPlayer);
				bench = state.bench
					.map((benchPlayer: any) => benchPlayer && (benchPlayer.id === player.id) ?
						Object.assign({}, previousSwapFromLineup, { inStarting: false }) : benchPlayer);
			} else {
				const secondSwapFromBench = state.bench
					.find((benchPlayer: any) => benchPlayer && benchPlayer.id === player.id);

				if (previousSwapFromBench && secondSwapFromBench) {
					starting = [].concat(state.starting as any);
					bench = state.bench
						.map((benchPlayer: any) => {
							if (benchPlayer.id === previousSwapFromBench.id) {
								return secondSwapFromBench;
							} else if (benchPlayer.id === secondSwapFromBench.id) {
								return previousSwapFromBench;
							} else {
								return benchPlayer;
							}
						});
				} else {
					starting = state.starting.map((startingPlayer: any) =>
						startingPlayer && (startingPlayer.id === player.id) ?
							Object.assign({}, previousSwapFromBench, { inStarting: true }) : startingPlayer
					);
					bench = state.bench.map((benchPlayer: any) =>
						benchPlayer && (benchPlayer.id === state.swapPlayerId) ?
							Object.assign({}, player, { inStarting: false }) : benchPlayer
					);
				}
			}

			const startingPlayersValidatorFormat = playersToValidatorFormat(starting);
			const benchPlayersValidatorFormat = playersToValidatorFormat(bench);

			state.validator.set(startingPlayersValidatorFormat, benchPlayersValidatorFormat);

			setState({
				...state, starting, bench, swappedFrom: null, swapPlayerId: null, swapPlayer: null, captainId: captainId || state.captainId
			});
		}
		else {
			const isLineupSwap = state.starting
				.find((startingPlayer: any) => startingPlayer && player && startingPlayer.id === player.id);
			if (isLineupSwap) {
				const removeResult = state.validator.remove(player);
			}
			setState({ ...state, swapPlayerId: player.id, swapPlayer: player, swappedFrom: isLineupSwap ? "starting" : "bench" });
		}
	};

	const isPickable = (player: Player, taxForPicking?: boolean, isTransferPick?: boolean) => {
		if(!player.value) {
			return false;
		}
		const notInStarting = !state.starting.find(startingPlayer => startingPlayer && startingPlayer.id && startingPlayer.id === player.id);
		const notInBench = !state.bench.find(benchPlayer => benchPlayer && benchPlayer.id && benchPlayer.id === player.id);
		const affordable = player.value <= state.budget;

		const emptySpotInTeam =
			!!state.starting.find(startingPlayer => !startingPlayer.id) ||
			!!state.bench.find(benchPlayer => !benchPlayer.id);

		const pickerSoFarFromSameClub =
			state.starting.filter(startingPlayer => startingPlayer && startingPlayer.clubId === player.clubId).length +
			state.bench.filter(benchPlayer => benchPlayer && benchPlayer.clubId === player.clubId).length;

		const underClubLimit = pickerSoFarFromSameClub < deadlineInfo.deadlineInfo.sC;

		const playerPositionMaxPicks = [].concat(state.starting as any, state.bench as any)
			.filter((p: Player) => p.positionId === player.positionId).length;
		const playerPositionAlreadyPicked = [].concat(state.starting as any, state.bench as any)
			.filter((p: Player) => p.positionId === player.positionId && p.id).length;

		const validFootballLineup = playerPositionAlreadyPicked < playerPositionMaxPicks;

		return notInStarting && notInBench && affordable && emptySpotInTeam && underClubLimit && validFootballLineup;
	};

	const isSwapable = (player: Player) => {
		if (state.swapPlayerId && state.swapPlayer) {
			const swapInitInLineup = state.starting.find(
				(startingPlayer: any) => startingPlayer && startingPlayer.id === state.swapPlayerId
			);

			if (swapInitInLineup) {
				const canPick = state.validator.canPick(player, true);
				return (canPick); // TODO: upcomingMatches of player => check date is after now
			} else {
				const benchSwappedPlayer = state.bench.find((benchPlayer: any) => benchPlayer && benchPlayer.id === state.swapPlayerId);
				const isBenchedGoalie = !player.inStarting && player.positionId === 1;
				const swappedPlayerGoalieAndCurrentIteratedPlayerInBench =
					!player.inStarting && benchSwappedPlayer && benchSwappedPlayer.positionId === 1 && player.id !== state.swapPlayerId;
				if (isBenchedGoalie || swappedPlayerGoalieAndCurrentIteratedPlayerInBench) {
					return false;
				}

				if (player && player.id) {
					state.validator.remove(player);
					const canPick = state.validator.canPick({ id: state.swapPlayer.id, positionId: state.swapPlayer.positionId }, true);
					state.validator.pick(player);

					return canPick;
				} else {
					return false;
				}
			}
		} else {
			return true;
		}
	};

	const loadAllMatches = () => {
		// load matches if not fetched yet
	};

	const onTransferPlayerOut = (player: Player, extra?: boolean) => {
		removePlayer(player);
		const draftTransfers = state.draftTransfers
			.concat([{
				inId: null,
				outId: player.id,
				outPlayer: player,
				extra,
				weekId: deadlineInfo.deadlineInfo.deadlineWeek
			}]);
		setState(previousState => ({ ...previousState, draftTransfers }));
	};

	const onTransferPlayerIn = (player: Player) => {
		const draftTransfers = ([] as Transfer[]).concat(state.draftTransfers);
		for (let tfIdx = 0; tfIdx < draftTransfers.length; tfIdx++) {
			if (!draftTransfers[tfIdx].inId && draftTransfers[tfIdx].outPlayer?.positionId === player.positionId) {
				draftTransfers[tfIdx].inId = player.id;
				draftTransfers[tfIdx].inPlayer = player;
				break;
			}
		}
		setState(previousState => ({ ...previousState, draftTransfers }));
	};

	const onDraftTransfersClear = () => {
		const startingPlayersValidatorFormat = playersToValidatorFormat(state.initialStarting);
		const benchPlayersValidatorFormat = playersToValidatorFormat(state.initialBench);
		state.validator.set(startingPlayersValidatorFormat, benchPlayersValidatorFormat);

		setState({
			...state,
			draftTransfers: [],
			starting: state.initialStarting,
			bench: state.initialBench,
			budget: state.initialBudget
		});
	};

	const onTransfersSubmit = (teamId: number) => {
		const transfers = state.draftTransfers
			.map((transfer: Transfer) => pick(transfer, ["inId", "outId"]));
		submitTransfers({ teamId, transfers })
			.unwrap()
			.then((res) => openSuccessNotification({ title: t("team.transfers.success") }))
			.catch((err) => openErrorNotification({ title: t("team.transfers.failed") }));
	};

	const onTransfersReset = (teamId: number) => {
		// return teamsActions.resetTransfers(teamId)
		// TODO:  POST team/transfers/:teamid/reset
	};

	const reloadUserTeams = () => {
		// props.fetchUserTeamsAndLeagues(props.application.competition.competitionFeed);
		// TODO:  GET teams
	};

	const setActivePositionFilter = (positionId: number) => {
		setState({ ...state, activePositionFilter: positionId });
	};

	return (
		<React.Fragment>
			{deadlineInfoSuccess ?
				<Component
					setStarting={setStarting}
					setBench={setBench}
					setBudget={setBudget}
					setTeamName={setTeamName}
					setCaptainId={setCaptainId}
					setActivePositionFilter={setActivePositionFilter}
					isPickAble={isPickable}
					isSwapAble={isSwapable}
					onTeamSave={onTeamSave}
					onTeamReset={onTeamReset}
					onTeamNameChange={onTeamNameChange}
					onCaptainSelect={onCaptainSelect}
					onViceCaptainSelect={onViceCaptainSelect}
					removeBenchPlayer={removeBenchPlayer}
					removeStartingPlayer={removeStartingPlayer}
					removePlayer={removePlayer}
					pickPlayer={pickPlayer}
					activePositionFilter={state.activePositionFilter}
					starting={state.starting}
					bench={state.bench}
					captainId={state.captainId}
					viceCaptainId={state.viceCaptainId}
					teamName={state.teamName}
					teamId={state.teamId}
					budget={state.budget}
					swapPlayerId={state.swapPlayerId}
					swappedFrom={state.swappedFrom}
					teamNameChanged={state.teamNameChanged}
					initTeamState={initTeamState}
					resetTeamName={resetTeamName}
					onTeamNameUpdate={updateTeamName}
					onTeamEdit={onTeamEdit}
					onTeamSelectionsUpdate={onTeamSelectionsUpdate}
					onPlayerSwap={onPlayerSwap}
					loadAllMatches={loadAllMatches}
					onTransferPlayerOut={onTransferPlayerOut}
					onDraftTransfersClear={onDraftTransfersClear}
					onTransferPlayerIn={onTransferPlayerIn}
					onTransfersSubmit={onTransfersSubmit}
					onTransfersReset={onTransfersReset}
					reloadUserTeams={reloadUserTeams}
					onDayChange={onDayChange}
					teamUser={state.teamUser}
					initializedExternally={state.initializedExternally}
					visibleWeekId={state.visibleWeekId}
					boosters={state.boosters}
					draftTransfers={state.draftTransfers}
					deadlineWeekTransfers={state.deadlineWeekTransfers}
					pastTransfers={state.pastTransfers}
					teamPointsInfo={state.teamPointsInfo}
					savingTeamPending={savingTeamPending || updateTeamSelectionsLoading || submitTransfersLoading || editTeamPending}
					{...props}
				/> : null}
		</React.Fragment>
	);
};