class DictionaryWord {
    constructor({ id = null, wordShuar, wordSpanish, category, examples = [] }) {
        this.id = id
        this.wordShuar = wordShuar
        this.wordSpanish = wordSpanish
        this.category = category
        this.examples = examples
    }
}

module.exports = DictionaryWord
