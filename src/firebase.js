// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZIy_zZaGiz7VD7X3JG1YlmANUA6YHntM",
  authDomain: "durga-shankar-portfolio.firebaseapp.com",
  databaseURL: "https://durga-shankar-portfolio-default-rtdb.firebaseio.com",
  projectId: "durga-shankar-portfolio",
  storageBucket: "durga-shankar-portfolio.firebasestorage.app",
  messagingSenderId: "27937232551",
  appId: "1:27937232551:web:88bec9dccd3eca48476d82",
  measurementId: "G-E83252KHD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
