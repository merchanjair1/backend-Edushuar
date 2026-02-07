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
        const { search, page } = req.body
        const p = parseInt(page) || 1

        const result = search
            ? await dictionaryUseCases.searchWords(search, p)
            : await dictionaryUseCases.getAllWords(p)
        return success(res, result)
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
        if (!id) return error(res, "Se requiere el ID de la palabra", 400)
        await dictionaryUseCases.deleteWord(id)
        return success(res, { message: "Palabra eliminada" })
    } catch (e) {
        return error(res, e.message)
    }
}

exports.getWord = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return error(res, "Se requiere el ID de la palabra", 400)
        const word = await dictionaryUseCases.getWordById(id)
        if (!word) return error(res, "Palabra no encontrada", 404)
        return success(res, { word })
    } catch (e) {
        return error(res, e.message, 400)
    }
}

exports.addWordsBulk = async (req, res) => {
    try {
        const wordsData = req.body // Expecting an array
        if (!Array.isArray(wordsData)) return error(res, "Se requiere un arreglo de palabras", 400)

        const processedWords = await Promise.all(wordsData.map(async (data) => {
            if (data.image) {
                data.image = await uploadBase64(data.image)
            }
            return data
        }))

        const result = await dictionaryUseCases.addWordsBulk(processedWords)
        return success(res, { words: result }, 201)
    } catch (e) {
        return error(res, e.message, 400)
    }
}
