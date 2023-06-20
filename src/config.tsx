export default {
	API_URL: import.meta.env.VITE_API_URL,
	COMPETITION_CONFIG: import.meta.env.VITE_COMPETITION_CONFIG && import.meta.env.VITE_COMPETITION_CONFIG.length
		? JSON.parse(import.meta.env.VITE_COMPETITION_CONFIG) : {},
};