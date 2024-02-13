const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: [true, "User exists"],
        validate: [validator.isEmail, "Email should be of correct format"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select : false
    },
    confirmPassword: {
        type: String,
        required: [true, "Confirm password is required"],
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: "Both passwords should be the same"
        }
    },
    passwordChangeTime : Date,
    passwordResetToken : String,
    passwordResetExpire : Date,
    active : {
        type : Boolean,
        default : true,
        select : false
    }
});

userSchema.pre("save", async function(next){
    this.confirmPassword = undefined
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.pre("save", function(next){
    if(!this.isModified("password") || this.isNew) return next()
    this.passwordChangeTime = Date.now() - 1000
    next()
})

userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.passwordChange = function(jwtTokenTime) {  // again why i can't set this function to async
    if(this.passwordChangeTime) {
        //console.log(jwtTokenTime + " " + this.passwordChangeTime);
        return jwtTokenTime < Date.parse(this.passwordChangeTime)/1000
    }
    
    //console.log(jwtTokenTime + " " + newDate);
    return false
}

userSchema.methods.createPasswordResetToken = function() {
    console.log("hello");
    const resetToken = crypto.randomBytes(32).toString("hex")
    console.log(resetToken);
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    console.log(this.passwordResetToken);
    this.passwordResetExpire = Date.now() + 10*60*1000
    console.log("hello");
    return resetToken
}


const User = mongoose.model("User", userSchema);

module.exports = User;
