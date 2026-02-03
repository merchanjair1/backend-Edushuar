const progressUseCases = require("../usecases/progressUseCases")
const { success, error } = require("../utils/responseHandler")

exports.updateProgress = async (req, res) => {
    try {
        const { userId, lessonId, status, score, percentage } = req.body
        if (!userId || !lessonId) return error(res, "Faltan datos (userId, lessonId)", 400)

        const progress = await progressUseCases.updateProgress({ userId, lessonId, status, score, percentage })
        return success(res, { message: "Progreso actualizado", progress })
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.getGeneralProgress = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) return error(res, "Faltan datos (userId)", 400)

        const result = await progressUseCases.getGeneralProgress(userId)
        return success(res, result)
    } catch (e) {
        return error(res, e.message)
    }
}

exports.listProgress = async (req, res) => {
    try {
        const { userId, page } = req.body
        if (!userId) return error(res, "Faltan datos (userId)", 400)

        const p = parseInt(page) || 1

        const result = await progressUseCases.getUserProgress(userId, p)
        return success(res, result)
    } catch (e) {
        return error(res, e.message)
    }
}

exports.getProgress = async (req, res) => {
    try {
        const { userId, lessonId } = req.body
        if (!userId || !lessonId) return error(res, "Faltan datos (userId, lessonId)", 400)

        const progress = await progressUseCases.getLessonProgress(userId, lessonId)
        return success(res, { progress: progress || null }) // Returns null if not started
    } catch (e) {
        return error(res, e.message)
    }
}
