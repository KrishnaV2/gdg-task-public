const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt")
const User = require("../models/userModel.js")

const usernameSchema = zod.string().email();
const passwordSchema = zod.string().min(8);

exports.validUser = async function (req, res, next) {
    try {
        // console.log("Checking Cookies")
        let token = req.cookies["Authorization"];
        if (!token)
            return res.status(403).json({ "status": "fail", "message": "Invalid Token, Unauthorized Access" })
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).json({ "status": "fail", "message": "User Not Found" });
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ "status": "fail", "message": "Invalid Token, Unauthorized Access" })
    };
}
exports.checkValid = async function (req, res) {
    try {
        // console.log("Checking Cookies")
        let token = req.cookies["Authorization"];
        if (!token)
            return res.status(403).json({ "status": "fail", "message": "Invalid Token, Unauthorized Access" })
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).json({ "status": "fail", "message": "User Not Found" });
        return res.status(200).json({ "status": "success", "message": "User is Authenticated", "data": user });
    } catch (err) {
        console.log(err);
        return res.status(403).json({ "status": "fail", "message": "Invalid Token, Unauthorized Access" })
    };
}

exports.signup = async function (req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.json({ "status": "fail", "message": "Username and Password required for signin" })
        if (!usernameSchema.safeParse(username).success || !passwordSchema.safeParse(password).success)
            return res.status(400).json({ "status": "fail", "message": "Invalid email or password" });
        let user = await User.findOne({ username });
        // console.log(user)
        if (user) return res.status(400).json({ "status": "fail", "message": "User with email already exists" });
        user = new User({ username, password });
        await user.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie("Authorization", `Bearer ${token}`, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
            httpOnly: true,
            sameSite: "strict",
        })
        user.password = undefined;
        return res.status(201).json({ "status": "success", "data": user })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Signin Failed, Internal Server Error" })
    }
}

exports.signin = async function (req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.json({ "status": "fail", "message": "Username and Password required for signin" })
        if (!usernameSchema.safeParse(username).success || !passwordSchema.safeParse(password).success)
            return res.status(400).json({ "status": "fail", "message": "Invalid email or password" });
        let user = await User.findOne({ username }).select('+password')
        // if (!user) return res.status(400).json({ "status": "fail", "message": "User does not exist" })

        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ "status": "fail", "message": "Invalid Credentials" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.cookie("Authorization", `Bearer ${token}`, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
            httpOnly: true,
            sameSite: "strict",
        })
        return res.status(201).json({ "status": "success", token })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Signin Failed, Internal Server Error" })
    }
}

exports.logout = function (req, res) {
    try {
        res.clearCookie("Authorization");
        return res.status(200).json({ "status": "success", "message": "Logged out successfully" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "fail", "message": "Internal Server Error" })
    }
}