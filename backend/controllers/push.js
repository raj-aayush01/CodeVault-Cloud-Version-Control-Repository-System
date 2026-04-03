const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config")

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");  // Get path to .apnaGit folder inside current working directory
  const commitsPath = path.join(repoPath, "commits");       // Path where all commit folders are stored

  try {
		const commitDirs = await fs.readdir(commitsPath);                     // Read all commit directories (each commit has its own folder)
		for(const commitDir of commitDirs){                                   // Loop through each commit folder
			const commitPath = path.join(commitsPath, commitDir);       // Full path to a specific commit directory

			const files = await fs.readdir(commitPath);               // Read all files inside that commit folder
			for(const file of files){                                // Loop through each file inside commit
				const filePath = path.join(commitPath, file);         // Full path to the file on local system
				const fileContent = await fs.readFile(filePath);           // Read file content (this will be uploaded to S3)
				
				// S3 upload parameters
				const params = {
					Bucket: S3_BUCKET ,
					Key: `commits/${commitDir}/${file}` ,
					Body: fileContent ,
				};

				await s3.upload(params).promise();        // Upload file to S3
			}
		}

		console.log("All commits pushed to S3.")

  } catch(err) {
    console.error("Error pushing to S3 : " , err);
  }
}

module.exports = { pushRepo };