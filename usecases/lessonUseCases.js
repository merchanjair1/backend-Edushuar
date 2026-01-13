const LessonRepository = require("../repositories/lessonRepository")
const Lesson = require("../models/lessonModel")

exports.createLesson = async ({ title, level, content, exercises }) => {
    const lesson = new Lesson({ title, level, content, exercises })
    return await LessonRepository.save(lesson)
}

exports.getAllLessons = async () => {
    return await LessonRepository.findAll()
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
