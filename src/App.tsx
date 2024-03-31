import { withTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import React, { useEffect, useState } from "react";
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
import Pushy from "pushy-sdk-web";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.locale("nl-BE");

const App = () => {
	useEffect(() => {
		Crisp.configure(config.CHAT_API);

		Cronitor.load(config.CRONITOR_KEY, {
			debug: false, 
		});

	}, []);
	useEffect(() => {
		navigator.serviceWorker.register("./service-worker.js");
		Notification.requestPermission().then((permission) => {
			// If the user accepts, let's create a notification
			if (permission === "granted") {
				const notification = new Notification("Notifications enabled!");
				Pushy.register({ appId: "6609577c6d2ffee34cd058a7" }).then(function (deviceToken: string) {
					// Print device token to console
					alert("Pushy device token: " + deviceToken);
		
					// Send the token to your backend server via an HTTP GET request
					//fetch('https://your.api.hostname/register/device?token=' + deviceToken);
		
					// Succeeded, optionally do something to alert the user
				}).catch(function (err: { message: string; }) {
					// Notify user of failure
					alert("Registration failed: " + err.message);
				});
				// …
			}
		});
		
	}, []);

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
