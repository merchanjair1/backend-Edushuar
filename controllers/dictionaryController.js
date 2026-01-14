const dictionaryUseCases = require("../usecases/dictionaryUseCases")
const { success, error } = require("../utils/responseHandler")

exports.addWord = async (req, res) => {
    try {
        const data = req.body
        if (req.file) {
            data.image = req.file.path
        }
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
        const { id, ...bodyData } = req.body
        const data = bodyData
        if (req.file) {
            data.image = req.file.path
        }
        await dictionaryUseCases.updateWord(id, data)
        return success(res, { message: "Palabra actualizada" })
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
