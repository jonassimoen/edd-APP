import { withTranslation } from "react-i18next";
import { RouterProvider, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import * as dayjs from "dayjs";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import config from "./config";
import { Crisp } from "crisp-sdk-web";
import * as Cronitor from "@cronitorio/cronitor-rum";
import { useGetDeadlineInfoQuery } from "./services/weeksApi";
import { useLazyGetPlayersQuery } from "./services/playersApi";
import { useLazyGetClubsQuery } from "./services/clubsApi";
import { clubsLoading, playersLoading, setClubs, setPlayers } from "./reducers/application";
import { useDispatch } from "react-redux";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.locale("nl-BE");


const App = () => {
	const {data} = useGetDeadlineInfoQuery();
	const [getPlayers] = useLazyGetPlayersQuery();
	const [getClubs] = useLazyGetClubsQuery();
	const dispatch = useDispatch();

	useEffect(() => {
		Crisp.configure(config.CHAT_API);

		Cronitor.load(config.CRONITOR_KEY, {
			debug: false, 
		});
	}, []);

	// useEffect(() => {
	// 	const latestFetch = +JSON.parse(localStorage.getItem("static_latest_fetch"));
	// 	const players = localStorage.getItem("_static_players");
	// 	const clubs = localStorage.getItem("_static_clubs");
	// 	if(!latestFetch || !players || !clubs || latestFetch < new Date(data?.rft).getTime()) {
	// 		dispatch(playersLoading());
	// 		dispatch(clubsLoading());
	// 		getPlayers().unwrap().then(
	// 			(p: Player[]) => localStorage.setItem("_static_players", JSON.stringify(p)));
	// 		getClubs().unwrap().then(
	// 			(c: Club[]) => localStorage.setItem("_static_clubs", JSON.stringify(c)));
	// 		localStorage.setItem("static_latest_fetch", JSON.stringify(Date.now()));
	// 	}
	// 	dispatch(setPlayers(JSON.parse(players)));
	// 	dispatch(setClubs(JSON.parse(clubs)));
	// }, [data?.rft]);

	return (
		<ConfigProvider theme={{
			token: {
				fontFamily: "UEFAEuro",
			}
		}}>
			<ToastContainer
				autoClose={7500}
			/>
			<RouterProvider router={router} />
		</ConfigProvider>
	);
};

export default withTranslation("translation")(App);
