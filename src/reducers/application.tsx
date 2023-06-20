import config from "@/config";

const competition: Competition = config.COMPETITION_CONFIG;

const defaultState = {
	competition: competition,
};

export function applicationReducer(state: ApplicationState = defaultState, action: any) {
	return state;
}