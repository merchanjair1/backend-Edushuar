const { db, admin } = require("../config/firebase")
const DictionaryWord = require("../models/dictionaryModel")

class DictionaryRepository {
    async save(word) {
        const docRef = await db.collection("dictionary").add({
            wordShuar: word.wordShuar,
            wordSpanish: word.wordSpanish,
            category: word.category,
            examples: word.examples,
            image: word.image || null,
            imageDescription: word.imageDescription || "",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        })
        word.id = docRef.id
        word.createdAt = new Date()
        return word
    }

    async findAll(page = 1) {
        const snap = await db.collection("dictionary").get()
        const total = snap.size
        const words = snap.docs.map(d => {
            const data = d.data()
            const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
            return new DictionaryWord({ id: d.id, ...data, createdAt })
        })
        return { words, total }
    }

    async findByWord(term) {
        const snap = await db.collection("dictionary").get()
        return snap.docs.map(d => {
            const data = d.data()
            const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
            return new DictionaryWord({ id: d.id, ...data, createdAt })
        })
    }

    async findById(id) {
        const doc = await db.collection("dictionary").doc(id).get()
        if (!doc.exists) return null
        const data = doc.data()
        const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt
        return new DictionaryWord({ id: doc.id, ...data, createdAt })
    }

    async update(id, data) {
        await db.collection("dictionary").doc(id).update(data)
    }

    async delete(id) {
        await db.collection("dictionary").doc(id).delete()
    }
}

module.exports = new DictionaryRepository()
