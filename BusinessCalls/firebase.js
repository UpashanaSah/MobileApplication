import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyCdedy6JrM7SFP2bvTS035AvbrZf3x06Ew",
  authDomain: "mobileapplication-b0aec.firebaseapp.com",
  databaseURL: "https://mobileapplication-b0aec-default-rtdb.firebaseio.com",
  projectId: "mobileapplication-b0aec",
  storageBucket: "mobileapplication-b0aec.firebasestorage.app",
  messagingSenderId: "347418452781",
  appId: "1:347418452781:web:12cc1079d54fbd8fd9a9a4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Realtime Database instance, used by script.js to sync posts,
// chat messages, and bookings.
export const db = getDatabase(app);

export default app;
