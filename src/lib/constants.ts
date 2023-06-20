const FootballMaxPositionsPicks = {
	Goalkeeper: { min: 1, max: 1 },
	Defender: { min: 3, max: 5 },
	Midfielder: { min: 3, max: 5 },
	Forward: { min: 1, max: 3 },
	Bench: { min: 4, max: 4 }
};

const FootballPositionIds = {
	Goalkeeper: 1,
	Defender: 2,
	Midfielder: 3,
	Forward: 4
};

const BoosterTypes = {
	BANK: "bank",
	TRIPLE_CAPTAIN: "tripleCaptain",
	FREE_HIT: "freeHit",
	WILDCARD: "wildCard"
};

export {
	FootballMaxPositionsPicks,
	FootballPositionIds,
	BoosterTypes
};