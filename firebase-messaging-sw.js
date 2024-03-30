// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js");

// eslint-disable-next-line no-undef
const firebaseConfig = {
	apiKey: "AIzaSyDU584rAo7HT4uMtse1IxctnInbCkwBSDs",
	authDomain: "european-dream-draft.firebaseapp.com",
	projectId: "european-dream-draft",
	storageBucket: "european-dream-draft.appspot.com",
	messagingSenderId: "601486102170",
	appId: "1:601486102170:web:3ac5ff18c3687f5bdfd923",
	measurementId: "G-JXEPSCE8K5"
};
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	// Customize notification here
	const notificationTitle = 'Background Message Title';
	const notificationOptions = {
	  body: 'Background Message body.',
	  icon: '/firebase-logo.png'
	};
  
	self.registration.showNotification(notificationTitle,
	  notificationOptions);
  });