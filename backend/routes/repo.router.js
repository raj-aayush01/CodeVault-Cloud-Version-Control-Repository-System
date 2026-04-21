const express = require('express')
const repoController = require("../controllers/repoController");
const { authenticateMiddleware } = require("../middleware/authenticateMiddleware");

const authorizeMiddleware = require("../middleware/authorizeMiddleware");

const repoRouter=express.Router()

// PUBLIC 
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);

// logged-in user — authenticate only
repoRouter.post("/repo/create", authenticateMiddleware, repoController.createRepository);

// Logged in + owner — authenticate + authorize 
repoRouter.put("/repo/update/:id", authenticateMiddleware, authorizeMiddleware, repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", authenticateMiddleware, authorizeMiddleware, repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", authenticateMiddleware, authorizeMiddleware, repoController.toggleVisibilityById);

module.exports = repoRouter;
module.exports= repoRouter;