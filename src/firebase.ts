import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
	apiKey: "AIzaSyDU584rAo7HT4uMtse1IxctnInbCkwBSDs",
	authDomain: "european-dream-draft.firebaseapp.com",
	projectId: "european-dream-draft",
	storageBucket: "european-dream-draft.appspot.com",
	messagingSenderId: "601486102170",
	appId: "1:601486102170:web:3ac5ff18c3687f5bdfd923",
	measurementId: "G-JXEPSCE8K5"
};

let messaging: any;
try {
	const firebaseApp = initializeApp(firebaseConfig);
	messaging = getMessaging(firebaseApp);
} catch(err) {
	console.error("Failed in init Firebase");
}

export const fetchToken = (setTokenFound: any, pushNotification: any) => {
	return getToken(messaging, { vapidKey: "BKTXfGcEVAbAVyPPdP2zb0APYHrcYJXgtq5qr6ivL5r2E2FKlRvbEkSBTms0V4VS432fVKRLZgs8dC3BtFCmri0" })
		.then((currentToken) => {
			if (currentToken) {
				console.log("current token for client: ", currentToken);
				setTokenFound(true);
				pushNotification(currentToken);
				// Track the token -> client mapping, by sending to backend server
				// show on the UI that permission is secured
			} else {
				console.log(
					"No registration token available. Request permission to generate one."
				);
				setTokenFound(false);
				// shows on the UI that permission is required
			}
		})
		.catch((err) => {
			console.log("An error occurred while retrieving token. ", err);
			// catch error while creating client token
		});
};

export const onMessageListener = () =>
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			resolve(payload);
		});
	});
