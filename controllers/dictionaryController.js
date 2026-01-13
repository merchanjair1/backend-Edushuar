const dictionaryUseCases = require("../usecases/dictionaryUseCases")
const { success, error } = require("../utils/responseHandler")

exports.addWord = async (req, res) => {
    try {
        const word = await dictionaryUseCases.addWord(req.body)
        return success(res, { word }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.listWords = async (req, res) => {
    try {
        const { search } = req.query 
        const words = search
            ? await dictionaryUseCases.searchWords(search)
            : await dictionaryUseCases.getAllWords()
        return success(res, { words })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.updateWord = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        await dictionaryUseCases.updateWord(id, data)
        return success(res, { message: "Palabra actualizada" })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.deleteWord = async (req, res) => {
    try {
        const { id } = req.params
        await dictionaryUseCases.deleteWord(id)
        return success(res, { message: "Palabra eliminada" })
    } catch (e) {
        return error(res, e.message)
    }
}
