const dictionaryUseCases = require("../usecases/dictionaryUseCases")
const { success, error } = require("../utils/responseHandler")

exports.addWord = async (req, res) => {
    try {
        const data = req.body
        if (req.file) {
            data.image = req.file.path
        }

        let wordData = { ...data }
        if (data.data && typeof data.data === 'string') {
            wordData = { ...JSON.parse(data.data), ...wordData }
            delete wordData.data
        }

        const word = await dictionaryUseCases.addWord(wordData)
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
