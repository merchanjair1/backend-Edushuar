const lessonUseCases = require("../usecases/lessonUseCases")
const { success, error } = require("../utils/responseHandler")

exports.createLesson = async (req, res) => {
    try {
        const lesson = await lessonUseCases.createLesson(req.body)
        return success(res, { lesson }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.listLessons = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1
        const limit = parseInt(req.body.limit) || 10

        const result = await lessonUseCases.getAllLessons(page, limit)
        return success(res, result)
    } catch (e) {
        return error(res, e.message)
    }
}

exports.getLesson = async (req, res) => {
    try {
        const { id } = req.body
        const lesson = await lessonUseCases.getLessonById(id)
        if (!lesson) return error(res, "Lección no encontrada", 404)
        return success(res, { lesson })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.updateLesson = async (req, res) => {
    try {
        const { id, ...data } = req.body
        await lessonUseCases.updateLesson(id, data)
        return success(res, { message: "Lección actualizada" })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.deleteLesson = async (req, res) => {
    try {
        const { id } = req.body
        await lessonUseCases.deleteLesson(id)
        return success(res, { message: "Lección eliminada" })
    } catch (e) {
        return error(res, e.message)
    }
}
