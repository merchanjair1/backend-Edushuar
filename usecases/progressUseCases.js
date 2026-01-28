const ProgressRepository = require("../repositories/progressRepository")
const Progress = require("../models/progressModel")

const { PROGRESS_STATUS } = require("../config/constants")

const LessonRepository = require("../repositories/lessonRepository")

exports.updateProgress = async ({ userId, lessonId, status, score, percentage }) => {
    // Validate status if needed
    if (status && !Object.values(PROGRESS_STATUS).includes(status)) {
        throw new Error("Estado inválido")
    }

    const progress = new Progress({ userId, lessonId, status, score, percentage })
    const savedProgress = await ProgressRepository.save(progress)

    // Unlock next lesson if completed
    if (status === PROGRESS_STATUS.COMPLETED || percentage === 100) {
        const currentLesson = await LessonRepository.findById(lessonId)
        if (currentLesson) {
            const nextLesson = await LessonRepository.findNextLesson(currentLesson.order)
            if (nextLesson) {
                // Check if next lesson progress exists
                const existingNextProgress = await ProgressRepository.findByUserAndLesson(userId, nextLesson.id)
                if (!existingNextProgress || existingNextProgress.status === PROGRESS_STATUS.LOCKED || existingNextProgress.status === PROGRESS_STATUS.PENDING) {
                    // Unlock it
                    await ProgressRepository.save(new Progress({
                        userId,
                        lessonId: nextLesson.id,
                        status: PROGRESS_STATUS.UNLOCKED
                    }))
                }
            }
        }
    }

    return savedProgress
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

exports.getGeneralProgress = async (userId) => {
    const { total: totalLessons } = await LessonRepository.findAll(1, 1000) // Get all lessons count
    // This is approximate if > 1000 lessons. 

    // Count completed by user
    // Ideally repository should have countByStatus method. 
    // For now we can fetch user progress and filter.
    const { progressList } = await ProgressRepository.findByUser(userId, 1, 1000)
    const completedLessons = progressList.filter(p => p.status === PROGRESS_STATUS.COMPLETED || p.percentage === 100).length

    // Calculate total score
    const totalScore = progressList.reduce((acc, curr) => acc + (curr.score || 0), 0)

    const percentage = totalLessons > 0 ? ((completedLessons / totalLessons) * 100).toFixed(2) : 0

    return {
        totalLessons,
        completedLessons,
        percentage: parseFloat(percentage),
        totalScore
    }
}

exports.getLessonProgress = async (userId, lessonId) => {
    return await ProgressRepository.findByUserAndLesson(userId, lessonId)
}
