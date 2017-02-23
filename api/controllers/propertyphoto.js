import jwt from 'jsonwebtoken';
import { Property, PropertyPhoto } from '../models';
import aws from '../utils/aws';

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

async function addPropertyPhoto(req, res, next) {

    //console.log("Image File : " + req.body.image);
    let binaryFile = await decodeBase64Image(req.body.image); //await base64ToBlob(req.body.image);

    if (binaryFile) {
        aws.uploadToS3(binaryFile, config.propertyImagesFolder + "/" + req.body._property + "_" + new Date().getTime() + ".jpg", async function (err, data) {

            if (err) {
                console.log("Error in uploading property photo : " + JSON.stringify(error) + "\n");
                return res.error('image_upload_failed', 500, 'S3 error.')
            } else {

                // Create new user image object
                console.log("Creating a new property photo : " + JSON.stringify(req.body) + "\n");

                let propertyphoto = new PropertyPhoto(req.body);
                propertyphoto.image_url = data.Location + '?' + new Date().getTime();

                await propertyphoto.save();

                console.log("Successfully created a property photo. \n");
                return res.success({ data: propertyphoto });
            }
        });
    } else {
        console.log("Error in uploading property photo. Photo not submitted." + "\n");
        return res.error('image_upload_failed', 400, 'Photo not found.')
    }
}

async function decodeBase64Image(dataString) {

    if (dataString) {
        //var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        //
        //console.log("matches : " + matches);
        //
        //if (matches.length !== 3) {
        //    console.log("Invalid base 64 input string for image. \n");
        //    return null;
        //}
        //
        //return new Buffer(matches[2], 'base64');
        return new Buffer(dataString, 'base64');
    } else {
        console.log("Image is nil. \n");
    }

}

async function show(req, res, next) {
    res.success(req.PropertyPhoto);
}

async function index(req, res, next) {
    const propertyphotos = await PropertyPhoto.find({_property:req.Property._id});
    res.success({data: propertyphotos});
}

async function update(req, res, next) {
    delete req.body._id;
    await req.PropertyPhoto.update(req.body);
    res.success({_id: req.PropertyPhoto._id});
}

async function destroy(req, res, next) {
    await req.PropertyPhoto.remove();
    res.success({});
}

module.exports = {
    show: show,
    index: index,
    destroy: destroy,
    update: update,
    addPropertyPhoto: addPropertyPhoto
}
