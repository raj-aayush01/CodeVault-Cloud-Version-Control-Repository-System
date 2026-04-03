// {
//   "Version": "2012-10-17",
//   "Statement": [
//     {
//       "Effect": "Allow",
//       "Principal": {
//         "AWS": "arn:aws:iam::465502145889:user/git-user"
//       },
//       "Action": "s3:*",
//       "Resource": [
//         "arn:aws:s3:::project-git-sample-bucket",
//         "arn:aws:s3:::project-git-sample-bucket/*"
//       ]
//     }
//   ]
// }



const AWS = require("aws-sdk");

AWS.config.update( { region: "ap-south-1" });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const S3_BUCKET = "project-git-sample-bucket" ;

module.exports = { s3, S3_BUCKET: process.env.S3_BUCKET } ;