const LessonRepository = require("../repositories/lessonRepository")
const Lesson = require("../models/lessonModel")

exports.createLesson = async (data) => {
    const lesson = new Lesson(data)
    return await LessonRepository.save(lesson)
}

exports.getAllLessons = async (page = 1) => {
    const { lessons, total } = await LessonRepository.findAll()
    return {
        items: lessons,
        pagination: {
            total,
            page: parseInt(page),
            totalPages: 1
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

exports.createLessonsBulk = async (dataArray) => {
    const lessons = dataArray.map(data => new Lesson(data))
    return await LessonRepository.bulkSave(lessons)
}
