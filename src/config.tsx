export default {
	API_URL: import.meta.env.VITE_API_URL,
	GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	CHAT_API: import.meta.env.VITE_CHAT_API,
	CRONITOR_KEY: import.meta.env.VITE_CRONITOR_KEY,
	COMPETITION_CONFIG:
    import.meta.env.VITE_COMPETITION_CONFIG &&
    import.meta.env.VITE_COMPETITION_CONFIG.length ? JSON.parse(import.meta.env.VITE_COMPETITION_CONFIG) : {},
	STAT_GROUP_NAMES: ["Play time","Attacking","Passing","Defending","Dribbles","Fouls","Goalkeeper","Penalty's","Duels","Other"],
	STATISTICS: [
		{
			name: "Play time",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "STARTING PLAYER",
					slug: "starting",
					short: "11",
					type: "boolean",
				},
				{
					full: "MINUTE IN",
					slug: "in",
					short: "I",
					type: "number",
				},
				{
					full: "MINUTE OUT",
					slug: "out",
					short: "O",
					type: "number",
				},
			],
		},
		{
			name: "Other",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "YELLOW CARD",
					slug: "yellow",
					short: "Y",
					type: "bool",
				},
				{
					full: "RED CARD",
					slug: "red",
					short: "R",
					type: "bool",
				},
				{
					full: "Man of the Match",
					slug: "motm",
					short: "MOTM",
					type: "bool",
				},
			],
		},
		{
			name: "Attacking",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "GOALS",
					slug: "goals",
					short: "G",
					type: "number",
				},
				{
					full: "ASSISTS",
					slug: "assists",
					short: "A",
					type: "number",
				},
				{
					full: "SHOTS",
					slug: "shots",
					short: "SH",
					type: "number",
				},
				{
					full: "SHOTS ON TARGET",
					slug: "shotsOnTarget",
					short: "ST",
					type: "number",
				},
			],
		},
		{
			name: "Passing",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "KEY PASSES",
					slug: "keyPasses",
					short: "KP",
					type: "number",
				},
				{
					full: "PASSES ACCURATE",
					slug: "accuratePasses",
					short: "PA",
					type: "number",
				},
				{
					full: "PASSES TOTAL",
					slug: "totalPasses",
					short: "PT",
					type: "number",
				},
			],
		},
		{
			name: "Defending",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "TACKLES",
					slug: "tackles",
					short: "T",
					type: "number",
				},
				{
					full: "BLOCKS",
					slug: "blocks",
					short: "B",
					type: "number",
				},
				{
					full: "INTERCEPTIONS",
					slug: "interceptions",
					short: "IC",
					type: "number",
				},
			],
		},
		{
			name: "Dribbles",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "DRIBBLES ATTEMPTED",
					slug: "dribblesAttempted",
					short: "DA",
					type: "number",
				},
				{
					full: "DRIBBLES SUCCESS",
					slug: "dribblesSuccess",
					short: "DS",
					type: "number",
				},
				{
					full: "DRIBBLES PAST",
					slug: "dribblesPast",
					short: "DS",
					type: "number",
				},
			],
		},
		{
			name: "Fouls",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "FOULS DRAWN",
					slug: "foulsDrawn",
					short: "FD",
					type: "number",
				},
				{
					full: "FOULS COMMITED",
					slug: "foulsCommited",
					short: "FC",
					type: "number",
				},
			],
		},
		{
			name: "Goalkeeper",
			positions: [1],
			inputs: [
				{
					full: "PENALTY SAVED",
					slug: "penaltySaved",
					short: "PSa",
					type: "number",
				},
				{
					full: "SAVES",
					slug: "saves",
					short: "S",
					type: "number",
				},
			],
		},
		{
			name: "Penalty's",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "PENALTY COMMITED",
					slug: "penaltyCommited",
					short: "PC",
					type: "number",
				},
				{
					full: "PENALTY WON",
					slug: "penaltyWon",
					short: "PW",
					type: "number",
				},
				{
					full: "PENALTY SCORED",
					slug: "penaltyScored",
					short: "PSc",
					type: "number",
				},
				{
					full: "PENALTY MISSED",
					slug: "penaltyMissed",
					short: "PM",
					type: "number",
				},
			],
		},
		{
			name: "Duels",
			positions: [0,1,2,3,4],
			inputs: [
				{
					full: "DUELS WON",
					slug: "duelsWon",
					short: "DW",
					type: "number",
				},
				{
					full: "DUELS TOTAL",
					slug: "duelsTotal",
					short: "DT",
					type: "number",
				},
			],
		},
		// {
		// 	name: "Other",
		// 	positions: [0,1,2,3,4],
		// 	inputs: [
		// 	],
		// },
	],
};
