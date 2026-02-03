const DictionaryRepository = require("../repositories/dictionaryRepository")
const DictionaryWord = require("../models/dictionaryModel")

exports.addWord = async (data) => {
    const word = new DictionaryWord(data)
    return await DictionaryRepository.save(word)
}

exports.getAllWords = async (page = 1) => {
    const { words, total } = await DictionaryRepository.findAll()
    return {
        items: words,
        pagination: {
            total,
            page: parseInt(page),
            totalPages: 1
        }
    }
}

exports.searchWords = async (term, page = 1) => {
    const allWords = await DictionaryRepository.findByWord(term)

    let filtered = allWords
    if (term) {
        const lowerTerm = term.toLowerCase()
        filtered = allWords.filter(w =>
            w.wordShuar.toLowerCase().includes(lowerTerm) ||
            w.wordSpanish.toLowerCase().includes(lowerTerm)
        )
    }

    const total = filtered.length
    return {
        items: filtered,
        pagination: {
            total,
            page: parseInt(page),
            totalPages: 1
        }
    }
}

exports.getWordById = async (id) => {
    return await DictionaryRepository.findById(id)
}

exports.updateWord = async (id, data) => {
    return await DictionaryRepository.update(id, data)
}

exports.deleteWord = async (id) => {
    return await DictionaryRepository.delete(id)
}
