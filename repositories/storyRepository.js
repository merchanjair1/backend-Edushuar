const { db } = require("../config/firebase")
const Story = require("../models/storyModel")

class StoryRepository {
    async save(story) {
        const docRef = await db.collection("stories").add({
            title: story.title,
            author: story.author,
            contentShuar: story.contentShuar,
            contentSpanish: story.contentSpanish,
            coverImage: story.coverImage
        })
        story.id = docRef.id
        return story
    }

    async findAll() {
        const snap = await db.collection("stories").get()
        return snap.docs.map(d => new Story({ id: d.id, ...d.data() }))
    }

    async findById(id) {
        const doc = await db.collection("stories").doc(id).get()
        if (!doc.exists) return null
        return new Story({ id: doc.id, ...doc.data() })
    }

    async update(id, data) {
        await db.collection("stories").doc(id).update(data)
    }

    async delete(id) {
        await db.collection("stories").doc(id).delete()
    }
}

module.exports = new StoryRepository()
