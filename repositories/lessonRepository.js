const { db, admin } = require("../config/firebase")
const Lesson = require("../models/lessonModel")

class LessonRepository {
    async save(lesson) {
        // Always calculate order automatically based on the last one
        const maxOrderSnap = await db.collection("lessons").orderBy("order", "desc").limit(1).get()
        if (!maxOrderSnap.empty) {
            lesson.order = (maxOrderSnap.docs[0].data().order || 0) + 1
        } else {
            lesson.order = 1
        }

        const docRef = await db.collection("lessons").add({
            title: lesson.title,
            level: lesson.level,
            description: lesson.description || "",
            duration: lesson.duration || 0,
            totalPoints: lesson.totalPoints || 0,
            content: lesson.content || {},
            exercises: lesson.exercises || [],
            image: lesson.image || null,
            imageDescription: lesson.imageDescription || "",
            order: lesson.order,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        })
        lesson.id = docRef.id
        lesson.createdAt = new Date()
        return lesson
    }

    async findNextLesson(currentOrder) {
        const snap = await db.collection("lessons")
            .where("order", ">", currentOrder)
            .orderBy("order", "asc")
            .limit(1)
            .get()

        if (snap.empty) return null
        const doc = snap.docs[0]
        const data = doc.data()
        const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
        return new Lesson({ id: doc.id, ...data, createdAt })
    }

    async findAll(page = 1) {
        const snap = await db.collection("lessons").orderBy("order", "asc").get()
        const total = snap.size
        const lessons = snap.docs.map(d => {
            const data = d.data()
            const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
            return new Lesson({ id: d.id, ...data, createdAt })
        })
        return { lessons, total }
    }

    async findById(id) {
        const doc = await db.collection("lessons").doc(id).get()
        if (!doc.exists) return null
        const data = doc.data()
        const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
        return new Lesson({ id: doc.id, ...data, createdAt })
    }

    async update(id, data) {
        await db.collection("lessons").doc(id).update(data)
    }

    async delete(id) {
        await db.collection("lessons").doc(id).delete()
    }
}

module.exports = new LessonRepository()
