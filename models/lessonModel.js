class Lesson {
    constructor({ id = null, title, level, content = {}, exercises = [] }) {
        this.id = id
        this.title = title
        this.level = level
        this.content = content
        this.exercises = exercises
    }
}

module.exports = Lesson
