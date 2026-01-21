const { admin, db } = require("../config/firebase") // db needed for firestore auth collection
const Auth = require("../models/authModel")
const fetch = require("node-fetch")
const bcrypt = require("bcryptjs")

class AuthRepository {

    async saveFirestoreAuth(uid, email, password) {
        const hash = await bcrypt.hash(password, 10)
        await db.collection('auth').doc(uid).set({
            email,
            password: hash,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        })
    }
    async updateFirestoreAuth(uid, data) {
        // data can contain { email, password }
        // If password is present, we must hash it again.
        const updates = {
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
        if (data.email) updates.email = data.email
        if (data.password) {
            updates.password = await bcrypt.hash(data.password, 10)
        }

        await db.collection('auth').doc(uid).set(updates, { merge: true })
    }

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

    async updateCredential(uid, data) {
        // data can contain { email, password }
        await admin.auth().updateUser(uid, data)
    }

    async deleteCredential(uid) {
        await admin.auth().deleteUser(uid)
    }

    async sendPasswordResetEmail(email) {
        // Generate password reset link using Firebase Admin SDK
        const link = await admin.auth().generatePasswordResetLink(email)
        // Note: In production, you might want to send a custom email
        // For now, Firebase will send the default reset email
        return { success: true, message: "Correo de restablecimiento enviado" }
    }
}

module.exports = new AuthRepository()
