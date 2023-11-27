import config from "@/config";

const competition: Competition = config.COMPETITION_CONFIG;

const defaultState = {
	competition: competition,
	title: "Fantasy Team App"
};

export function applicationReducer(state: ApplicationState = defaultState, action: any) {
	return state;
}