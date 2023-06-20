import { WithTranslation, withTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import React from "react";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import * as dayjs from 'dayjs'
import { AuthContextProvider } from "./lib/stores/AuthContext";
import { theme } from "./styles/theme";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
// import 'dayjs/locale/nl-BE'
dayjs.locale('nl-BE');

class App extends React.PureComponent<WithTranslation> {
	render() {
		if (window.location.pathname.includes("/nl")) {
			this.props.i18n.changeLanguage("nl");
			const newUrl = window.location.pathname.replace("/nl", "");
			window.location.replace(newUrl === "" ? newUrl + "/home" : newUrl);

		}
		if (window.location.pathname.includes("/en")) {
			this.props.i18n.changeLanguage("en");
			const newUrl = window.location.pathname.replace("/en", "");
			window.location.replace(newUrl === "" ? newUrl + "/home" : newUrl);
		}

		return (
			<ConfigProvider theme={{
				token: {
					// colorPrimary: theme.primaryContrast,
					// colorBorder: theme.primaryColor,
					// colorTextLightSolid: '#FFF',
					// borderRadius: 0,
					fontFamily: "UEFASupercup"
				}
			}}>
				<ToastContainer
					autoClose={7500}
				/>
				<RouterProvider router={router} />
			</ConfigProvider>
		);
	}
}

export default withTranslation("translation")(App);
