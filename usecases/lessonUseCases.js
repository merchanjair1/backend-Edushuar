const LessonRepository = require("../repositories/lessonRepository")
const Lesson = require("../models/lessonModel")

exports.createLesson = async (data) => {
    const lesson = new Lesson(data)
    return await LessonRepository.save(lesson)
}

exports.getAllLessons = async (page = 1, limit = 10) => {
    const { lessons, total } = await LessonRepository.findAll(page, limit)
    return {
        items: lessons,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        }
    }
}

exports.getLessonById = async (id) => {
    return await LessonRepository.findById(id)
}

exports.updateLesson = async (id, data) => {
    return await LessonRepository.update(id, data)
}

exports.deleteLesson = async (id) => {
    return await LessonRepository.delete(id)
}
