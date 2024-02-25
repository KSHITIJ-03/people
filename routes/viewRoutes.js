const express = require("express")
const viewController = require("./../controllers/viewController")
const authController = require("./../controllers/authController")
const router = express.Router()

router.use(authController.isLogin)

router.route("/overview").get(viewController.getAllUsers)
router.route("/user/:username").get(authController.protect, viewController.getUser)
router.route("/login").get(viewController.login)
router.route("/signup").get(viewController.signup)
module.exports = router