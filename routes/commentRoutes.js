const express = require("express")
const router = express.Router({mergeParams : true})

const authController = require("./../controllers/authController")
const commentController = require("./../controllers/commentController")

router.route("/").post(authController.protect, commentController.createComment)

router.route("/:commentId").delete(authController.protect, authController.isAuthorOfComment, commentController.deleteComment)

module.exports = router