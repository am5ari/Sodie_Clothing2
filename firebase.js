import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"


const firebaseConfig = {

apiKey: "AIzaSyBVWpPmD_-U-ZdUqJTTyZBr_TSjNytV8QM",
authDomain: "sodie-clothing.firebaseapp.com",
projectId: "sodie-clothing",
storageBucket: "sodie-clothing.firebasestorage.app",
messagingSenderId: "881356249815",
appId: "1:881356249815:web:5d1e3d7d57fb49c9eb6e92",
measurementId: "G-CMMJH3M9K2"

}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const storage = getStorage(app)