import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

/**
 * PropertyPhoto Schema
 */

let PropertyPhoto = new Schema({
    _property: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: 'image url is required.'
    }
});

PropertyPhoto.plugin(timestamps);
PropertyPhoto.plugin(update, ['_property', 'image_url']);

PropertyPhoto.statics.isValidId = function (propertyphotoId) {
};

module.exports = mongoose.model('PropertyPhoto', PropertyPhoto);