const { db } = require("../config/firebase")
const Lesson = require("../models/lessonModel")

class LessonRepository {
    async save(lesson) {
        const docRef = await db.collection("lessons").add({
            title: lesson.title,
            level: lesson.level,
            content: lesson.content,
            exercises: lesson.exercises
        })
        lesson.id = docRef.id
        return lesson
    }

    async findAll() {
        const snap = await db.collection("lessons").get()
        return snap.docs.map(d => new Lesson({ id: d.id, ...d.data() }))
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
