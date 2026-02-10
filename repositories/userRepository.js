const { db, admin } = require("../config/firebase")
const User = require("../models/userModel")

class UserRepository {

  async saveProfile(userEntity) {
    const firestoreData = {
      authId: userEntity.authId,
      email: userEntity.email,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      role: userEntity.role,
      photoProfile: userEntity.photoProfile,
      photoDescription: userEntity.photoDescription || "",
      birthdate: userEntity.birthdate ? admin.firestore.Timestamp.fromDate(new Date(userEntity.birthdate)) : null,
      status: userEntity.status,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }

    // Sanitize to remove undefined values
    const sanitizedData = JSON.parse(JSON.stringify(firestoreData))

    await db.collection("users").doc(userEntity.id).set(sanitizedData)
    return userEntity
  }

  async findById(id) {
    const doc = await db.collection("users").doc(id).get()
    if (!doc.exists) return null

    const data = doc.data()
    return new User({
      id: doc.id,
      ...data,
      birthdate: data.birthdate && data.birthdate.toDate ? data.birthdate.toDate() : data.birthdate,
      createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
    })
  }

  async findAll(page = 1) {
    const docsSnap = await db.collection("users")
      .orderBy('createdAt', 'desc')
      .get()

    const total = docsSnap.size
    const users = docsSnap.docs.map(d => {
      const data = d.data()
      return new User({
        id: d.id,
        ...data,
        birthdate: data.birthdate && data.birthdate.toDate ? data.birthdate.toDate() : data.birthdate,
        createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
      })
    })

    return { users, total }
  }

  async update(id, data) {
    if (data.birthdate) {
      data.birthdate = admin.firestore.Timestamp.fromDate(new Date(data.birthdate))
    }
    await db.collection("users").doc(id).update(data)
  }

  async delete(id) {
    await db.collection("users").doc(id).delete()
  }

  async bulkSaveProfiles(userEntities) {
    const batch = db.batch()
    const savedUsers = []

    userEntities.forEach(userEntity => {
      const docRef = db.collection("users").doc(userEntity.id)
      const firestoreData = {
        authId: userEntity.authId,
        email: userEntity.email,
        firstName: userEntity.firstName,
        lastName: userEntity.lastName,
        role: userEntity.role || "student",
        photoProfile: userEntity.photoProfile || null,
        photoDescription: userEntity.photoDescription || "",
        birthdate: userEntity.birthdate ? admin.firestore.Timestamp.fromDate(new Date(userEntity.birthdate)) : null,
        status: userEntity.status || "active",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }

      // Sanitize to remove undefined values
      const sanitizedData = JSON.parse(JSON.stringify(firestoreData))
      batch.set(docRef, sanitizedData)
      savedUsers.push(userEntity)
    })

    await batch.commit()
    return savedUsers
  }

}

module.exports = new UserRepository()
