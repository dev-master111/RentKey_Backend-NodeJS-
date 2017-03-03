import fs from 'fs';
import AWS from 'aws-sdk';

const bucketName = process.env.RENTKEY_BUCKET || "rentkey-bucket";
const awsAccessKey = process.env.AWS_ACCESS_KEY || "AKIAJJOMRXYR7OHSHOFA";
const awsSecretKey = process.env.AWS_SECRET_KEY || "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";
const awsRegion = 'us-west-2';

AWS.config.update({accessKeyId: awsAccessKey, secretAccessKey: awsSecretKey});
AWS.config.update({region: awsRegion});

let rentkeyBucket = new AWS.S3({params: {Bucket: bucketName}});

exports.uploadToS3 = function (file, subDirectory, callback) {

    //console.log("file upload to s3", file.path, subDirectory + file.name);
    //
    rentkeyBucket
        .upload({
            ACL: 'public-read',
            Body: file, //fs.createReadStream(file.path),
            Key: subDirectory, // + "/" + file.name,
            ContentType: 'image/jpeg' // force download if it's accessed as a top location
        })
        .send(callback);

    //rentkeyBucket
    //    .upload({
    //        Body: file,
    //        Key: subDirectory
    //    })
    //    .send(callback);
};

exports.deleteFromS3 = function (key, subDirectory) {
    var params = {
        Key: subDirectory + key
    };
    rentkeyBucket.deleteObject(
        params,
        function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    exports.deleteFromS3 = function (key, subDirectory) {
    var params = {
        Key: subDirectory + key
    };
    rentkeyBucket.deleteObject(
        params,
        function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
};