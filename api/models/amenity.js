import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

/**
 * Amenity Schema
 */

let Amenity = new Schema({
    name: {
        type: String,
        required: 'Amenity name is required.'
    },
    image_url: {
        type: String,
        required: 'Image url is required.'
    },
    priority: {
        type: Number,
        default: 0
    }
});

Amenity.plugin(timestamps);
Amenity.plugin(update, ['name', 'image_url', 'priority']);

Amenity.statics.isValidId = function (amenityId) {
};

module.exports = mongoose.model('Amenity', Amenity);