import { withTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import React, { useEffect } from "react";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import * as dayjs from "dayjs";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Footer } from "./components/Footer/Footer";

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import config from "./config";
import { Crisp } from "crisp-sdk-web";
import * as Cronitor from "@cronitorio/cronitor-rum";
import { useGetTeamQuery } from "./services/teamsApi";
import { useGetDeadlineInfoQuery } from "./services/weeksApi";
import { useLazyGetPlayersQuery } from "./services/playersApi";
import { useLazyGetClubsQuery } from "./services/clubsApi";
import { setClubs, setPlayers } from "./reducers/application";
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
	
	// const []
	useEffect(() => {
		Crisp.configure(config.CHAT_API);

		Cronitor.load(config.CRONITOR_KEY, {
			debug: false, 
		});

	}, []);

	useEffect(() => {
		const latestFetch = +JSON.parse(localStorage.getItem("static_latest_fetch"));
		if(!latestFetch || latestFetch < new Date(data?.rft).getTime()) {
			getPlayers().unwrap().then((p: Player[]) => dispatch(setPlayers(p)));
			getClubs().unwrap().then((c: Club[]) => dispatch(setClubs(c)));
			localStorage.setItem("static_latest_fetch", JSON.stringify(Date.now()));
		}
	}, [data?.rft]);
	

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
// if (window.location.pathname.includes("/nl")) {
// 	this.props.i18n.changeLanguage("nl");
// 	const newUrl = window.location.pathname.replace("/nl", "");
// 	window.location.replace(newUrl === "" ? newUrl + "/home" : newUrl);

// }
// if (window.location.pathname.includes("/en")) {
// 	this.props.i18n.changeLanguage("en");
// 	const newUrl = window.location.pathname.replace("/en", "");
// 	window.location.replace(newUrl === "" ? newUrl + "/home" : newUrl);
// }}

export default withTranslation("translation")(App);
