class Lesson {
    constructor({ id = null, title, level, description = "", duration = 0, totalPoints = 0, content = {}, exercises = [] }) {
        this.id = id
        this.title = title
        this.level = level
        this.description = description
        this.duration = duration
        this.totalPoints = totalPoints
        this.content = content
        this.exercises = exercises
    }
}

module.exports = Lesson
