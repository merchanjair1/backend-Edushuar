const contributionUseCases = require("../usecases/contributionUseCases");

class ContributionController {
    async createContribution(req, res) {
        try {
            const contribution = await contributionUseCases.createContribution(req.body);
            res.status(201).json(contribution);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async listContributions(req, res) {
        try {
            const contributions = await contributionUseCases.listContributions(req.body); // Using POST body for filters as per project style
            res.status(200).json(contributions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async approveContribution(req, res) {
        try {
            const { id } = req.body;
            const result = await contributionUseCases.approveContribution(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async rejectContribution(req, res) {
        try {
            const { id } = req.body;
            const result = await contributionUseCases.rejectContribution(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ContributionController();
