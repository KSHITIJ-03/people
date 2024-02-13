const express = require("express")
const router = express.Router()

router.route("/").post((req, res) => {
    console.log(req.body);
    res.status(200).json({
        status : "success",
        message : "all good"
    })
})

router.route("/").get((req, res) => {
    console.log("hello");
    res.status(200).json({
        status : "success",
        message : "all good"
    })
})

module.exports = router