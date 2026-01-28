class Lesson {
    constructor({ id = null, title, level, description = "", duration = 0, totalPoints = 0, content = {}, exercises = [], image = null, imageDescription = "", order = 0 }) {
        this.id = id
        this.title = title
        this.level = level
        this.description = description
        this.duration = duration
        this.totalPoints = totalPoints
        this.content = content
        this.exercises = exercises
        this.image = image
        this.imageDescription = imageDescription
        this.order = order
    }
}

module.exports = Lesson
