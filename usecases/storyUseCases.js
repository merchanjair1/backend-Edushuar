const StoryRepository = require("../repositories/storyRepository")
const Story = require("../models/storyModel")

exports.createStory = async ({ title_español, title_shuar, category, author, contentShuar, contentSpanish, coverImage }) => {
    const story = new Story({ title_español, title_shuar, category, author, contentShuar, contentSpanish, coverImage })
    return await StoryRepository.save(story)
}

exports.getAllStories = async (page = 1, limit = 10) => {
    const { stories, total } = await StoryRepository.findAll(page, limit)
    return {
        items: stories,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
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
