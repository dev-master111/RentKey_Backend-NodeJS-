import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

/**
 * Neighborhood Schema
 */

let Neighborhood = new Schema({
    name: {
        type: String,
        required: 'Neighborhood name is required.'
    },
    lat: {
        type: Number,
        default: 0.0
    },
    lng: {
        type: Number,
        default: 0.0
    },
    coordinates: [{
        type: String
    }]
});

let Neighborhood = new Schema({
    name: {
        type: String,
        required: 'Neighborhood name is required.'
    },
    lat: {
        type: Number,
        default: 0.0
    },
    lng: {
        type: Number,
        default: 0.0
    },
    coordinates: [{
        type: String
    }]
});

Neighborhood.plugin(timestamps);
Neighborhood.plugin(update, ['name', 'coordinates']);

Neighborhood.statics.isValidId = function (neighborhoodId) {
};

module.exports = mongoose.model('Neighborhood', Neighborhood);
Neighborhood.plugin(update, ['name', 'coordinates']);
module.exports = mongoose.model('Neighborhood', Neighborhood);