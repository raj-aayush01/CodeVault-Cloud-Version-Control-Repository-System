
const User = require("../models/userModel");
const Repository = require("../models/repoModel");

const toggleStar = async (req, res) => {
  try {
    const userId = req.user;
    const { repoId } = req.params;

    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const alreadyStarred = user.starRepos.some(
      (id) => id.toString() === repoId.toString()
    );


    if (alreadyStarred) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { starRepos: repoId } }
      );

      await Repository.findByIdAndUpdate(
        repoId,
        { $inc: { stars: -1 } } 
      );

      return res.status(200).json({ message: "Repository unstarred successfully" });

    } else {
      await User.findByIdAndUpdate(
        userId,
        { $push: { starRepos: repoId } }
      );

      // increase star count of repo by 1
      await Repository.findByIdAndUpdate(
        repoId,
        { $inc: { stars: 1 } }
      );

      return res.status(200).json({ message: "Repository starred successfully" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getStargazers = async (req, res) => {
  try {
    const { repoId } = req.params;

    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    
    const stargazers = await User.find(
      { starRepos: repoId }  
    ).select("-password");  

    res.status(200).json({
      stars: repo.stars,
      stargazers
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { toggleStar, getStargazers };