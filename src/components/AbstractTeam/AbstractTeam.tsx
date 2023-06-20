import { Component, useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { FootballPicker } from "@/lib/football-picker";
import { FootballMaxPositionsPicks, FootballPositionIds } from "@/lib/constants";
import Decimal from "decimal.js";
import { useTranslation } from "react-i18next";
import { pick } from "lodash";
import { useAddTeamMutation } from "@/services/teamsApi";

declare type AbstractTeamProps = {
	matches?: any;
	user?: any;
}

declare type Options = {
	type?: string
	mode?: string
	useFootballValidatorOnPick?: boolean
}

const defaultLineUp = [
	{ id: null, positionId: 1 },
	{ id: null, positionId: 2 }, { id: null, positionId: 2 }, { id: null, positionId: 2 }, { id: null, positionId: 2 },
	{ id: null, positionId: 3 }, { id: null, positionId: 3 }, { id: null, positionId: 3 }, { id: null, positionId: 3 },
	{ id: null, positionId: 4 }, { id: null, positionId: 4 }
];
const defaultBench = [
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
	teamNameInitial: string
	teamNameChanged: boolean
	swapPlayerId: number | null
	swapPlayer: Player | null
	swappedFrom: string | null
	deadlineWeekTransfer: Transfer[]
	savingTeamPending: boolean
	visibleWeekId: number | null
	// boosters: Transfer[]
	initialStarting: any[]
	initialBench: any[]
	initialBudget: number
	draftTransfers: Transfer[]
	activePositionFilter: number
	teamUser?: any
	footballValidator?: any
	useFootballValidatorOnPick: boolean
}

function playersToValidatorFormat(players: any) {
	return players
		.filter((player: Player) => player && player.id)
		.map((player: Player) => ({ Player: { id: player.id, positionId: player.positionId } }));
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
	const [addTeam] = useAddTeamMutation();
	const application = useSelector((state: StoreState.All) => state.application);
	const [state, setState] = useState<AbstractTeamState>({
		starting: getInitializedList(application.competition.lineupSize, true),
		// visibleWeekId: options && options.mode === 'points' ? matches.info.displayWeek : this.props.matches.info.deadlineWeek,
		visibleWeekId: 1,
		bench: getInitializedList(application.competition.benchSize),
		budget: application.competition.budget,
		captainId: undefined,
		viceCaptainId: undefined,
		teamName: "",
		teamNameInitial: "",
		teamNameChanged: false,
		swapPlayerId: null,
		swapPlayer: null,
		swappedFrom: null,
		deadlineWeekTransfer: [],
		draftTransfers: [],
		savingTeamPending: false,
		// boosters: [],
		initialStarting: getInitializedList(application.competition.lineupSize, true),
		initialBench: getInitializedList(application.competition.benchSize),
		initialBudget: application.competition.budget,
		teamUser: undefined,
		footballValidator: FootballPicker(FootballMaxPositionsPicks, FootballPositionIds),
		activePositionFilter: -1,
		useFootballValidatorOnPick: !!(options && options.useFootballValidatorOnPick),
	});

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
		setState({ ...state, teamName: state.teamNameInitial, teamNameChanged: false });
	};
	const updateTeamName = (teamId: number) => {
		setState({ ...state, teamNameChanged: false, teamNameInitial: state.teamName });

		// updateTeamName(teamId, this.state.teamName); 
		// POST team/:teamid/name
	};
	const setCaptainId = (captainId: number) => {
		setState({ ...state, captainId });
	};
	// const activateCacheChanges = () => {
	//     setState({ ...state, cacheChanges: true });
	// };
	const setBudget = (budget: number) => {
		setState({ ...state, budget });
	};

	const initTeamState = (
		starting: any[],
		bench: any[],
		teamName: string,
		budget: number,
		captainId?: number,
		viceCaptainId?: number,
		teamUser?: any,
		visibleWeekId?: number | undefined,
	) => {
		const startingPlayersValidatorFormat = playersToValidatorFormat(starting);
		const benchPlayersValidatorFormat = playersToValidatorFormat(bench);

		state.footballValidator.set(startingPlayersValidatorFormat, benchPlayersValidatorFormat);

		setState({
			...state,
			starting,
			bench,
			budget,
			teamName,
			captainId,
			viceCaptainId,
			teamNameInitial: teamName,
			teamUser: teamUser || null,
			initialBench: bench,
			initialStarting: starting,
			initialBudget: budget,
			draftTransfers: [],
			visibleWeekId: visibleWeekId || state.visibleWeekId,
		});
	};

	const pickPlayer = (player: Player) => {
		const emptyPlayer = null;

		const wasInStartingOrBench: any = []
			.concat(state.initialStarting as any, state.initialBench as any)
			.find((item: Player) => item && player && item.id === player.id);

		let startingHasEmptySpot = state.starting.find(teamPlayer => !teamPlayer) === emptyPlayer;
		let benchHasEmptySpot = state.starting.find(teamPlayer => !teamPlayer) === emptyPlayer;

		let playerValue = player.value;

		if (wasInStartingOrBench) {
			playerValue = wasInStartingOrBench.value;
		}
		if (state.useFootballValidatorOnPick) {
			const pickRes = state.footballValidator.pick({ Player: { id: player.id, positionId: player.positionId } });
			if (pickRes.result.Bench.includes(player.id)) {
				startingHasEmptySpot = false;
				benchHasEmptySpot = true;
			} else {
				startingHasEmptySpot = true;
				benchHasEmptySpot = false;
			}
		}

		if (!state.useFootballValidatorOnPick) {
			startingHasEmptySpot = state.starting
				.find(teamPlayer => (teamPlayer && !teamPlayer.id) && (teamPlayer && teamPlayer.positionId === player.positionId));

			benchHasEmptySpot = state.bench
				.find(benchPlayer => (benchPlayer && !benchPlayer.id) && (benchPlayer && benchPlayer.positionId === player.positionId));
		}

		if (startingHasEmptySpot) {
			let firstEmpyIndexInStarting: any = null;
			state.starting.forEach((teamPlayer: any, index: number) => {
				if (!firstEmpyIndexInStarting && (!teamPlayer || (teamPlayer && !teamPlayer.id && teamPlayer.positionId === player.positionId))) {
					firstEmpyIndexInStarting = index;
				}
			});

			const starting = state.starting.map((teamPlayer: Player | null, playerIndex: number) => {
				if (playerIndex === firstEmpyIndexInStarting) {
					return !wasInStartingOrBench ? player : wasInStartingOrBench;
				} else {
					return teamPlayer;
				}
			});

			const budget = parseFloat(new Decimal(state.budget.toFixed(2))
				.minus(playerValue.toFixed(2))
				.toString());

			if (!state.captainId) {
				setState({ ...state, captainId: player.id });
			} else if (!state.viceCaptainId) {
				setState({ ...state, viceCaptainId: player.id });
			}

			setState({ ...state, starting, budget });
		} else if (benchHasEmptySpot) {
			let firstEmpyIndexInBench: any = null;
			state.bench.forEach((teamPlayer: any, index: number) => {
				if (!firstEmpyIndexInBench && (!teamPlayer || (teamPlayer && !teamPlayer.id && teamPlayer.positionId === player.positionId))) {
					firstEmpyIndexInBench = index;
				}
			});

			const bench = state.bench.map((teamPlayer: Player | null, playerIndex: number) => {
				if (playerIndex === firstEmpyIndexInBench) {
					return !wasInStartingOrBench ? player : wasInStartingOrBench;
				} else {
					return teamPlayer;
				}
			});

			const budget = parseFloat(new Decimal(state.budget.toFixed(2))
				.minus(playerValue.toFixed(2))
				.toString());

			setState({ ...state, bench, budget });
		}
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

	const removeStartingPlayer = (player: Player) => {
		const newStarting = state.starting
			.map((startingPlayer: Player | null) => {
				if (startingPlayer && startingPlayer.id && startingPlayer.id === player.id) {
					return { id: null, positionId: player.positionId };
				} else {
					return startingPlayer;
				}
			});

		const budget = parseFloat(new Decimal(state.budget.toFixed(2))
			.plus(player.value.toFixed(2))
			.toString());

		const captainId = state.captainId === player.id ? undefined : state.captainId;
		const viceCaptainId = state.viceCaptainId === player.id ? undefined : state.captainId;

		const removeResult = state.footballValidator.remove({ Player: { id: player.id, positionId: player.positionId } });

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

		const removeResult = state.footballValidator.remove({ Player: { id: player.id, positionId: player.positionId } });

		setState({ ...state, bench: newBench, budget });
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

	const onTeamNameChange = (name: string) => {
		// TODO: teamNameChanged attribute in state
		setState({ ...state, teamName: name });
	};

	const validateTeam = (showNotifications?: boolean) => {
		let valid = true;

		const hasCaptain = !!state.captainId;
		const hasViceCaptain = !!state.viceCaptainId;

		const allStarting = state.starting.filter((player: any) => player && player.id)
			.length === application.competition.lineupSize;
		const allBenchPicked = state.bench.filter((player: any) => player && player.id)
			.length === application.competition.benchSize;

		const validTeamName = state.teamName.length > 2;

		// if (!hasCaptain) {
		// 	if (showNotifications) {
		// 		notifications.show({ color: "orange", message: t("team.captainSelect") });
		// 	}
		// 	valid = false;
		// }
		// if (!hasViceCaptain) {
		// 	if (showNotifications) {
		// 		notifications.show({ color: "oange", message: t("team.viceCaptainSelect") });
		// 	}
		// 	valid = false;
		// }
		// if (!allStarting || !allBenchPicked) {
		// 	if (showNotifications) {
		// 		notifications.show({ color: "orange", message: t("team.teamLineupIncomplete") });
		// 	}
		// 	valid = false;
		// }
		// if (!validTeamName) {
		// 	if (showNotifications) {
		// 		notifications.show({ color: "orange", message: t("team.teamNameInvalid") });
		// 	}
		// 	valid = false;
		// }
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

			setState({ ...state, savingTeamPending: true });

			// create function: /team/add
			return Promise.resolve(addTeam({
				starting: starting.map((p: any) => p.id),
				bench: bench.map((p: any) => p.id),
				teamName: state.teamName,
			})).then(() => setState({ ...state, savingTeamPending: false }));
		} else {
			return Promise.reject(
				// notifications.show({ color: "orange", message: t("team.teamSaveFailed") })
			);
		}
	};

	const onTeamReset = (team: any) => {
		const valid = validateTeam(true);

		if (valid) {
			const { starting, bench } = getStartingAndBenchIdsWithCaptainCheck();
			const startingIds = starting.map(player => player && player.id);
			const benchIds = bench.map(player => player && player.id);

			setState({ ...state, savingTeamPending: true });

			// create function: POST /team/:id
			return Promise.resolve();
		} else {
			return Promise.reject(
				// notifications.show({ color: "orange", message: t("team.teamInvalid") })
			);
		}
	};

	const onTeamEdit = (team: any) => {
		const valid = validateTeam(true);

		if (valid) {
			const startingIds = state.starting.map((player: any) => player.id);
			const benchIds = state.bench.map((player: any) => player.id);

			// create function: POST /team/:id
		}
	};

	const onTeamSelectionsUpdate = (teamId: number, weekId: number) => {
		const isValid = validateTeam(true);

		if (isValid) {
			const startingIds = state.starting.map((player: any) => player.id);
			const benchIds = state.bench.map((player: any) => player.id);

			// create function: POST /team/:id/selections
		}
	};

	const onPlayerSwap = (player: Player) => {
		console.log("SWAP RECEIVED PLAYER", player)
		if (player && player.id === state.swapPlayerId) {
			const pickBackResult = state.footballValidator.pick({ Player: { id: player.id, positionId: player.positionId } });
			setState({ ...state, swapPlayerId: null, swappedFrom: null, swapPlayer: null });
		}
		else if (state.swapPlayerId) {
			const previousSwapFromLineup = state.starting.find((startingPlayer: any) => startingPlayer && startingPlayer.id === state.swapPlayerId);
			const previousSwapFromBench = state.bench.find((benchPlayer: any) => benchPlayer && benchPlayer.id === state.swapPlayerId);

			let starting = null;
			let bench = null;
			const captainId = null;

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
							} else if (benchPlayer === secondSwapFromBench.id) {
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

			state.footballValidator.set(startingPlayersValidatorFormat, benchPlayersValidatorFormat);

			setState({
				...state, starting, bench, swappedFrom: null, swapPlayerId: null, swapPlayer: null, captainId: captainId || state.captainId
			});
		}
		else {
			const isLineupSwap = state.starting
				.find((startingPlayer: any) => startingPlayer && player && startingPlayer.id === player.id);
			if (isLineupSwap) {
				const removeResult = state.footballValidator.remove({ Player: { id: player.id, positionId: player.positionId } });
			}
			setState({ ...state, swapPlayerId: player.id, swapPlayer: player, swappedFrom: isLineupSwap ? "starting" : "bench" });
		}
	};

	const isPickable = (player: Player, transferPick?: boolean) => {
		const notInStarting = !state.starting.find(startingPlayer => startingPlayer && startingPlayer.id && startingPlayer.id === player.id);
		const notInBench = !state.bench.find(benchPlayer => benchPlayer && benchPlayer.id && benchPlayer.id === player.id);
		const affordable = player.value <= state.budget;

		const notTransferredOut = transferPick ? !state.draftTransfers.find(tf => tf.outId === player.id) : true;

		const emptySpotInTeam =
			!!state.starting.find(startingPlayer => !startingPlayer.id) ||
			!!state.bench.find(benchPlayer => !benchPlayer.id);

		const pickerSoFarFromSameClub =
			state.starting.filter(startingPlayer => startingPlayer && startingPlayer.clubId === player.clubId)
				.length
			+
			state.bench.filter(benchPlayer => benchPlayer && benchPlayer.clubId === player.clubId)
				.length;

		const underClubLimit = pickerSoFarFromSameClub < application.competition.teamSameClubPlayersLimit;
		let validFootballLineup = true;
		if (state.useFootballValidatorOnPick) {
			validFootballLineup = state.footballValidator.canPick({ Player: { 'id': player.id, 'position_id': player.positionId } });
		}
		if (!state.useFootballValidatorOnPick) {
			const playerPositionMaxPicks = []
				.concat(state.starting as any, state.bench as any)
				.filter((item: any) => item.positionId === player.positionId)
				.length;
			const playerPositionAlreadyPicked = []
				.concat(state.starting as any, state.bench as any)
				.filter((item: any) => item.positionId === player.positionId && item.id)
				.length;
			validFootballLineup = playerPositionAlreadyPicked < playerPositionMaxPicks;
		}
		// const validFootballLineup = state.footballValidator.canPick({ Player: { id: player.id, positionId: player.positionId } });

		return notInStarting && notInBench && affordable && emptySpotInTeam && underClubLimit && notTransferredOut && validFootballLineup;
	};

	const isSwapable = (player: Player) => {
		if (state.swapPlayerId && state.swapPlayer) {
			const swapInitInLineup = state.starting
				.find((startingPlayer: any) => startingPlayer && startingPlayer.id === state.swapPlayerId);
			if (swapInitInLineup) {
				const canPick = state.footballValidator.canPick({ Player: { id: player.id, positionId: player.positionId } }, true);
				return (canPick); // TODO: upcomingMatches of player => check date is after now
			} else {
				console.log("swap init in ", swapInitInLineup)
				const benchSwappedPlayer = state.bench.find((benchPlayer: any) => benchPlayer && benchPlayer.id === state.swapPlayerId);
				const isBenchedGoalie = !player.inStarting && player.positionId === 1;
				const swappedPlayerGoalieAndCurrentIteratedPlayerInBench =
					!player.inStarting && benchSwappedPlayer && benchSwappedPlayer.positionId === 1 && player.id !== state.swapPlayerId;
				if (isBenchedGoalie || swappedPlayerGoalieAndCurrentIteratedPlayerInBench) {
					return false;
				}

				if (player && player.id) {
					state.footballValidator.remove({ Player: { id: player.id, positionId: player.positionId } });
					const canPick = state.footballValidator.canPick({ Player: { id: state.swapPlayerId, positionId: state.swapPlayer.positionId } }, true);
					state.footballValidator.pick({ Player: { id: player.id, positionId: player.positionId } });

					return canPick;
				} else {
					return false;
				}
			}
		// } else if (player) { // TODO: check visible weekId & deadlineWeek
		// 	if (player.inStarting) { return false; }
		// 	return false; // TODO check more
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
				// weekId: matches.info.deadlineWeek
			}]);
		setState({ ...state, draftTransfers });
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
		setState({ ...state, draftTransfers });
	};

	const onDraftTransfersClear = () => {
		const startingPlayersValidatorFormat = playersToValidatorFormat(state.initialStarting);
		const benchPlayersValidatorFormat = playersToValidatorFormat(state.initialBench);
		state.footballValidator.set(startingPlayersValidatorFormat, benchPlayersValidatorFormat);

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
		// return teamsActions.submitTransfers(teamId, transfers)
		// TODO: POST team/transfers/:teamid
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

	const possibleFormation = () => {
		return state.footballValidator.getPossibleFormations();
	};

	return (
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
			budget={state.budget}
			// leagues={state.leagues}
			savingTeamPending={state.savingTeamPending}
			swapPlayerId={state.swapPlayerId}
			swappedFrom={state.swappedFrom}
			// initializedExternally={state.initializedExternally}
			visibleWeekId={state.visibleWeekId}
			teamNameChanged={state.teamNameChanged}
			// teamPointsInfo={state.teamPointsInfo}
			draftTransfers={state.draftTransfers}
			// deadlineWeekTransfers={state.deadlineWeekTransfers}
			// pastTransfers={state.pastTransfers}
			initTeamState={initTeamState}
			// activateCacheChanges={activateCacheChanges}
			resetTeamName={resetTeamName}
			onTeamNameUpdate={updateTeamName}
			onTeamEdit={onTeamEdit}
			onTeamSelectionsUpdate={onTeamSelectionsUpdate}
			// onDayChange={onDayChange}
			onPlayerSwap={onPlayerSwap}
			loadAllMatches={loadAllMatches}
			possibleFormation={possibleFormation}
			onTransferPlayerOut={onTransferPlayerOut}
			onDraftTransfersClear={onDraftTransfersClear}
			onTransferPlayerIn={onTransferPlayerIn}
			onTransfersSubmit={onTransfersSubmit}
			onTransfersReset={onTransfersReset}
			// boosters={state.boosters}
			// isTeamOwner={state.isTeamOwner}
			reloadUserTeams={reloadUserTeams}
			teamUser={state.teamUser}
			{...props}

		/>

	);
};