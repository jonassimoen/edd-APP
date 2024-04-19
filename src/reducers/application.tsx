import config from "@/config";

const competition: Competition = config.COMPETITION_CONFIG;

const defaultState = {
	competition: competition,
	title: "Fantasy Team App",
	players: [] as Player[],
	clubs: [] as Club[],
	playersLoading: false,
	clubsLoading: false,
	playersSuccess: false,
	clubsSuccess: false,
};

export const setPlayers = (players: Player[]) => ({
	type: "SET_PLAYERS",
	payload: players,
});
  
export const setClubs = (clubs: Club[]) => ({
	type: "SET_CLUBS",
	payload: clubs,
});
  
export const playersLoading = () => ({
	type: "PLAYERS_LOADING",
	payload: {},
});
  
export const clubsLoading = () => ({
	type: "CLUBS_LOADING",
	payload: {},
});
  

export function applicationReducer(state: ApplicationState = defaultState, action: any) {
	switch(action.type) {
	case "SET_PLAYERS":
		return {...state, players: action.payload, playerSuccess: true, playersLoading: false};
	case "SET_CLUBS":
		return {...state, clubs: action.payload, clubsSuccess: true, clubsLoading: false};
	case "PLAYERS_LOADING":
		return {...state, playerSuccess: false, playersLoading: true};
	case "CLUBS_LOADING":
		return {...state, clubsSuccess: false, clubsLoading: true};
	default:
		return state;
	}
}