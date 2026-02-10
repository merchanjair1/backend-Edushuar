const router = require("express").Router()
const userController = require("../controllers/userController")
const dictionaryController = require("../controllers/dictionaryController")
const authController = require("../controllers/authController")
const lessonController = require("../controllers/lessonController")
const storyController = require("../controllers/storyController")
const progressController = require("../controllers/progressController")
const contributionController = require("../controllers/contributionController")
// const upload = require("../utils/uploadHandler") // Removed as we use Base64 now
const { validate } = require("../utils/validatorWrapper")

// Auth Routes
router.post("/login", validate(["email", "password"]), authController.login)
router.post("/registre", validate(["email", "password", "firstName", "lastName"]), authController.register)
router.post("/register-massive", authController.registerUsersMassive)
router.post("/google-login", validate(["idToken"]), authController.googleLogin)
router.post("/google-register", validate(["idToken"]), authController.googleRegister)
router.post("/reset-password", validate(["email"]), authController.requestPasswordReset)

// User Routes
router.post("/users/list", userController.listUsers)
router.post("/users/get", userController.getUser)
router.post("/users/update", userController.updateUser)
router.post("/users/create", validate(["email", "password", "firstName", "lastName"]), userController.createUser)
router.post("/users/bulk-create", userController.createUsersBulk)
router.post("/users/delete", userController.deleteUser)

// Dictionary Routes
router.post("/dictionary/list", dictionaryController.listWords)
router.post("/dictionary/get", dictionaryController.getWord)
router.post("/dictionary/create", dictionaryController.addWord)
router.post("/dictionary/bulk-create", dictionaryController.addWordsBulk)
router.post("/dictionary/update", dictionaryController.updateWord)
router.post("/dictionary/delete", dictionaryController.deleteWord)

// Lesson Routes
router.post("/lessons/list", lessonController.listLessons)
router.post("/lessons/get", lessonController.getLesson)
router.post("/lessons/create", lessonController.createLesson)
router.post("/lessons/bulk-create", lessonController.createLessonsBulk)
router.post("/lessons/update", lessonController.updateLesson)
router.post("/lessons/delete", lessonController.deleteLesson)

// Story Routes
router.post("/stories/list", storyController.listStories)
router.post("/stories/get", storyController.getStory)
router.post("/stories/create", storyController.createStory)
router.post("/stories/bulk-create", storyController.createStoriesBulk)
router.post("/stories/update", storyController.updateStory)
router.post("/stories/delete", storyController.deleteStory)

// Progress Routes
router.post("/progress/update", progressController.updateProgress)
router.post("/progress/list", progressController.listProgress)
router.post("/progress/get", progressController.getProgress)
router.post("/progress/general", progressController.getGeneralProgress)

// Contribution Routes
router.post("/contributions/create", contributionController.createContribution)
router.post("/contributions/list", contributionController.listContributions)
router.post("/contributions/get", contributionController.getContribution)
router.post("/contributions/approve", contributionController.approveContribution)
router.post("/contributions/reject", contributionController.rejectContribution)
router.post("/contributions/history", contributionController.listHistory)

module.exports = router
