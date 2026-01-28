const { db } = require("../config/firebase")
const DictionaryWord = require("../models/dictionaryModel")

class DictionaryRepository {
    async save(word) {
        const docRef = await db.collection("dictionary").add({
            wordShuar: word.wordShuar,
            wordSpanish: word.wordSpanish,
            category: word.category,
            examples: word.examples,
            image: word.image || null,
            imageDescription: word.imageDescription || ""
        })
        word.id = docRef.id
        return word
    }

    async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit
        const countSnap = await db.collection("dictionary").count().get()
        const total = countSnap.data().count

        const snap = await db.collection("dictionary").offset(offset).limit(limit).get()
        const words = snap.docs.map(d => new DictionaryWord({ id: d.id, ...d.data() }))
        return { words, total }
    }

    async findByWord(term) {
        // Basic search (case insensitive simulation would need explicit 'lowercase' fields in a real app, 
        // or client-side filtering. Firestore native search is limited.)
        // For now, doing broad match logic would likely happen in UseCase or client. 
        // Here we implement a basic 'getAll' because Firestore doesn't support 'contains'.
        const snap = await db.collection("dictionary").get() // Inefficient for large DBs, but fine for MVP
        return snap.docs.map(d => new DictionaryWord({ id: d.id, ...d.data() }))
    }

    async update(id, data) {
        await db.collection("dictionary").doc(id).update(data)
    }

    async delete(id) {
        await db.collection("dictionary").doc(id).delete()
    }
}

module.exports = new DictionaryRepository()
