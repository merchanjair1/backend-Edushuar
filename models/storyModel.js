class Story {
    constructor({ id = null, title, author, contentShuar, contentSpanish, coverImage }) {
        this.id = id
        this.title = title
        this.author = author
        this.contentShuar = contentShuar
        this.contentSpanish = contentSpanish
        this.coverImage = coverImage
    }
}

module.exports = Story

    