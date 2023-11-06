require('dotenv').config();
const {GetObjectCommand, S3Client} = require("@aws-sdk/client-s3");
const {fromEnv} = require("@aws-sdk/credential-providers");


const region = process.env.REGION;
const bucket = process.env.BUCKET_NAME;

const s3Client = new S3Client({
    region: region,
    credentials: fromEnv(),
  });

async function getS3File(fileKey, prefix) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: (prefix + "/" + fileKey) || fileKey,
      });
    
      try {
        const response = await s3Client.send(command);
        
        return response;

      } catch (err) {
        console.error(err);
      }
    
}

exports.getS3File = getS3File;