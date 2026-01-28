const lessonUseCases = require("../usecases/lessonUseCases")
const { success, error } = require("../utils/responseHandler")

exports.createLesson = async (req, res) => {
    try {
        console.log("Headers:", req.headers['content-type'])
        console.log("Create Lesson Body:", req.body)
        const data = req.body

        let lessonData = { ...req.body }

        // Case 1: Multipart/Form-Data (Image is a file)
        if (req.file) {
            lessonData.image = req.file.path
            // In multipart, complex fields might imply 'data' string parsing
            if (req.body.data && typeof req.body.data === 'string') {
                try {
                    const parsedData = JSON.parse(req.body.data)
                    lessonData = { ...lessonData, ...parsedData }
                } catch (e) { console.error("Error parsing data field", e) }
                delete lessonData.data
            }
        }

        // Case 2: Raw JSON (Image is a URL string, content/exercises are objects)
        // No special handling needed for image/content if they are already in req.body
        // verify content/exercises are objects if they came as strings in JSON? unlikely if raw json.

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
        const { id, data, ...restBody } = req.body

        // Handle multipart/form-data with potential 'data' JSON string
        let updateData = {}
        if (data) {
            updateData = typeof data === 'string' ? JSON.parse(data) : data
        } else {
            updateData = { ...restBody }
        }

        if (req.file) {
            updateData.image = req.file.path
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
        await lessonUseCases.deleteLesson(id)
        return success(res, { message: "Lección eliminada" })
    } catch (e) {
        return error(res, e.message)
    }
}
