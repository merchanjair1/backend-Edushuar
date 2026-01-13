const DictionaryRepository = require("../repositories/dictionaryRepository")
const DictionaryWord = require("../models/dictionaryModel")

exports.addWord = async ({ wordShuar, wordSpanish, category, examples }) => {
    const word = new DictionaryWord({ wordShuar, wordSpanish, category, examples })
    return await DictionaryRepository.save(word)
}

exports.getAllWords = async () => {
    return await DictionaryRepository.findAll()
}

exports.searchWords = async (term) => {
    const allWords = await DictionaryRepository.findByWord(term)
    if (!term) return allWords

    const lowerTerm = term.toLowerCase()
    return allWords.filter(w =>
        w.wordShuar.toLowerCase().includes(lowerTerm) ||
        w.wordSpanish.toLowerCase().includes(lowerTerm)
    )
}

exports.updateWord = async (id, data) => {
    return await DictionaryRepository.update(id, data)
}

exports.deleteWord = async (id) => {
    return await DictionaryRepository.delete(id)
}
