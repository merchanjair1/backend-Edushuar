const contributionRepository = require("../repositories/contributionRepository");
const dictionaryRepository = require("../repositories/dictionaryRepository");
const storyRepository = require("../repositories/storyRepository");
const Contribution = require("../models/contributionModel");

class ContributionUseCases {
    async createContribution(data) {
        const { userId, type, content } = data;
        if (!userId || !type || !content) {
            throw new Error("Missing required fields: userId, type, content");
        }

        const contribution = new Contribution({
            userId,
            type,
            data: content,
            status: "pending"
        });

        return await contributionRepository.save(contribution);
    }

    async listContributions(filters, page = 1) {
        const contributions = await contributionRepository.findAll(filters);
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
        return { message: "Contribution approved and added to " + contribution.type };
    }

    async rejectContribution(id) {
        const contribution = await contributionRepository.findById(id);
        if (!contribution) throw new Error("Contribution not found");
        if (contribution.status !== "pending") throw new Error("Contribution is already " + contribution.status);

        await contributionRepository.update(id, { status: "rejected" });
        return { message: "Contribution rejected" };
    }

    async getContributionById(id) {
        return await contributionRepository.findById(id);
    }
}

module.exports = new ContributionUseCases();
