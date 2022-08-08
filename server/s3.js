require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
// const sharp = require('sharp');

import { v4 as uuidv4 } from 'uuid';

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

exports.s3 = s3;

// uploads a file to s3
function uploadFile(file, dirPath = "", compressedFileStream) {
  let fileStream;
  let fileName = file.originalname;
  if (!compressedFileStream) {
    fileStream = fs.createReadStream(file.path);
  } else {
    fileStream = compressedFileStream;
    fileName = fileName.substring(0, fileName.indexOf('.')) + '.webp'
  }
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: dirPath + uuidv4() + fileName
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


//   downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}

exports.getFileStream = getFileStream;


// delete a file from s3
function deleteObject(fileKey) {
  const params = {
    Bucket: bucketName,
    Key: fileKey
  };

  return s3.deleteObject(params, (err, data) => {
    if (err) console.log(err);
  });
}

exports.deleteObject = deleteObject;
