import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase Config
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
const db = getDatabase(app);

console.log("Firebase Connected");

// Form Elements
const form = document.getElementById("contactForm");
const success = document.getElementById("success");

// Submit Form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    alert("Please fill all fields");
    return;
  }

  const formData = {
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
  };

  console.log("Submitting:", formData);

  try {
    const contactRef = push(ref(db, "contacts"));

    await set(contactRef, formData);

    console.log("Data Saved Successfully!");

    success.textContent = "Your message has been sent successfully!";
    form.reset();
  } catch (error) {
    console.error("Firebase Error:", error);
  }
});

// Read all data from Firebase
const contactsRef = ref(db, "contacts");

onValue(contactsRef, (snapshot) => {
  const data = snapshot.val();

  console.log("===== ALL FIREBASE DATA =====");
  console.log(data);

  if (data) {
    Object.keys(data).forEach((key) => {
      console.log("Record ID:", key);
      console.log("Name:", data[key].name);
      console.log("Email:", data[key].email);
      console.log("Subject:", data[key].subject);
      console.log("Message:", data[key].message);
      console.log("----------------------------");
    });
  }
});
