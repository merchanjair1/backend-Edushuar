const lessonUseCases = require("../usecases/lessonUseCases")
const { success, error } = require("../utils/responseHandler")
const { uploadBase64 } = require("../utils/uploadHandler")

exports.createLesson = async (req, res) => {
    try {
        console.log("Create Lesson Body:", req.body)
        const lessonData = { ...req.body }

        // Handle Base64 Image
        if (lessonData.image) {
            lessonData.image = await uploadBase64(lessonData.image)
        }

        // Ensure numeric fields are numbers
        if (lessonData.order) lessonData.order = parseInt(lessonData.order)
        if (lessonData.duration) lessonData.duration = parseInt(lessonData.duration)
        if (lessonData.totalPoints) lessonData.totalPoints = parseInt(lessonData.totalPoints)

        const lesson = await lessonUseCases.createLesson(lessonData)
        return success(res, { lesson }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.listLessons = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1

        const result = await lessonUseCases.getAllLessons(page)
        return success(res, result)
    } catch (e) {
        return error(res, e.message)
    }
}

exports.getLesson = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return error(res, "Se requiere el ID de la lección", 400)
        const lesson = await lessonUseCases.getLessonById(id)
        if (!lesson) return error(res, "Lección no encontrada", 404)
        return success(res, { lesson })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.updateLesson = async (req, res) => {
    try {
        const { id, ...updateData } = req.body

        // Handle Base64 Image
        if (updateData.image) {
            updateData.image = await uploadBase64(updateData.image)
        }

        // Ensure numeric fields are numbers
        if (updateData.order) updateData.order = parseInt(updateData.order)
        if (updateData.duration) updateData.duration = parseInt(updateData.duration)
        if (updateData.totalPoints) updateData.totalPoints = parseInt(updateData.totalPoints)

        await lessonUseCases.updateLesson(id, updateData)
        const updatedLesson = await lessonUseCases.getLessonById(id)
        return success(res, { message: "Lección actualizada", lesson: updatedLesson })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.deleteLesson = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return error(res, "Se requiere el ID de la lección", 400)
        await lessonUseCases.deleteLesson(id)
        return success(res, { message: "Lección eliminada" })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.createLessonsBulk = async (req, res) => {
    try {
        const lessonsData = req.body // Expecting an array
        if (!Array.isArray(lessonsData)) return error(res, "Se requiere un arreglo de lecciones", 400)

        const processedLessons = await Promise.all(lessonsData.map(async (data) => {
            if (data.image) {
                data.image = await uploadBase64(data.image)
            }
            // Ensure numeric fields are numbers
            if (data.order) data.order = parseInt(data.order)
            if (data.duration) data.duration = parseInt(data.duration)
            if (data.totalPoints) data.totalPoints = parseInt(data.totalPoints)
            return data
        }))

        const result = await lessonUseCases.createLessonsBulk(processedLessons)
        return success(res, { lessons: result }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}
