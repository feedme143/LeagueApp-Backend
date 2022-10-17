require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');


const bucket = process.env.BUCKET_NAME;
const region = process.env.REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKey,
    secretKey
});

function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucket
    };
    return s3.getObject(downloadParams).createReadStream();
}

exports.getFileStream = getFileStream;