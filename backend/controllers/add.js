const fs = require("fs").promises;
const path = require("path");

async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");   // Getting absolute path of .apnaGit folder
  const stagingPath = path.join(repoPath, "staging");         // Creating path by appending staging folder inside .apnaGit folder

  try {
    await fs.mkdir(stagingPath, { recursive: true });         // Actually creating staging folder,   Location --->  backend/.apnaGit/staging   and recursive: true means if parent doesnot exist create parents also.
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} added to the staging area!`);
  } catch(err) {
      console.error("Error adding file : ", err);
  }
}

module.exports = { addRepo };