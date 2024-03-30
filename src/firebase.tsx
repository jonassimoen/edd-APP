import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
	apiKey: "AIzaSyDU584rAo7HT4uMtse1IxctnInbCkwBSDs",
	authDomain: "european-dream-draft.firebaseapp.com",
	projectId: "european-dream-draft",
	storageBucket: "european-dream-draft.appspot.com",
	messagingSenderId: "601486102170",
	appId: "1:601486102170:web:3ac5ff18c3687f5bdfd923",
	measurementId: "G-JXEPSCE8K5"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);