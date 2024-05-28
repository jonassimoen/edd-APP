import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import { Provider } from "react-redux";
import "@/styles/index.scss";
import "./i18n";
import { store } from "./reducers";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
