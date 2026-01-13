class DictionaryWord {
    constructor({ id = null, wordShuar, wordSpanish, category, examples = [], image = null }) {
        this.id = id
        this.wordShuar = wordShuar
        this.wordSpanish = wordSpanish
        this.category = category
        this.examples = examples
        this.image = image
    }
}

module.exports = DictionaryWord
