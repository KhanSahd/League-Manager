// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCddGfCJuh1ilqAZ3p9khbjB-BCZX4u0Lg',
	authDomain: 'locktalk-96ef5.firebaseapp.com',
	projectId: 'locktalk-96ef5',
	storageBucket: 'locktalk-96ef5.firebasestorage.app',
	messagingSenderId: '83996117100',
	appId: '1:83996117100:web:10cfda098745dfdd87b049',
	measurementId: 'G-L56YDTB1X3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth with AsyncStorage for persistence in React Native
const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
