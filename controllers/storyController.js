const storyUseCases = require("../usecases/storyUseCases")
const { success, error } = require("../utils/responseHandler")
const { uploadBase64 } = require("../utils/uploadHandler")

exports.createStory = async (req, res) => {
    try {
        const storyData = { ...req.body }

        if (storyData.coverImage) {
            storyData.coverImage = await uploadBase64(storyData.coverImage)
        }

        const story = await storyUseCases.createStory(storyData)
        return success(res, { story }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.listStories = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1

        const result = await storyUseCases.getAllStories(page)
        return success(res, result)
    } catch (e) {
        return error(res, e.message)
    }
}

exports.getStory = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return error(res, "Se requiere el ID del cuento", 400)
        const story = await storyUseCases.getStoryById(id)
        if (!story) return error(res, "Cuento no encontrado", 404)
        return success(res, { story })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.updateStory = async (req, res) => {
    try {
        const { id, ...updateData } = req.body

        if (!id) return error(res, "Se requiere el ID del cuento para actualizar", 400)

        if (updateData.coverImage) {
            updateData.coverImage = await uploadBase64(updateData.coverImage)
        }

        await storyUseCases.updateStory(id, updateData)
        const updatedStory = await storyUseCases.getStoryById(id)
        return success(res, { message: "Cuento actualizado", story: updatedStory })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.deleteStory = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return error(res, "Se requiere el ID del cuento", 400)
        await storyUseCases.deleteStory(id)
        return success(res, { message: "Cuento eliminado" })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.createStoriesBulk = async (req, res) => {
    try {
        const storiesData = req.body // Expecting an array
        if (!Array.isArray(storiesData)) return error(res, "Se requiere un arreglo de cuentos", 400)

        const processedStories = await Promise.all(storiesData.map(async (data) => {
            if (data.coverImage) {
                data.coverImage = await uploadBase64(data.coverImage)
            }
            return data
        }))

        const result = await storyUseCases.createStoriesBulk(processedStories)
        return success(res, { stories: result }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}
