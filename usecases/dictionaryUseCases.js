const DictionaryRepository = require("../repositories/dictionaryRepository")
const DictionaryWord = require("../models/dictionaryModel")

exports.addWord = async ({ wordShuar, wordSpanish, category, examples }) => {
    const word = new DictionaryWord({ wordShuar, wordSpanish, category, examples })
    return await DictionaryRepository.save(word)
}

exports.getAllWords = async (page = 1, limit = 10) => {
    const { words, total } = await DictionaryRepository.findAll(page, limit)
    return {
        items: words,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

exports.searchWords = async (term, page = 1, limit = 10) => {
    const allWords = await DictionaryRepository.findByWord(term)

    let filtered = allWords
    if (term) {
        const lowerTerm = term.toLowerCase()
        filtered = allWords.filter(w =>
            w.wordShuar.toLowerCase().includes(lowerTerm) ||
            w.wordSpanish.toLowerCase().includes(lowerTerm)
        )
    }

    // Manual Pagination for Search
    const total = filtered.length
    const start = (page - 1) * limit
    const paginatedItems = filtered.slice(start, start + limit)

    return {
        items: paginatedItems,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

exports.updateWord = async (id, data) => {
    return await DictionaryRepository.update(id, data)
}

exports.deleteWord = async (id) => {
    return await DictionaryRepository.delete(id)
}
