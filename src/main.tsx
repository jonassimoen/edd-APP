import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import { Provider } from "react-redux";
import "@/styles/index.scss";
import "./i18n";
import { store } from "./reducers";

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/firebase-messaging-sw.js")
			.then((registration) => {
				console.log("Service Worker registration successful with scope: ", registration.scope);
			})
			.catch((error) => {
				console.error("Service Worker registration failed: ", error);
			});
	});
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
