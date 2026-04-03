const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo( message ) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");   // Creating path by appending .apnaGit inside current woking directory (which is backend here)
  const stagedPath = path.join(repoPath , "staging");         // Creating path by appending staging to the .apnaGit folder location,   Location --->  backend/.apnaGit/staging
  const commitPath = path.join(repoPath, "commits");          // Creating path by appending commits to the .apnaGit folder location,   Location --->  backend/.apnaGit/commits

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitPath, commitId);    // creates a path by appending commitId as a new folder inside the commits directory
    await fs.mkdir(commitDir, { recursive: true });       // creates that folder on disk (and parent folders if missing)
    
    const files = await fs.readdir(stagedPath);    // Reads all file names inside the staging directory. 'stagedPath' already points to the exact folder (backend/.apnaGit/staging),  (trailing '/' optional), Returns an array of file names (not full paths).

    for(const file of files){
      await fs.copyFile(
        path.join(stagedPath, file),      // builds full path to the source file inside staging folder
        path.join(commitDir, file)       // builds full path to destination file inside the specific commit folder with specific commitID
      );
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"), 
      JSON.stringify({ message, date: new Date().toISOString() })
    );

    console.log(`Commit ${commitId} created with message : ${message}`);

  } catch(err) {
    console.error("Error commiting files : ", err);
  }
}

module.exports = { commitRepo };