const router = require("express").Router()
const userController = require("../controllers/userController")
const dictionaryController = require("../controllers/dictionaryController")
const authController = require("../controllers/authController")
const lessonController = require("../controllers/lessonController")
const storyController = require("../controllers/storyController")

// Auth Routes
router.post("/login", authController.login)
router.post("/registre", authController.register)
router.post("/google-login", authController.googleLogin)

// User Routes
router.post("/list", userController.listUsers)
router.post("/get", userController.getUser)
router.post("/update", userController.updateUser)
router.post("/delete", userController.deleteUser)

// Dictionary Routes
router.get("/dictionary", dictionaryController.listWords) // Supports ?search=term
router.post("/dictionary", dictionaryController.addWord)
router.put("/dictionary/:id", dictionaryController.updateWord)
router.delete("/dictionary/:id", dictionaryController.deleteWord)

// Lesson Routes
router.get("/lessons", lessonController.listLessons)
router.get("/lessons/:id", lessonController.getLesson)
router.post("/lessons", lessonController.createLesson)
router.put("/lessons/:id", lessonController.updateLesson)
router.delete("/lessons/:id", lessonController.deleteLesson)

// Story Routes
router.get("/stories", storyController.listStories)
router.get("/stories/:id", storyController.getStory)
router.post("/stories", storyController.createStory)
router.put("/stories/:id", storyController.updateStory)
router.delete("/stories/:id", storyController.deleteStory)

module.exports = router
