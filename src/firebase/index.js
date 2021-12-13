import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from '@firebase/auth'

const firebaseApp = initializeApp ({
    apiKey: "AIzaSyDfgK4a6z5EW8yKbSkpYkwyLSM5Z-ChXOY",
    authDomain: "clickvote-2d2cd.firebaseapp.com",
    projectId: "clickvote-2d2cd",
    storageBucket: "clickvote-2d2cd.appspot.com",
    messagingSenderId: "686645402028",
    appId: "1:686645402028:web:d1ce3898329610a3d70209",
    measurementId: "G-BJ1X169QE5"
})

// Firestore
export const db = getFirestore(firebaseApp)

// Authentication
export const auth = getAuth(firebaseApp)

export default firebaseApp