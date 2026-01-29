const dictionaryUseCases = require("../usecases/dictionaryUseCases")
const { success, error } = require("../utils/responseHandler")
const { uploadBase64 } = require("../utils/uploadHandler")

exports.addWord = async (req, res) => {
    try {
        const data = req.body

        if (data.image) {
            data.image = await uploadBase64(data.image)
        }

        console.log("DEBUG: Data handling to usecase:", data) // Temporary debug

        const word = await dictionaryUseCases.addWord(data)
        return success(res, { word }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.listWords = async (req, res) => {
    try {
        const { search, page, limit } = req.body
        const p = parseInt(page) || 1
        const l = parseInt(limit) || 10

        const result = search
            ? await dictionaryUseCases.searchWords(search, p, l)
            : await dictionaryUseCases.getAllWords(p, l)
        return success(res, result) // result contains { items, pagination }
    } catch (e) {
        return error(res, e.message)
    }
}

exports.updateWord = async (req, res) => {
    try {
        const { id, ...updateData } = req.body

        if (updateData.image) {
            updateData.image = await uploadBase64(updateData.image)
        }

        await dictionaryUseCases.updateWord(id, updateData)
        const updatedWord = await dictionaryUseCases.getWordById(id)
        return success(res, { message: "Palabra actualizada", word: updatedWord })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.deleteWord = async (req, res) => {
    try {
        const { id } = req.body
        await dictionaryUseCases.deleteWord(id)
        return success(res, { message: "Palabra eliminada" })
    } catch (e) {
        return error(res, e.message)
    }
}
