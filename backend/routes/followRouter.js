const express = require("express");
const { toggleFollow, getFollowData } = require("../controllers/followController");
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");

const followRouter = express.Router();

followRouter.patch("/follow/:userId", authenticateMiddleware, toggleFollow);


followRouter.get("/follow/:userId/data", getFollowData);

module.exports = followRouter;