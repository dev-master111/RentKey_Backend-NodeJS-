import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

/**
 * Property Schema
 */

let Property = new Schema({
    _user: {
        type: String,
        required: true
    },
    _neighborhood: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        default: 0.0
    },
    lng: {
        type: Number,
        default: 0.0
    },
    address: {
        type: String,
        required: true
    },
    rent_fee: {
        type: Number,
        default: 0
    },
    apt: {
        type: String,
        default: ''
    },
    floor: {
        type: Number,
        default: 1
    },
    walk_up: {
        type: String,
        enum: ['no walk-up', 'walk up', 'elevator'],
        default: 'walk up'
    },
    // Possible values are
    // heating, hot water, gas, electricity, central air
    utilities: [{
        type: String
    }],
    building_name: {
        type: String,
        default: ''
    },
    // Possible values are
    // Brownstone, Limestone, 1 Family House, 2 Family House, 3Family House, Mix Use,Apartment Bldg, Pre War, New Construction
    building_type: {
        type: String,
        default: ''
    },
    // Possible values are
    // 0(Room), 1(Studio), 1, 2, 3, 4, 5, 6(Loft)
    bed_num: {
        type: Number,
        default: 0
    },
    extra_room: {
        type: Boolean,
        default: false
    },
    // Possible values are
    // 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6
    bathroom_num: {
        type: Number,
        default: 0.0
    },
    moving_date: {
        type: Date,
        required: true
    },
    // Possible values are
    // 0: No Dog, No Cat,  1: No Dog,  Yes Cat,  2: Yes Dog, No Cat,  3: Yes Dog, Yes Cat
    pets: {
        type: Number,
        default: 0
    },
    display_address: {
        type: Boolean,
        default: true
    },
    _amenities: [{
        type: String
    }],
    // Possible values are
    // Photo ID, Employment Letter, Recent Pay Stubs, Bank Statement, Tax Return, Guarantors allowed
    documents: [{
        type: String
    }],
    // Possible values are
    // 0 or 1
    security_deposit: {
        type: Number,
        default: 0
    },
    // Possible values are
    // 0: 1st Month's Rent On, Last Month's Rent Off, 1: 1st Month's Rent Off, Last Month's Rent On, 2: 1st Month's Rent Off, Last Month's Rent Off, 3: 1st Month's Rent On, Last Month's Rent On
    rent_type: {
        type: Number,
        default: 0
    },
    broker_fee: {
        type: Number,
        default: 0
    },
    // Possible values are
    // 0 for 1~3 months, 1 for 4~9 months, 2 for 12 months, 3 for 24 months
    lease_term: {
        type: Number,
        default: 0
    }
});

Property.plugin(timestamps);
Property.plugin(update, ['_user', '_neighborhood', 'lat', 'lng', 'address', 'rent_fee', 'apt', 'floor', 'walk_up', 'utilities', 'building_name', 'building_type', 'bed_num', 'extra_room','display_address', 'bathroom_num', 'moving_date', 'pets', '_amenities', 'documents', 'security_deposit', 'rent_type', 'broker_fee', 'lease_term']);

Property.statics.isValidId = function (propertyId) {
};

module.exports = mongoose.model('Property', Property);