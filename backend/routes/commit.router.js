const express = require("express");
const { getCommitsByRepo } = require("../controllers/commitController");

const commitRouter = express.Router();

commitRouter.get("/commits/:repoId", getCommitsByRepo);

module.exports = commitRouter;