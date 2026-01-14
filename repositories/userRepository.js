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
      birthdate: userEntity.birthdate ? admin.firestore.Timestamp.fromDate(new Date(userEntity.birthdate)) : null,
      status: userEntity.status,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }

    await db.collection("users").doc(userEntity.id).set(firestoreData)
    return userEntity
  }

  async findById(id) {
    const doc = await db.collection("users").doc(id).get()
    if (!doc.exists) return null

    const data = doc.data()
    return new User({
      id: doc.id,
      ...data,
      birthdate: data.birthdate ? data.birthdate.toDate() : null
    })
  }

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit

    // Get Total Count
    const snapshot = await db.collection("users").count().get()
    const total = snapshot.data().count

    // Get Paginated Docs
    const docsSnap = await db.collection("users")
      .orderBy('createdAt', 'desc') // Best practice for pagination
      .offset(offset)
      .limit(limit)
      .get()

    const users = docsSnap.docs.map(d => {
      const data = d.data()
      return new User({
        id: d.id,
        ...data,
        birthdate: data.birthdate ? data.birthdate.toDate() : null
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

}

module.exports = new UserRepository()
