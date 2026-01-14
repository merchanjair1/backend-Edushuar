const progressUseCases = require("../usecases/progressUseCases")
const { success, error } = require("../utils/responseHandler")

exports.updateProgress = async (req, res) => {
    try {
        const { userId, lessonId, status, score } = req.body
        if (!userId || !lessonId) return error(res, "Faltan datos (userId, lessonId)", 400)

        const progress = await progressUseCases.updateProgress({ userId, lessonId, status, score })
        return success(res, { message: "Progreso actualizado", progress })
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.listProgress = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) return error(res, "Faltan datos (userId)", 400)

        const page = parseInt(req.body.page) || 1
        const limit = parseInt(req.body.limit) || 10

        const result = await progressUseCases.getUserProgress(userId, page, limit)
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
