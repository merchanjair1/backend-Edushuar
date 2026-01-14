const ProgressRepository = require("../repositories/progressRepository")
const Progress = require("../models/progressModel")

const { PROGRESS_STATUS } = require("../config/constants")

exports.updateProgress = async ({ userId, lessonId, status, score }) => {
    // Validate status if needed
    if (status && !Object.values(PROGRESS_STATUS).includes(status)) {
        throw new Error("Estado inválido")
    }

    const progress = new Progress({ userId, lessonId, status, score })
    return await ProgressRepository.save(progress)
}

exports.getUserProgress = async (userId, page = 1, limit = 10) => {
    const { progressList, total } = await ProgressRepository.findByUser(userId, page, limit)
    return {
        items: progressList,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

exports.getLessonProgress = async (userId, lessonId) => {
    return await ProgressRepository.findByUserAndLesson(userId, lessonId)
}
