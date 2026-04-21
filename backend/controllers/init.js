const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/userModel");
require("dotenv").config();

async function initRepo(username, repoName) {
  const currentDir = process.cwd();
  const repoPath = path.resolve(currentDir, ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");
  
  try {
    
    await mongoose.connect(process.env.MONGO_URL);


    const user = await User.findOne({ username });

    if (!user) {
      console.log(`User "${username}" not found. Please signup first.`);
      return;
    }

    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({
        bucket: process.env.S3_BUCKET,
        userId: user._id.toString(),  
        username: username,           
        repoName
      }, null, 2) 
    );

    console.log(`Repository "${repoName}" initialized for user "${username}"!`);

  } catch (err) {
    console.error("Error initializing:", err.message);
  }
}

module.exports = { initRepo };