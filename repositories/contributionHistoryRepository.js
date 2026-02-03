const { db, admin } = require("../config/firebase");
const ContributionHistory = require("../models/contributionHistoryModel");

class ContributionHistoryRepository {
    async save(history) {
        const data = {
            contributionId: history.contributionId,
            status: history.status,
            resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
            resolvedBy: history.resolvedBy || null,
            userName: history.userName || null,
            userPhoto: history.userPhoto || null,
            contributionData: history.contributionData || null
        };

        const docRef = await db.collection("contribution_history").add(data);
        history.id = docRef.id;
        return history;
    }

    async findAll() {
        const snap = await db.collection("contribution_history")
            .orderBy("resolvedAt", "desc")
            .get();

        return snap.docs.map(doc => {
            const data = doc.data();
            const resolvedAt = data.resolvedAt && data.resolvedAt.toDate ? data.resolvedAt.toDate() : data.resolvedAt;
            return new ContributionHistory({ id: doc.id, ...data, resolvedAt });
        });
    }

    async findByUserId(userId) {
        // This would require filtering history by a specific user if needed
        const snap = await db.collection("contribution_history")
            .where("userId", "==", userId)
            .orderBy("resolvedAt", "desc")
            .get();

        return snap.docs.map(doc => {
            const data = doc.data();
            const resolvedAt = data.resolvedAt && data.resolvedAt.toDate ? data.resolvedAt.toDate() : data.resolvedAt;
            return new ContributionHistory({ id: doc.id, ...data, resolvedAt });
        });
    }
}

module.exports = new ContributionHistoryRepository();
