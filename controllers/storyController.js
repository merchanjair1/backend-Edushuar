const storyUseCases = require("../usecases/storyUseCases")
const { success, error } = require("../utils/responseHandler")

exports.createStory = async (req, res) => {
    try {
        const data = req.body
        if (req.file) {
            data.coverImage = req.file.path
        }
        const story = await storyUseCases.createStory(data)
        return success(res, { story }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.listStories = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1
        const limit = parseInt(req.body.limit) || 10

        const result = await storyUseCases.getAllStories(page, limit)
        return success(res, result)
    } catch (e) {
        return error(res, e.message)
    }
}

exports.getStory = async (req, res) => {
    try {
        const { id } = req.body
        const story = await storyUseCases.getStoryById(id)
        if (!story) return error(res, "Cuento no encontrado", 404)
        return success(res, { story })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.updateStory = async (req, res) => {
    try {
        const { id, ...bodyData } = req.body
        const data = bodyData
        if (req.file) {
            data.coverImage = req.file.path
        }
        await storyUseCases.updateStory(id, data)
        const updatedStory = await storyUseCases.getStoryById(id)
        return success(res, { message: "Cuento actualizado", story: updatedStory })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.deleteStory = async (req, res) => {
    try {
        const { id } = req.body
        await storyUseCases.deleteStory(id)
        return success(res, { message: "Cuento eliminado" })
    } catch (e) {
        return error(res, e.message)
    }
}
