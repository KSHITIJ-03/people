const express = require("express")
const userController = require("./../controllers/userController")
const authController = require("./../controllers/authController")
const router = express.Router()

console.log("hello");

router.route("/").get(authController.protect, userController.getAllUsers)

router.route("/signup").post(authController.signup)

router.route("/login").post(authController.login)

router.route("/updatePassword").post(authController.protect, authController.updatePassword)

router.route("/forgotPassword").post(authController.forgotPassword)

router.route("/resetPassword/:token").post(authController.resetPassword)

module.exports = router
