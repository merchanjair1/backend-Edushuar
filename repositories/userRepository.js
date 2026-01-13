const { db, admin } = require("../config/firebase")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const fetch = require("node-fetch") 
const SECRET_KEY = process.env.JWT_SECRET || "mi_super_secreto"

class UserRepository {

  async save(user) {
    try {
      const userRecord = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.username
      })

      await db.collection("users").doc(userRecord.uid).set({
        username: user.username,
        email: user.email,
        role: user.role,
        photoProfile: user.photoProfile || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })

      user.id = userRecord.uid

      const token = jwt.sign(
        { uid: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "7d" }
      )

      return { user, token }

    } catch (error) {
      throw new Error(error.message)
    }
  }

  async login(email, password) {
    try {
      const apiKey = process.env.FIREBASE_API_KEY
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      })
      const data = await response.json()

      if (data.error) throw new Error(data.error.message)

      const userDoc = await db.collection("users").doc(data.localId).get()
      if (!userDoc.exists) throw new Error("Usuario no encontrado")

      const user = { id: userDoc.id, ...userDoc.data() }

      const token = jwt.sign(
        { uid: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "7d" }
      )

      return { user, token }

    } catch (err) {
      throw new Error(err.message)
    }
  }

  async googleLogin(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken)
      const uid = decodedToken.uid

      let userDoc = await db.collection("users").doc(uid).get()
      let user

      if (!userDoc.exists) {
        await db.collection("users").doc(uid).set({
          username: decodedToken.name || "Sin nombre",
          email: decodedToken.email,
          role: "user",
          photoProfile: decodedToken.picture || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        })

        user = {
          id: uid,
          username: decodedToken.name || "Sin nombre",
          email: decodedToken.email,
          role: "user",
          photoProfile: decodedToken.picture || null
        }
      } else {
        user = { id: uid, ...userDoc.data() }
      }

      const token = jwt.sign(
        { uid, email: decodedToken.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "7d" }
      )

      return { user, token }

    } catch (err) {
      throw new Error("Token inválido de Google")
    }
  }

  async findById(id) {
    const doc = await db.collection("users").doc(id).get()
    if (!doc.exists) return null
    return new User({ id: doc.id, ...doc.data() })
  }

  async findAll() {
    const snap = await db.collection("users").get()
    return snap.docs.map(d => new User({ id: d.id, ...d.data() }))
  }

  
  async update(id, data) {
    await db.collection("users").doc(id).update(data)
  }

  async delete(id) {
    await admin.auth().deleteUser(id)
    await db.collection("users").doc(id).delete()
  }

}

module.exports = new UserRepository()
