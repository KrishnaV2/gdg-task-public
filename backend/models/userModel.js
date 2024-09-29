const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "A username is required"]
    },
    password: {
        type: String,
        minLength: 8,
        required: [true, "A password is required"],
        select: false
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
})

const User = mongoose.model('User', UserSchema);
module.exports = User