const express = require('express');
const userController = require("../controllers/userController");
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");

const userRouter = express.Router();

//  PUBLIC — koi bhi
userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signUp);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);

// 🔐logged-in user 
userRouter.put("/updateProfile/:id", authenticateMiddleware, userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", authenticateMiddleware, userController.deleteUserProfile);

module.exports = userRouter;