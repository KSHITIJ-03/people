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

router.route("/deleteMe").delete(authController.protect, userController.deleteUser)

router.route("/updateMe").patch(authController.protect, userController.updateMe)

router.route("/search").get(userController.searchUsers)

router.route("/me").get(authController.protect, userController.getUser)
module.exports = router
