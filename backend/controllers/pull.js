const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {

  const currentDir = process.cwd();
  const repoPath = path.join(currentDir, ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const config = JSON.parse(
      await fs.readFile(path.join(repoPath, "config.json"), "utf-8")
    );
    const { userId, repoName } = config;


     const prefix = `${userId}/${repoName}/commits/`;
    const data = await s3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix:  prefix
    }).promise();


    const objects = data.Contents; 

    if (!objects || objects.length === 0) {
      console.log("No files found in S3, Nothing to pull");
      return;
    }


    for (const obj of objects) {
      const key = obj.Key; 

      const parts = key.split("/");

      const commitId = parts[3];
      const fileName = parts[4];

       if (!fileName) continue;

      //  local commit folder
      const commitDir = path.join(commitsPath, commitId);
      await fs.mkdir(commitDir, { recursive: true });


      const fileData = await s3.getObject({
        Bucket: S3_BUCKET,
        Key: key
      }).promise();

      //  save in local 
      await fs.writeFile(
        path.join(commitDir, fileName),
        fileData.Body
      );

      console.log(`All commits pulled from S3: ${commitId}/${fileName}`);
    }

    console.log("Pull completed successfully!");

  } catch (err) {
    console.error("Error pulling from S3:", err.message);
  }
}

module.exports = { pullRepo };