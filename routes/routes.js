const router = require("express").Router()
const userController = require("../controllers/userController")

router.post("/login", userController.login)
router.post("/registre", userController.createUser)
router.post("/list", userController.listUsers)
router.post("/get", userController.getUser)
router.post("/update", userController.updateUser)
router.post("/delete", userController.deleteUser)


module.exports = router
