const StoryRepository = require("../repositories/storyRepository")
const Story = require("../models/storyModel")

exports.createStory = async ({ title, author, contentShuar, contentSpanish, coverImage }) => {
    const story = new Story({ title, author, contentShuar, contentSpanish, coverImage })
    return await StoryRepository.save(story)
}

exports.getAllStories = async () => {
    return await StoryRepository.findAll()
}

exports.getStoryById = async (id) => {
    return await StoryRepository.findById(id)
}

exports.updateStory = async (id, data) => {
    return await StoryRepository.update(id, data)
}

exports.deleteStory = async (id) => {
    return await StoryRepository.delete(id)
}
