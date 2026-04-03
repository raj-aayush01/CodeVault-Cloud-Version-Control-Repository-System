const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");  // creating a path by appending .apnaGit folder inside backend folder
  const commitsPath = path.join(repoPath, "commits");        // creating path by appending commits folder inside .apnaGit folder

  try {
    await fs.mkdir(repoPath, { recursive: true });          // This will actually create .apnaGit folder,   Location --->  backend/.apnaGit 
    await fs.mkdir(commitsPath, { recursive: true });       // This will actually create commits folder,    Location --->  backend/.apnaGit/commits
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: process.env.S3_BUCKET })
    );
    console.log("Repository initialised!");
  } catch(err) {
    console.error("Error initialising repository", err);
  }
}

module.exports = { initRepo }