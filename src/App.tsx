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

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.locale("nl-BE");


const App = () => {
	useEffect(() => Crisp.configure(config.CHAT_API), []);

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
