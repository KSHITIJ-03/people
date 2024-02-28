const express = require("express")

const router = express.Router()

const postController = require("./../controllers/postController")
const authController = require("./../controllers/authController")
const imageController = require("./../controllers/imageController")

const commentRoutes = require("./commentRoutes")
const likeRoutes = require("./likeRoutes")

router.use("/:postId/likes", likeRoutes)

router.use("/:postId/comments", commentRoutes)

router.route("/").post(authController.protect, 
                       imageController.uploadPost, 
                       imageController.resizePhoto, 
                       postController.createPost)

router.route("/deletePost/:postId").delete(authController.protect, authController.isAuthor, postController.deletePost)

module.exports = router