class Story {
    constructor({ id = null, title_español, title_shuar, author, contentShuar, contentSpanish, coverImage, category}) {
        this.id = id
        this.title_español = title_español
        this.title_shuar = title_shuar
        this.author = author
        this.contentShuar = contentShuar
        this.contentSpanish = contentSpanish
        this.coverImage = coverImage
        this.category = category
    }
}

module.exports = Story

    