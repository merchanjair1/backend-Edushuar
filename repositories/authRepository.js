const { admin } = require("../config/firebase")
const Auth = require("../models/authModel")
const fetch = require("node-fetch")

class AuthRepository {

    async createCredential(email, password) {
        // Only creates the Auth credential
        const userRecord = await admin.auth().createUser({
            email,
            password
        })
        return new Auth({ uid: userRecord.uid, email: userRecord.email })
    }

    async signInWithEmail(email, password) {
        const apiKey = process.env.FIREBASE_API_KEY
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, returnSecureToken: true })
        })
        const data = await response.json()

        if (data.error) throw new Error(data.error.message)

        return { uid: data.localId, email: data.email }
    }

    async verifyGoogleToken(idToken) {
        const decoded = await admin.auth().verifyIdToken(idToken)
        return {
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture
        }
    }

    async deleteCredential(uid) {
        await admin.auth().deleteUser(uid)
    }
}

module.exports = new AuthRepository()
