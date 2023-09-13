export default {
	API_URL: import.meta.env.VITE_API_URL,
	COMPETITION_CONFIG: import.meta.env.VITE_COMPETITION_CONFIG && import.meta.env.VITE_COMPETITION_CONFIG.length
		? JSON.parse(import.meta.env.VITE_COMPETITION_CONFIG) : {},
	STATISTICS: [
		{
			full: "MINUTES PLAYED",
			short: "P",
			type: "number",
		},
		{
			full: "GOALS",
			short: "G",
			type: "number",
		},
		{
			full: "ASSISTS",
			short: "A",
			type: "number",
		},
		{
			full: "PASSES COMPLETED",
			short: "PC",
			type: "number",
		},
		{
			full: "PASSES FAILED",
			short: "PF",
			type: "number",
		},
		{
			full: "YELLOW CARD",
			short: "Y",
			type: "bool",
		},
		{
			full: "SECOND YELLOW CARD",
			short: "SY",
			type: "bool",
		},
		{
			full: "RED CARD",
			short: "R",
			type: "bool",
		},
		{
			full: "Man of the Match",
			short: "MOTM",
			type: "bool",
		},
	]
};