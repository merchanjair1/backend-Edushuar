const { db } = require("../config/firebase");
const Contribution = require("../models/contributionModel");

class ContributionRepository {
    async save(contribution) {
        const docRef = await db.collection("contributions").add({
            userId: contribution.userId,
            type: contribution.type,
            status: contribution.status,
            data: contribution.data,
            createdAt: contribution.createdAt instanceof Date ? contribution.createdAt : new Date(contribution.createdAt)
        });
        contribution.id = docRef.id;
        return contribution;
    }

    async findAll(filters = {}) {
        let query = db.collection("contributions");

        if (filters.status) {
            query = query.where("status", "==", filters.status);
        }
        if (filters.type) {
            query = query.where("type", "==", filters.type);
        }
        if (filters.userId) {
            query = query.where("userId", "==", filters.userId);
        }

        const snap = await query.orderBy("createdAt", "desc").get();
        return snap.docs.map(doc => new Contribution({ id: doc.id, ...doc.data() }));
    }

    async findById(id) {
        const doc = await db.collection("contributions").doc(id).get();
        if (!doc.exists) return null;
        return new Contribution({ id: doc.id, ...doc.data() });
    }

    async update(id, data) {
        if (data.createdAt && data.createdAt instanceof Date) {
            // Firestore handles Dates, but we want to be safe
        }
        await db.collection("contributions").doc(id).update(data);
    }

    async delete(id) {
        await db.collection("contributions").doc(id).delete();
    }
}

module.exports = new ContributionRepository();
