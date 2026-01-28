const { db } = require("../config/firebase")
const Lesson = require("../models/lessonModel")

class LessonRepository {
    async save(lesson) {
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
            order: lesson.order || 0
        })
        lesson.id = docRef.id
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
        return new Lesson({ id: doc.id, ...doc.data() })
    }

    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit
        const countSnap = await db.collection("lessons").count().get()
        const total = countSnap.data().count

        const snap = await db.collection("lessons").offset(offset).limit(limit).get()
        const lessons = snap.docs.map(d => new Lesson({ id: d.id, ...d.data() }))
        return { lessons, total }
    }

    async findById(id) {
        const doc = await db.collection("lessons").doc(id).get()
        if (!doc.exists) return null
        return new Lesson({ id: doc.id, ...doc.data() })
    }

    async update(id, data) {
        await db.collection("lessons").doc(id).update(data)
    }

    async delete(id) {
        await db.collection("lessons").doc(id).delete()
    }
}

module.exports = new LessonRepository()
