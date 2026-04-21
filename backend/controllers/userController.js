const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const objectId = mongoose.Types.ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));



const signup = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const User = require("../models/userModel");
        const user = await User.findOne({ username });
        if(user){
            return res.status(400).json({ message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories : [],
            followedUsers : [],
            starRepos: [],
        }

        const newUserDoc = new User(newUser);
        await newUserDoc.save();

        const token = jwt.sign(
            {   id: newUserDoc._id },
                process.env.JWT_SECRET_KEY,
            {   expiresIn: "1h" }
        );

        res.json({token, userId: newUserDoc._id});

    } catch(err) {
        console.error("Error during signup : " , err.message );
        res.status(500).send("Server error");
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const User = require("../models/userModel");
        const user = await User.findOne({ email });

        if(!user ){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h" });
        res.json({ token, userId: user._id});

    } catch(err) {
        console.error("Error during login : ", err.message);
        res.status(500).send("Server error!");
    }
};

const getAllUsers = async (req, res) => {
    try{
        const User = require("../models/userModel");
        const users = await User.find({});
        res.json(users);

    } catch (err) {
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server error!");
    }
};

const getUserProfile = async (req, res) => {
    const currentID = req.params.id;

    try{
        const User = require("../models/userModel");
        const user = await User.findById(currentID).select("-password");

        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        res.json({
            message: "Profile fetched!",
            user: user
        });

    } catch(err) {
        console.error("Error during fetching user profile : ", err.message);
        res.status(500).send("Server error!");
    }
};

const updateUserProfile = async (req, res) => {
    const currentID = req.params.id;
    const { email, password } = req.body ;

    try {
        const User = require("../models/userModel");

        let updateFields = {};
        if (email) {
            updateFields.email = email;
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await User.findByIdAndUpdate(
            currentID,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if(!result){
            return res.status(400).json({ message: "User not found!" });
        }

        res.json(result);

    } catch(err) {
        console.error("Error during updating user profile : ", err.message);
        res.status(500).send("Server error!");
    }
};

const deleteUserProfile = async (req, res) => {
    const currentID = req.params.id;

    try {
        const User = require("../models/userModel");

        const result = await User.findByIdAndDelete(currentID);

        if (!result) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json({message: "User Profile Deleted!"});

    } catch(err) {
        console.error("Error during deleting user profile : ", err.message);
        res.status(500).send("Server error!");
    }
};


module.exports = {
    getAllUsers, 
    signup, 
    login, 
    getUserProfile, 
    updateUserProfile, 
    deleteUserProfile
}