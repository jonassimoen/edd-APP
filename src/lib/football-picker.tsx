declare type PositionsMinMax = {
	[key: string]: { min: number, max: number },
}

declare type PositionsIds = {
	[key: string]: number,
}

declare type Player = {
	id: number,
	positionId: number,
}

export const FootballPicker = (maxPositionsPicks: PositionsMinMax, positionsIds: PositionsIds) => {
	let res: { [key: string]: number[] } = {
		Coach: [],
		Goalkeeper: [],
		Defender: [],
		Midfielder: [],
		Forward: [],
		Bench: []
	};

	const pickAtPosition = (positionName: string, playerId: number) => {
		res[positionName].push(playerId);
	};

	const setPositionPickLimit = (positionName: string, limits: { min: number, max: number }) => {
		maxPositionsPicks[positionName] = limits;
	};

	const getPositionNameById = (id: number) => {
		return Object.keys(positionsIds).find((name: string) => positionsIds[name] === id);
	};

	const getCombinations = (maxAllowedPlayersPerPosition: { [key: string]: number }) => {
		const combis: string[] = [];
		const current = {
			defenderN: Math.max(res.Defender.length, maxPositionsPicks.Defender.min),
			midfielderN: Math.max(res.Midfielder.length, maxPositionsPicks.Midfielder.min),
			forwardN: Math.max(res.Forward.length, maxPositionsPicks.Forward.min),
		};

		for (let defI = current.defenderN; defI <= maxAllowedPlayersPerPosition.Defender; defI++) {
			for (let midI = current.midfielderN; midI <= maxAllowedPlayersPerPosition.Midfielder; midI++) {
				for (let fwI = current.forwardN; fwI <= maxAllowedPlayersPerPosition.Forward; fwI++) {
					const combi = `${defI}-${midI}-${fwI}`;
					if ((defI + midI + fwI == 10) && (combis.indexOf(combi) === -1)) {
						combis.push(combi);
					}
				}
			}
		}
		return combis;
	};

	const getMaxAllowedForPositions = (positionsNames: string[]) => {
		const maxPerPos: { [key: string]: number } = {
			Coach: 1,
			Goalkeeper: 1,
			Defender: 0,
			Midfielder: 0,
			Forward: 0,
			Bench: 0
		};

		const nrFieldPlayers = 10;

		// for each position => check how many players can be selected for this position
		// considering current selection of other positions & min/max per position
		positionsNames.forEach((positionName: string) => {
			const amountPickedAtThisPosition = res[positionName].length;
			const otherPositions = positionsNames.filter((pos: string) => pos !== positionName);

			let left = nrFieldPlayers - amountPickedAtThisPosition;

			otherPositions.forEach((otherPositionName: string) => {
				left -= Math.max(res[otherPositionName].length, maxPositionsPicks[otherPositionName].min);
			});
			if (left > 0) {
				let maxForPosition = amountPickedAtThisPosition;
				while (left > 0 && maxForPosition < maxPositionsPicks[positionName].max) {
					maxForPosition += 1;
					left -= 1;
				}
				maxPerPos[positionName] = maxForPosition;
			} else {
				maxPerPos[positionName] = amountPickedAtThisPosition;
			}
		});
		return maxPerPos;
	};

	const getPossibleFormations = () => {
		const positionsToCheck = ["Defender", "Midfielder", "Forward"];
		const maxAllowedPlayersPerPositions = getMaxAllowedForPositions(positionsToCheck);
		return getCombinations(maxAllowedPlayersPerPositions);
	};

	const set = (starting: any[], bench: any[]) => {
		res = {
			Coach: [],
			Goalkeeper: [],
			Defender: [],
			Midfielder: [],
			Forward: [],
			Bench: []
		};

		starting.forEach((player: Player) => {
			res[getPositionNameById(player.positionId)].push(player.id);
		});

		bench.forEach((player: Player) => {
			res.Bench.push(player.id);
		});

		return {
			possibleFormations: getPossibleFormations(),
			result: res,
		};
	};

	const canPick = (player: Player, ignoreBench: boolean) => {
		return checkAndPick(player, true, ignoreBench);
	};

	const checkAndPick = (player: Player, checkOnly = false, ignoreBench = false) => {
		const positionsToCheck = ["Defender", "Midfielder", "Forward"];
		const maxAllowedPlayersPerPositions = getMaxAllowedForPositions(positionsToCheck);
		const currentPlayerPositionName = getPositionNameById(player.positionId);

		if (res[currentPlayerPositionName].indexOf(player.id) !== -1) {
			// player already in starting
			return false;
		}
		if (!ignoreBench && res.Bench.indexOf(player.id) !== -1) {
			// player already in bench
			return false;
		}

		if (res[currentPlayerPositionName] && (res[currentPlayerPositionName].length < maxAllowedPlayersPerPositions[currentPlayerPositionName])) {
			if (!checkOnly) {
				pickAtPosition(currentPlayerPositionName, player.id);
				console.log(`Picked player at position ${player.positionId}`);
			}
			return true;
		} else {
			const benchN = res.Bench.length;
			if (benchN < maxPositionsPicks.Bench.max) {
				if (!checkOnly) {
					console.log(`Picked BENCH player at position ${player.positionId}`);
					pickAtPosition("Bench", player.id);
				}
				return true;
			} else {
				return false;
			}
		}
	};

	const isValid = () => {
		const nrFieldPlayers = 11;
		let validated =
			(res.Goalkeeper.length >= maxPositionsPicks.Goalkeeper.min && res.Goalkeeper.length <= maxPositionsPicks.Goalkeeper.max) &&
			(res.Defender.length >= maxPositionsPicks.Defender.min && res.Defender.length <= maxPositionsPicks.Defender.max) &&
			(res.Midfielder.length >= maxPositionsPicks.Midfielder.min && res.Midfielder.length <= maxPositionsPicks.Midfielder.max) &&
			(res.Forward.length >= maxPositionsPicks.Forward.min && res.Forward.length <= maxPositionsPicks.Forward.max) &&
			(res.Bench.length >= maxPositionsPicks.Bench.min && res.Bench.length <= maxPositionsPicks.Bench.max) &&
			(nrFieldPlayers === (res.Goalkeeper.length + res.Defender.length + res.Midfielder.length + res.Forward.length));

		if (maxPositionsPicks.Coach !== undefined) {
			validated = validated &&
				(res.Coach.length >= maxPositionsPicks.Coach.min && res.Coach.length <= maxPositionsPicks.Coach.max);
		}
		return validated;
	};

	const pick = (player: Player) => {
		const picked = checkAndPick(player);
		return {
			possibleFormations: getPossibleFormations(),
			result: res,
			picked: picked
		};
	};

	const remove = (player: Player) => {
		let removed = false;

		const handler = (playerId: number) => {
			if (playerId === player.id) {
				removed = true;
				return false;
			} else {
				return true;
			}
		};

		res[getPositionNameById(player.positionId)] = res[getPositionNameById(player.positionId)].filter(handler);
		res.Bench = res.Bench.filter(handler);

		return {
			possibleFormations: getPossibleFormations(),
			result: res,
			removed: removed,
		};
	};

	return {
		pick: pick,
		remove: remove,
		set: set,
		isValid: isValid,
		canPick: canPick,
		getPossibleFormations: getPossibleFormations,
		setPositionPickLimit: setPositionPickLimit,
	};
};

