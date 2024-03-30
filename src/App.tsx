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
import { messaging } from "./firebase";
import { getMessaging, getToken, onMessage } from "@firebase/messaging";

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
		if (navigator.serviceWorker) {
			// Register the SW
			navigator.serviceWorker.register("/firebase-messaging-sw.js").then(function(registration){console.log("ok");}).catch(console.log);
		}
		if(window.Notification) {
			if(Notification.permission === "granted") {
				console.log("granted");
			} else if(Notification.permission !== "denied") {
				Notification.requestPermission(permission => {
					if(permission === "granted") {
						console.log("granted");
					}
				});
			}
		}
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		getToken(messaging, { vapidKey: "BKTXfGcEVAbAVyPPdP2zb0APYHrcYJXgtq5qr6ivL5r2E2FKlRvbEkSBTms0V4VS432fVKRLZgs8dC3BtFCmri0" }).then((currentToken) => {
			if (currentToken) {
			// Send the token to your server and update the UI if necessary
			// ...
				console.log(currentToken);
			} else {
			// Show permission request UI
				console.log("No registration token available. Request permission to generate one.");
			// ...
			}
		}).catch((err) => {
			console.log("An error occurred while retrieving token. ", err);
			// ...
		});
		// const messaging = getMessaging();
		onMessage(messaging, (payload) => {
			console.log('Message received. ', payload);
			// Update the UI to include the received message.
			
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
