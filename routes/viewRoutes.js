const express = require("express")
const viewController = require("./../controllers/viewController")
const authController = require("./../controllers/authController")
const router = express.Router()

//router.use(authController.isLogin)

router.route("/users").get(authController.isLogin, authController.protect, viewController.getAllUsers)

router.route("/user/:username").get(authController.isLogin, authController.protect, viewController.getUser)

router.route("/login").get(viewController.login)

router.route("/signup").get(viewController.signup)

router.route("/me").get(authController.protect, viewController.getMe)

router.route("/password-and-security").get(authController.protect, viewController.passwordAndSecurity)

module.exports = router