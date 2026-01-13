const admin = require("firebase-admin")
const path = require("path")
require("dotenv").config()

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

if (!serviceAccountPath) {
  throw new Error("Falta GOOGLE_APPLICATION_CREDENTIALS en el .env")
}

const serviceAccount = require(path.resolve(serviceAccountPath))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

console.log("Firebase conectado correctamente")

const db = admin.firestore()

module.exports = { admin, db }
