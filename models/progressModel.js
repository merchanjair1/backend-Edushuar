const { PROGRESS_STATUS } = require("../config/constants")

class Progress {
    constructor({ userId, lessonId, status = PROGRESS_STATUS.PENDING, score = 0, updatedAt = null }) {
        this.userId = userId
        this.lessonId = lessonId
        this.status = status
        this.score = score
        this.updatedAt = updatedAt
    }
}

module.exports = Progress
