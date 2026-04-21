const Repository = require("../models/repoModel");

const authorizeMiddleware = async (req, res, next) => {
  try {
    const loggedInUserId = req.user;

    const repoId = req.params.id;
    const repo = await Repository.findById(repoId);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ 
        message: "Access denied. You are not the owner of this repository." 
      });
    }

    next();

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = authorizeMiddleware;