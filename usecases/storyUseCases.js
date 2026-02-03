const StoryRepository = require("../repositories/storyRepository")
const Story = require("../models/storyModel")

exports.createStory = async (data) => {
    const story = new Story(data)
    return await StoryRepository.save(story)
}

exports.getAllStories = async (page = 1) => {
    const { stories, total } = await StoryRepository.findAll()
    return {
        items: stories,
        pagination: {
            total,
            page: parseInt(page),
            totalPages: 1
        }
    }
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
