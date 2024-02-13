const Like = require("./../models/likeModel")
const Post = require("./../models/postModel")

const {ObjectId} = require("bson")

exports.doLike = async (req, res) => {
    try {
        // let like = Like.findOne({post : req.params.postId})

        // if(like) {
        //     like.count = like.count + 1
        //     like.save()
        //     return res.status(201).json({
        //         status : "success",
        //         message : "like done",
        //         likesCount : like.count
        //     })
        // }


        const like = await Like.findOne({author : req.user._id.toHexString(), post : req.params.postId})

        //console.log(like);

        if(like) {
            await Like.findByIdAndDelete(like._id)
            const post = await Post.findByIdAndUpdate(req.params.postId, {$inc : {likes : -1}}, {runValidators : true})
            return res.status(201).json({
                status : "success",
                message : "like removed successfully"
            })
        }
        await Like.create({
            post : req.params.postId, 
            author : req.user._id
        })
        await Post.findByIdAndUpdate(req.params.postId, {$inc : {likes : 1}}, {runValidators : true})
        res.status(201).json({
            status : "success",
            message : "like done"
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

// exports.removeLike = async (req, res) => {
//     try {
//         await Like.findByIdAndDelete()
//         res.status(201).json({
//             status : "success",
//             message : "like done"
//         })
//     } catch(err) {
//         res.status(404).json({
//             status : "fail",
//             message : err
//         })
//     }
// }