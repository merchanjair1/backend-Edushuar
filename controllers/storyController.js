const storyUseCases = require("../usecases/storyUseCases")
const { success, error } = require("../utils/responseHandler")

exports.createStory = async (req, res) => {
    try {
        const story = await storyUseCases.createStory(req.body)
        return success(res, { story }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.listStories = async (req, res) => {
    try {
        const stories = await storyUseCases.getAllStories()
        return success(res, { stories })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.getStory = async (req, res) => {
    try {
        const { id } = req.params
        const story = await storyUseCases.getStoryById(id)
        if (!story) return error(res, "Cuento no encontrado", 404)
        return success(res, { story })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.updateStory = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        await storyUseCases.updateStory(id, data)
        return success(res, { message: "Cuento actualizado" })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.deleteStory = async (req, res) => {
    try {
        const { id } = req.params
        await storyUseCases.deleteStory(id)
        return success(res, { message: "Cuento eliminado" })
    } catch (e) {
        return error(res, e.message)
    }
}
