const { db } = require("../config/firebase")
const Story = require("../models/storyModel")

class StoryRepository {
    async save(story) {
        const storyData = {
            title_español: story.title_español || null,
            title_shuar: story.title_shuar || null,
            category: story.category || null,
            author: story.author || null,
            contentShuar: story.contentShuar || null,
            contentSpanish: story.contentSpanish || null,
            coverImage: story.coverImage || null,
            imageDescription: story.imageDescription || ""
        }
        // Remove nulls if you prefer cleaning, or keep nulls. Firestore allows null.
        // But it throws on undefined.
        // We will stick to null defaulting.

        const docRef = await db.collection("stories").add(storyData)
        story.id = docRef.id
        return story
    }

    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit
        const countSnap = await db.collection("stories").count().get()
        const total = countSnap.data().count

        const snap = await db.collection("stories").offset(offset).limit(limit).get()
        const stories = snap.docs.map(d => new Story({ id: d.id, ...d.data() }))
        return { stories, total }
    }

    async findById(id) {
        const doc = await db.collection("stories").doc(id).get()
        if (!doc.exists) return null
        return new Story({ id: doc.id, ...doc.data() })
    }

    async update(id, data) {
        // Sanitize data to remove undefined or unexpected fields
        const cleanData = JSON.parse(JSON.stringify(data)); // Simple hack to remove undefined
        delete cleanData.title; // Explicitly remove title if it sneaks in

        await db.collection("stories").doc(id).update(cleanData)
    }

    async delete(id) {
        await db.collection("stories").doc(id).delete()
    }
}

module.exports = new StoryRepository()
