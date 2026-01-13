const admin = require("firebase-admin")
const path = require("path")
require("dotenv").config()

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY
} = process.env

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error("Faltan variables de entorno de Firebase (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)")
}

const serviceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  // Replace escaped newlines if present (common issue in deployments)
  privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

console.log("Firebase conectado correctamente")

const db = admin.firestore()

module.exports = { admin, db }
