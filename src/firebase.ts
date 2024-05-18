import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

let messaging: any;
try {
	const firebaseApp = initializeApp(firebaseConfig);
	messaging = getMessaging(firebaseApp);
} catch(err) {
	console.error("Failed in init Firebase");
}

export const fetchToken = (setTokenFound: any, pushNotification: any) => {
	return getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID })
		.then((currentToken) => {
			if (currentToken) {
				setTokenFound(true);
				pushNotification(currentToken);
			} else {
				console.log(
					"No registration token available. Request permission to generate one."
				);
				setTokenFound(false);
			}
		})
		.catch((err) => {
			console.log("An error occurred while retrieving token. ", err);
		});
};

export const onMessageListener = () =>
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			resolve(payload);
		});
	});
