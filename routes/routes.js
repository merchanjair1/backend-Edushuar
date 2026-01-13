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
router.get("/dictionary", dictionaryController.listWords) // Supports ?search=term
router.post("/dictionary", upload.single("image"), dictionaryController.addWord)
router.put("/dictionary/:id", upload.single("image"), dictionaryController.updateWord)
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
router.post("/stories", upload.single("coverImage"), storyController.createStory)
router.put("/stories/:id", upload.single("coverImage"), storyController.updateStory)
router.delete("/stories/:id", storyController.deleteStory)

module.exports = router
