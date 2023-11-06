require('dotenv').config();
const {GetObjectCommand, S3Client} = require("@aws-sdk/client-s3");
const {fromEnv} = require("@aws-sdk/credential-providers");


const region = process.env.REGION;
const bucket = process.env.BUCKET_NAME;

const s3Client = new S3Client({
    region: region,
    credentials: fromEnv(),
  });

async function getFileStream(fileKey) {
    // const downloadParams = {
    //     Key: fileKey,
    //     Bucket: bucket
    // };
    // return s3Client.getObject(downloadParams).createReadStream();

    const command = new GetObjectCommand({
        Bucket: bucket,
        Prefix: "items",
        Key: fileKey,
      });
    
      try {
        const response = await s3Client.send(command);
        
        return response;

      } catch (err) {
        console.error(err);
      }
    
}

exports.getFileStream = getFileStream;