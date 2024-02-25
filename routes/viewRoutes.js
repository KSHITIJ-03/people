const express = require("express")
const viewController = require("./../controllers/viewController")
const router = express.Router()

router.route("/overview").get(viewController.getAllUsers)
router.route("/user/:username").get(viewController.getUser)
router.route("/login").get(viewController.login)
router.route("/signup").get(viewController.signup)
module.exports = router