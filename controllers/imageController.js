const multer = require("multer")
const sharp = require("sharp")

const multerStorage = multer.memoryStorage()

//multer filter that will pass error in cb if uploaded file is not a photo

const multerFilter = (req, file, cb) => {
     if(file.mimetype.startsWith("image")) {
        cb(null, true)
     } else {
        cb(new AppError("not an image please upload an image", 400), false)
     }
}

const upload = multer({
    storage : multerStorage,
    fileFilter : multerFilter
})

exports.resizePhoto = (req, res, next) => {

    if(!req.file) return next()

    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`

    sharp(req.file.buffer).resize(500, 500).toFormat("jpeg").toFile(`public/img/users/${req.file.filename}`)

    next()
}

exports.uploadUserDp = upload.single("displayPhoto")
exports.uploadPost = upload.single("photo")
