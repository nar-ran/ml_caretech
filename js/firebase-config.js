import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAecJo_ZjExM5i3p0mEfcwEjo41mPabtqU",
  authDomain: "clientes-caretech.firebaseapp.com",
  projectId: "clientes-caretech",
  storageBucket: "clientes-caretech.appspot.com",
  messagingSenderId: "674790985709",
  appId: "1:674790985709:web:4eef0fef9a8a7a44ba61e4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };