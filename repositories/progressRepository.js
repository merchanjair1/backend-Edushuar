const { db, admin } = require("../config/firebase")
const Progress = require("../models/progressModel")

class ProgressRepository {
    // Custom ID: userId_lessonId ensures one progress record per user per lesson
    async save(progress) {
        const docId = `${progress.userId}_${progress.lessonId}`
        const data = {
            userId: progress.userId,
            lessonId: progress.lessonId,
            status: progress.status,
            score: progress.score,
            percentage: progress.percentage,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }

        await db.collection("progress").doc(docId).set(data, { merge: true })
        return new Progress({ ...progress, updatedAt: new Date() })
    }

    async findByUser(userId, page = 1) {
        // Count total for this user
        const countSnap = await db.collection("progress").where("userId", "==", userId).count().get()
        const total = countSnap.data().count

        const snap = await db.collection("progress")
            .where("userId", "==", userId)
            // .orderBy("updatedAt", "desc") // Requires composite index
            .get()

        const progressList = snap.docs.map(d => new Progress(d.data()))
        return { progressList, total }
    }

    async findByUserAndLesson(userId, lessonId) {
        const docId = `${userId}_${lessonId}`
        const doc = await db.collection("progress").doc(docId).get()
        if (!doc.exists) return null
        return new Progress(doc.data())
    }
}

module.exports = new ProgressRepository()
