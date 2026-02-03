const contributionRepository = require("../repositories/contributionRepository");
const dictionaryRepository = require("../repositories/dictionaryRepository");
const storyRepository = require("../repositories/storyRepository");
const userRepository = require("../repositories/userRepository");
const contributionHistoryRepository = require("../repositories/contributionHistoryRepository");
const Contribution = require("../models/contributionModel");
const ContributionHistory = require("../models/contributionHistoryModel");

class ContributionUseCases {
    async createContribution(data) {
        const { userId, type, content } = data;
        if (!userId || !type || !content) {
            throw new Error("Missing required fields: userId, type, content");
        }

        // Fetch user name and photo
        let userName = "Usuario Desconocido";
        let userPhoto = null;
        const user = await userRepository.findById(userId);
        if (user) {
            userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Usuario";
            userPhoto = user.photoProfile || null;
        }

        const contribution = new Contribution({
            userId,
            userName,
            userPhoto,
            type,
            data: content,
            status: "pending"
        });

        return await contributionRepository.save(contribution);
    }

    async listContributions(filters, page = 1) {
        const contributions = await contributionRepository.findAll(filters);

        // Hydrate details for older records that might be missing the denormalized userName/userPhoto
        await Promise.all(contributions.map(async (c) => {
            if (!c.userName || !c.userPhoto) {
                const user = await userRepository.findById(c.userId);
                if (user) {
                    if (!c.userName) {
                        c.userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Usuario";
                    }
                    if (!c.userPhoto) {
                        c.userPhoto = user.photoProfile || null;
                    }
                }
            }
        }));

        const total = contributions.length;
        return {
            items: contributions,
            pagination: {
                total,
                page: parseInt(page),
                totalPages: 1
            }
        };
    }

    async approveContribution(id) {
        const contribution = await contributionRepository.findById(id);
        if (!contribution) throw new Error("Contribution not found");
        if (contribution.status !== "pending") throw new Error("Contribution is already " + contribution.status);

        // Save to actual collection
        if (contribution.type === "dictionary") {
            await dictionaryRepository.save(contribution.data);
        } else if (contribution.type === "story") {
            await storyRepository.save(contribution.data);
        } else {
            throw new Error("Invalid contribution type");
        }

        // Update status
        await contributionRepository.update(id, { status: "approved" });

        // Local hydration for legacy records
        if (!contribution.userName || !contribution.userPhoto) {
            const user = await userRepository.findById(contribution.userId);
            if (user) {
                contribution.userName = contribution.userName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
                contribution.userPhoto = contribution.userPhoto || user.photoProfile;
            }
        }

        // Log history
        console.log(`DEBUG: Logging history for contribution ${id} - Status: approved`);

        // Sanitize data (remove undefineds, ensure plain object)
        const sanitizedData = JSON.parse(JSON.stringify(contribution.data || {}));

        const historyEntry = new ContributionHistory({
            contributionId: id,
            status: "approved",
            userName: contribution.userName,
            userPhoto: contribution.userPhoto,
            contributionData: sanitizedData
        });

        await contributionHistoryRepository.save(historyEntry);
        console.log(`DEBUG: History saved with ID: ${historyEntry.id}`);

        return { message: "Contribution approved and added to " + contribution.type };
    }

    async rejectContribution(id) {
        const contribution = await contributionRepository.findById(id);
        if (!contribution) throw new Error("Contribution not found");
        if (contribution.status !== "pending") throw new Error("Contribution is already " + contribution.status);

        await contributionRepository.update(id, { status: "rejected" });

        // Local hydration for legacy records
        if (!contribution.userName || !contribution.userPhoto) {
            const user = await userRepository.findById(contribution.userId);
            if (user) {
                contribution.userName = contribution.userName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
                contribution.userPhoto = contribution.userPhoto || user.photoProfile;
            }
        }

        // Log history
        console.log(`DEBUG: Logging history for contribution ${id} - Status: rejected`);

        // Sanitize data (remove undefineds, ensure plain object)
        const sanitizedData = JSON.parse(JSON.stringify(contribution.data || {}));

        const historyEntry = new ContributionHistory({
            contributionId: id,
            status: "rejected",
            userName: contribution.userName,
            userPhoto: contribution.userPhoto,
            contributionData: sanitizedData
        });

        await contributionHistoryRepository.save(historyEntry);
        console.log(`DEBUG: History saved with ID: ${historyEntry.id}`);

        return { message: "Contribution rejected" };
    }

    async listHistory() {
        const history = await contributionHistoryRepository.findAll();
        console.log(`DEBUG: Found ${history.length} history records`);
        return history;
    }

    async getContributionById(id) {
        return await contributionRepository.findById(id);
    }
}

module.exports = new ContributionUseCases();
