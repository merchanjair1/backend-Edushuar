const router = require("express").Router()
const userController = require("../controllers/userController")
const dictionaryController = require("../controllers/dictionaryController")
const authController = require("../controllers/authController")
const lessonController = require("../controllers/lessonController")
const storyController = require("../controllers/storyController")
const upload = require("../utils/uploadHandler")
const { validate } = require("../utils/validatorWrapper")

// Auth Routes
router.post("/login", validate(["email", "password"]), authController.login)
router.post("/registre", validate(["email", "password", "firstName", "lastName"]), authController.register)
router.post("/google-login", validate(["idToken"]), authController.googleLogin)
router.post("/google-register", validate(["idToken"]), authController.googleRegister)

// User Routes
router.post("/list", userController.listUsers)
router.post("/get", userController.getUser)
router.post("/update", upload.single("photoProfile"), userController.updateUser)
router.post("/create", upload.single("photoProfile"), validate(["email", "password", "firstName", "lastName"]), userController.createUser)
router.post("/delete", userController.deleteUser)

// Dictionary Routes
router.post("/dictionary/list", dictionaryController.listWords)
router.post("/dictionary/create", upload.single("image"), dictionaryController.addWord)
router.post("/dictionary/update", upload.single("image"), dictionaryController.updateWord)
router.post("/dictionary/delete", dictionaryController.deleteWord)

// Lesson Routes
router.post("/lessons/list", lessonController.listLessons)
router.post("/lessons/get", lessonController.getLesson)
router.post("/lessons/create", lessonController.createLesson)
router.post("/lessons/update", lessonController.updateLesson)
router.post("/lessons/delete", lessonController.deleteLesson)

// Story Routes
router.post("/stories/list", storyController.listStories)
router.post("/stories/get", storyController.getStory)
router.post("/stories/create", upload.single("coverImage"), storyController.createStory)
router.post("/stories/update", upload.single("coverImage"), storyController.updateStory)
router.post("/stories/delete", storyController.deleteStory)

module.exports = router
