import { combineReducers } from "redux";
import { applicationReducer } from "./application";
import { usersApi } from "@/services/usersApi";
import { teamsApi } from "@/services/teamsApi";
import { playersApi } from "@/services/playersApi";
import { clubsApi } from "@/services/clubsApi";
import { matchesApi } from "@/services/matchesApi";
import { weeksApi } from "@/services/weeksApi";
import { userReducer } from "@/features/userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { playerStatsApi } from "@/services/statisticsApi";
import { pagesApi } from "@/services/pagesApi";

const reducer = combineReducers({
	[usersApi.reducerPath]: usersApi.reducer,
	[teamsApi.reducerPath]: teamsApi.reducer,
	[playersApi.reducerPath]: playersApi.reducer,
	[clubsApi.reducerPath]: clubsApi.reducer,
	[matchesApi.reducerPath]: matchesApi.reducer,
	[weeksApi.reducerPath]: weeksApi.reducer,
	[playerStatsApi.reducerPath]: playerStatsApi.reducer,
	[pagesApi.reducerPath]: pagesApi.reducer,
	application: applicationReducer,
	userState: userReducer,
});

// export const middleware = (getDefaultMiddleware:any) =>{
// 	getDefaultMiddleware().concat([
// 		usersApi.middleware,
// 		teamsApi.middleware,
// 		playersApi.middleware,
// 		clubsApi.middleware,
// 		matchesApi.middleware,
// 		weeksApi.middleware,
// 		playerStatsApi.middleware,
// 	]);
// }

export const store = configureStore({
	reducer: reducer,
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
		usersApi.middleware,
		teamsApi.middleware,
		playersApi.middleware,
		clubsApi.middleware,
		matchesApi.middleware,
		weeksApi.middleware,
		playerStatsApi.middleware,
		pagesApi.middleware,
	]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;