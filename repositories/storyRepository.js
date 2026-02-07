const { db, admin } = require("../config/firebase")
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
            imageDescription: story.imageDescription || "",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }

        // Sanitize to remove undefined
        const sanitizedData = JSON.parse(JSON.stringify(storyData));

        const docRef = await db.collection("stories").add(sanitizedData)
        story.id = docRef.id
        story.createdAt = new Date()
        return story
    }

    async findAll(page = 1) {
        const snap = await db.collection("stories").get()
        const total = snap.size
        const stories = snap.docs.map(d => {
            const data = d.data()
            const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
            return new Story({ id: d.id, ...data, createdAt })
        })
        return { stories, total }
    }

    async findById(id) {
        const doc = await db.collection("stories").doc(id).get()
        if (!doc.exists) return null
        const data = doc.data()
        const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
        return new Story({ id: doc.id, ...data, createdAt })
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
    async bulkSave(stories) {
        const batch = db.batch()
        const savedStories = []

        stories.forEach(story => {
            const docRef = db.collection("stories").doc()
            const storyData = {
                title_español: story.title_español || null,
                title_shuar: story.title_shuar || null,
                category: story.category || null,
                author: story.author || null,
                contentShuar: story.contentShuar || null,
                contentSpanish: story.contentSpanish || null,
                coverImage: story.coverImage || null,
                imageDescription: story.imageDescription || "",
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            }
            const sanitizedData = JSON.parse(JSON.stringify(storyData))
            batch.set(docRef, sanitizedData)

            story.id = docRef.id
            story.createdAt = new Date()
            savedStories.push(story)
        })

        await batch.commit()
        return savedStories
    }
}

module.exports = new StoryRepository()
