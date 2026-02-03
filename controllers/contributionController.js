const contributionUseCases = require("../usecases/contributionUseCases");
const { success, error } = require("../utils/responseHandler");

class ContributionController {
    async createContribution(req, res) {
        try {
            const contribution = await contributionUseCases.createContribution(req.body);
            return success(res, { contribution }, 201);
        } catch (e) {
            return error(res, e.message, 400);
        }
    }

    async listContributions(req, res) {
        try {
            const { page, ...filters } = req.body;
            const p = parseInt(page) || 1;
            const result = await contributionUseCases.listContributions(filters, p);
            return success(res, result);
        } catch (e) {
            return error(res, e.message, 400);
        }
    }

    async approveContribution(req, res) {
        try {
            const { id } = req.body;
            if (!id) return error(res, "Se requiere el ID de la contribución", 400);
            const result = await contributionUseCases.approveContribution(id);
            return success(res, result);
        } catch (e) {
            return error(res, e.message, 400);
        }
    }

    async rejectContribution(req, res) {
        try {
            const { id } = req.body;
            if (!id) return error(res, "Se requiere el ID de la contribución", 400);
            const result = await contributionUseCases.rejectContribution(id);
            return success(res, result);
        } catch (e) {
            return error(res, e.message, 400);
        }
    }

    async getContribution(req, res) {
        try {
            const { id } = req.body;
            if (!id) return error(res, "Se requiere el ID de la contribución", 400);
            const contribution = await contributionUseCases.getContributionById(id);
            if (!contribution) return error(res, "Contribución no encontrada", 404);
            return success(res, { contribution });
        } catch (e) {
            return error(res, e.message, 400);
        }
    }
}

module.exports = new ContributionController();
