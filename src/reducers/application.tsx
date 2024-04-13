import config from "@/config";

const competition: Competition = config.COMPETITION_CONFIG;

const defaultState = {
	competition: competition,
	title: "Fantasy Team App",
	players: [] as Player[],
	clubs: [] as Club[],
};

export const setPlayers = (players: Player[]) => ({
	type: "SET_PLAYERS",
	payload: players,
});
  
export const setClubs = (clubs: Club[]) => ({
	type: "SET_CLUBS",
	payload: clubs,
});
  

export function applicationReducer(state: ApplicationState = defaultState, action: any) {
	switch(action.type) {
	case "SET_PLAYERS":
		return {...state, players: action.payload};
	case "SET_CLUBS":
		return {...state, clubs: action.payload};
	default:
		return state;
	}
}