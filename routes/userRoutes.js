const express = require("express")
const multer = require("multer")
const userController = require("./../controllers/userController")
const authController = require("./../controllers/authController")
const imageController = require("./../controllers/imageController")
const requestController = require("./../controllers/requestController")
const router = express.Router()

const socketLogic = require("./../controllers/socketController")
const io = require("./../server")

const upload = multer({dest : "public/img/users"})

//router.use(socketLogic(io))

router.route("/").get(authController.protect, userController.getAllUsers)

router.route("/signup").post(authController.signup)

router.route("/login").post(authController.login)

router.route("/logout").get(authController.logout)

router.route("/updatePassword").post(authController.protect, authController.updatePassword)

router.route("/forgotPassword").post(authController.forgotPassword)

router.route("/resetPassword/:token").post(authController.resetPassword)

router.route("/deleteMe").delete(authController.protect, userController.deleteUser)

router.route("/updateMe").patch(authController.protect, imageController.uploadUserDp, imageController.resizePhoto, userController.updateMe)

router.route("/search").get(userController.searchUsers)

router.route("/me").get(authController.protect, userController.getUser)

// follow
router.route("/:userId/follow").get(authController.protect, userController.followUser)

//feed
router.route("/feed").get(authController.protect, userController.userFeed)

// -------------- follow requests -------------------- //

router.route("/:userId/followRequest").post(authController.protect, requestController.createFollowRequest)

router.route("/:userId/followRequest").delete(authController.protect, requestController.deleteFollowRequest)

module.exports = router
