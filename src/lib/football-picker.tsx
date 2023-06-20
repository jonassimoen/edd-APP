export const FootballPicker = (maxPositions: { [key: string]: { min: number, max: number } }, positionsIds: { [key: string]: number }) => {
	const result: { [key: string]: number[] } = {
		Goalkeeper: [],
		Defender: [],
		Midfielder: [],
		Forward: [],
		Bench: [],
	};

	const pickAtPosition = (positionName: string, playerId: number) => {
		result[positionName].push(playerId);
	};

	const setPositionLimit = (positionName: string, limit: { min: number, max: number }) => {
		maxPositions[positionName] = limit;
	};

	const set = (starting: { Player: any }[], bench: { Player: any }[]) => {
		result.Goalkeeper = [];
		result.Defender = [];
		result.Midfielder = [];
		result.Forward = [];
		result.Bench = [];

		starting.forEach((player: { Player: any }) => {
			result[getPositionNameById(player.Player.positionId)].push(player.Player.id);
		});

		bench.forEach((player: { Player: any }) => {
			result.Bench.push(player.Player.id);
		});

		return {
			possibleFormations: getPossibleFormations(),
			result: result
		};
	};

	const canPick = (player: { Player: any }, ignoreBench: boolean) => {
		return checkAndPick(player, true, ignoreBench);
	};

	const checkAndPick = (player: { Player: any }, justCheck = false, ignoreBench = false) => {
		const checkedPositions = ["Defender", "Midfielder", "Forward"];
		const maxAllowedForPositions = getMaxAllowedForPositions(checkedPositions);
		const pickedPositionName = getPositionNameById(player.Player.positionId);
		if (result[pickedPositionName].indexOf(player.Player.id) !== -1) {
			return false;
		}

		if (!ignoreBench && result.Bench.indexOf(player.Player.id) !== -1) {
			return false;
		}

		if (result[pickedPositionName] && (result[pickedPositionName].length < maxAllowedForPositions[pickedPositionName])) {
			if (!justCheck) {
				pickAtPosition(pickedPositionName, player.Player.id);
			}
			return true;
		} else {
			if (result["Bench"].length < maxPositions["Bench"].max) {
				if (!justCheck) {
					pickAtPosition("Bench", player.Player.id);
				}
				return true;
			} else {
				return false;
			}
		}
	};

	const isValid = () => {
		const fieldPlayers = 11;
		return (result.Goal.length >= maxPositions.Goal.min && result.Goal.length <= maxPositions.Goal.max)
            && (result.Defender.length >= maxPositions.Defender.min && result.Defender.length <= maxPositions.Defender.max)
            && (result.Midfielder.length >= maxPositions.Midfielder.min && result.Midfielder.length <= maxPositions.Midfielder.max)
            && (result.Forward.length >= maxPositions.Forward.min && result.Forward.length <= maxPositions.Forward.max)
            && (result.Bench.length >= maxPositions.Bench.min && result.Bench.length <= maxPositions.Bench.max)
            && ((fieldPlayers) === (result.Goal.length + result.Defender.length + result.Midfielder.length + result.Forward.length));
	};

	const getMaxAllowedForPositions = (checkedPositions: string[]) => {
		const maxPlayerPerPosition: { [key: string]: number } = {
			Goalkeeper: 1,
			Defender: 0,
			Midfielder: 0,
			Forward: 0
		};

		const totalFieldPlayers = 10;

		checkedPositions.forEach((positionToCheck: string) => {
			const alreadyPicked = result[positionToCheck].length;

			const otherPositions = checkedPositions.filter((position: string) => {
				return position !== positionToCheck;
			});

			let spotsLeft = totalFieldPlayers - alreadyPicked;

			otherPositions.forEach((otherPosition: string) => {
				spotsLeft -= Math.max((result[otherPosition].length, maxPositions[otherPosition].min));
			});

			if (spotsLeft > 0) {
				let maxForPosition = alreadyPicked;
				while (spotsLeft > 0 && maxForPosition < maxPositions[positionToCheck].max) {
					maxForPosition += 1;
					spotsLeft -= 1;
				}
				maxPlayerPerPosition[positionToCheck] = maxForPosition;
			} else {
				maxPlayerPerPosition[positionToCheck] = alreadyPicked;
			}
		});

		return maxPlayerPerPosition;
	};

	const getCombinations = (maxAllowedPlayersPerPositions: { [key: string]: number }) => {
		const combinations = [];
		const defaults = {
			nrDefender: Math.max(result.Defender.length, maxPositions.Defender.min),
			nrMidfielder: Math.max(result.Midfielder.length, maxPositions.Midfielder.min),
			nrForward: Math.max(result.Forward.length, maxPositions.Forward.min),
		};

		for (let defNr = defaults.nrDefender; defNr <= maxAllowedPlayersPerPositions.Defender; defNr++) {
			for (let midNr = defaults.nrMidfielder; midNr <= maxAllowedPlayersPerPositions.Midfielder; midNr++) {
				for (let fwNr = defaults.nrForward; fwNr <= maxAllowedPlayersPerPositions.Forward; fwNr++) {
					const combi = `${defNr}-${midNr}-${fwNr}`;
					if (((defNr + midNr + fwNr) === 10) && ((combinations.indexOf(combi) === -1))) {
						combinations.push(combi);
					}
				}
			}
		}

		return combinations;
	};

	const getPossibleFormations = () => {
		const checkedPositions = ["Defender", "Midfielder", "Forward"];
		const maxAllowedForPositions = getMaxAllowedForPositions(checkedPositions);
		return getCombinations(maxAllowedForPositions);
	};

	const pick = (player: { Player: any }) => {
		const picked = checkAndPick(player);

		return {
			possibleFormations: getPossibleFormations(),
			result: result,
			picked: picked
		};
	};

	const getPositionNameById = (positionId: number) => {
		return Object.keys(positionsIds)
			.find((positionName) => {
				return positionsIds[positionName] === positionId;
			}) || "";
	};

	const remove = (player: { Player: any }) => {
		const removeId = player.Player.id;
		const positionId = player.Player.positionId;
		let removed = false;

		const removeHandler = (playerId: number) => {
			if(playerId === removeId) {
				removed = true;
				return false;
			} else {
				return true;
			}
		};

		result[getPositionNameById(positionId)] = result[getPositionNameById(positionId)].filter(removeHandler);
		result.Bench = result.Bench.filter(removeHandler);

		return {
			possibleFormations: getPossibleFormations(),
			result: result,
			removed: removed
		};
	};

	return {
		pick: pick,
		remove: remove,
		set: set,
		isValid: isValid,
		canPick: canPick,
		getPossibleFormations: getPossibleFormations,
		setPositionLimit: setPositionLimit
	};
};