import { Neighborhood, Property, PropertyPhoto, User , Amenity } from '../models'
import _ from 'lodash'

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

async function create(req, res, next){
    let neighborhood = new Neighborhood(req.body);
    await neighborhood.save();

    return res.success({data: neighborhood});
}

async function update(req, res, next){
    delete req.body._id;
    await req.Neighborhood.update(req.body);
    res.success({body: req.Neighborhood});
}

async function index(req, res, next){

    const startPrice = req.query.startPrice;
    const endPrice = req.query.endPrice;

    let aryTempNeighborhoods = await Neighborhood.find({});
    let aryNeighborhoods = [];

    for (let i = 0; i < aryTempNeighborhoods.length; i ++) {
        var neighborhood = aryTempNeighborhoods[i];

        // Get Number of Properties in the neighborhood and add that as a property of neighborhood
        let aryPropertiesInNeighborhood = await Property.find({_neighborhood: neighborhood._id, rent_fee: {$gt: startPrice, $lt: endPrice}});
        var neighborhoodObj = neighborhood.toObject();
        neighborhoodObj.property_count = aryPropertiesInNeighborhood.length;

        aryNeighborhoods.push(neighborhoodObj);
    }

    res.success({data: aryNeighborhoods});
}

async function filterNeighborhood(req, res, next) {

    const { startPrice, endPrice, bed_num, extra_room, bathroom_num, moving_date, pets, amenities, walk_up, display, no_filter } = req.body;

    const aryBedNum = Array.from(bed_num);
    const aryWalkUp = Array.from(walk_up);
    const aryAmenities = Array.from(amenities);
    const aryDisplay = Array.from(display);

    let query = { rent_fee: { $gt: startPrice, $lt: endPrice } };
    if (!no_filter) {
        if (aryBedNum.length > 0) {
            query['bed_num'] = { $in: aryBedNum };
        }
        query['bathroom_num'] = { $gte: bathroom_num };
        query['moving_date'] = { $lte: moving_date };
        query['pets'] = { $gte: pets };
        query['walk_up'] = { $in: aryWalkUp };
        if (extra_room < 2) {
            query['extra_room'] = { $ne: extra_room };
        }
        if (_.include(aryDisplay, "broker fee apts") && _.include(aryDisplay, "no fee")) {

        } else if (_.include(aryDisplay, "broker fee apts")) {
            query['broker_fee'] = {$gt: 0};
        } else if (_.include(aryDisplay, "no fee")) {
            query['broker_fee'] = 0;
        }
        if (aryAmenities.length > 0) {
            query['_amenities'] = { $all: aryAmenities };
        }
    }

    let aryTempNeighborhoods = await Neighborhood.find({});
    let aryNeighborhoods = [];

    for (let i = 0; i < aryTempNeighborhoods.length; i ++) {
        var neighborhood = aryTempNeighborhoods[i];
        query['_neighborhood'] = neighborhood.id;
        // Get Number of Properties in the neighborhood and add that as a property of neighborhood
        const aryPropertiesInNeighborhood = await Property.find(query);

        let propertyCount = 0;
        if (no_filter) {
            propertyCount = aryPropertiesInNeighborhood.length;
        } else if (_.include(aryDisplay, "by owner")) {
            for (let j = 0; j < aryPropertiesInNeighborhood.length; j++) {
                var property = aryPropertiesInNeighborhood[j];
                const creator = await User.findOne({_id: property._user});
                if (creator.role == 'owner') {
                    propertyCount++;
                }
            }
        } else {
            propertyCount = aryPropertiesInNeighborhood.length;
        }
        var neighborhoodObj = neighborhood.toObject();
        neighborhoodObj.property_count = propertyCount;

        aryNeighborhoods.push(neighborhoodObj);
    }

    res.success({data: aryNeighborhoods});
}

async function filterNeighborhood(req, res, next) {

    const { startPrice, endPrice, bed_num, extra_room, bathroom_num, moving_date, pets, amenities, walk_up, display, no_filter } = req.body;

    const aryBedNum = Array.from(bed_num);
    const aryWalkUp = Array.from(walk_up);
    const aryAmenities = Array.from(amenities);
    const aryDisplay = Array.from(display);

    let query = { rent_fee: { $gt: startPrice, $lt: endPrice } };
    if (!no_filter) {
        if (aryBedNum.length > 0) {
            query['bed_num'] = { $in: aryBedNum };
        }
        query['bathroom_num'] = { $gte: bathroom_num };
        query['moving_date'] = { $lte: moving_date };
        query['pets'] = { $gte: pets };
        query['walk_up'] = { $in: aryWalkUp };
        if (extra_room < 2) {
            query['extra_room'] = { $ne: extra_room };
        }
        if (_.include(aryDisplay, "broker fee apts") && _.include(aryDisplay, "no fee")) {

        } else if (_.include(aryDisplay, "broker fee apts")) {
            query['broker_fee'] = {$gt: 0};
        } else if (_.include(aryDisplay, "no fee")) {
            query['broker_fee'] = 0;
        }
        if (aryAmenities.length > 0) {
            query['_amenities'] = { $all: aryAmenities };
        }
    }

    let aryTempNeighborhoods = await Neighborhood.find({});
    let aryNeighborhoods = [];

    for (let i = 0; i < aryTempNeighborhoods.length; i ++) {
        var neighborhood = aryTempNeighborhoods[i];
        query['_neighborhood'] = neighborhood.id;
        // Get Number of Properties in the neighborhood and add that as a property of neighborhood
        const aryPropertiesInNeighborhood = await Property.find(query);

        let propertyCount = 0;
        if (no_filter) {
            propertyCount = aryPropertiesInNeighborhood.length;
        } else if (_.include(aryDisplay, "by owner")) {
            for (let j = 0; j < aryPropertiesInNeighborhood.length; j++) {
                var property = aryPropertiesInNeighborhood[j];
                const creator = await User.findOne({_id: property._user});
                if (creator.role == 'owner') {
                    propertyCount++;
                }
            }
        } else {
            propertyCount = aryPropertiesInNeighborhood.length;
        }
        var neighborhoodObj = neighborhood.toObject();
        neighborhoodObj.property_count = propertyCount;

        aryNeighborhoods.push(neighborhoodObj);
    }

    res.success({data: aryNeighborhoods});
}

async function show(req, res) {
    res.success({ data: req.Neighborhood})
}

async function propertiesForNeighborhood(req, res, next){

    const { startPrice = 1000, endPrice = 9000 } = req.query;

    const aryProperties = await Property.find({_neighborhood: req.Neighborhood._id, rent_fee: {$gt: startPrice, $lt: endPrice}}).sort({createdAt: 'desc'});

    var aryPropertyObjs = [];

    for (let i = 0; i < aryProperties.length; i ++) {
        var propertyObj = aryProperties[i].toObject();
        propertyObj.photos = await PropertyPhoto.find({_property:propertyObj._id}).sort({createdAt: 'asc'});
        propertyObj.user = await User.findOne({ _id: propertyObj._user });
        aryPropertyObjs.push(propertyObj);
    }

    res.success({data: aryPropertyObjs});
}

async function propertiesForNeighborhoodFilter(req, res, next){

    const { startPrice, endPrice, bed_num, extra_room, bathroom_num, moving_date, pets, amenities, walk_up, display, no_filter } = req.body;

    const aryBedNum = Array.from(bed_num);
    const aryWalkUp = Array.from(walk_up);
    const aryAmenities = Array.from(amenities);
    const aryDisplay = Array.from(display);

    let query = { _neighborhood: req.Neighborhood._id, rent_fee: { $gt: startPrice, $lt: endPrice } };
    if (!no_filter) {
        if (aryBedNum.length > 0) {
            query['bed_num'] = { $in: aryBedNum };
        }
        query['bathroom_num'] = { $gte: bathroom_num };
        query['moving_date'] = { $lte: moving_date };
        query['pets'] = { $gte: pets };
        query['walk_up'] = { $in: aryWalkUp };
        if (extra_room < 2) {
            query['extra_room'] = { $ne: extra_room };
        }
        if (_.include(aryDisplay, "broker fee apts") && _.include(aryDisplay, "no fee")) {

        } else if (_.include(aryDisplay, "broker fee apts")) {
            query['broker_fee'] = {$gt: 0};
        } else if (_.include(aryDisplay, "no fee")) {
            query['broker_fee'] = 0;
        }
        if (aryAmenities.length > 0) {
            query['_amenities'] = { $all: aryAmenities };
        }
    }

    const aryPropertiesInNeighborhood = await Property.find(query).sort({ display_address: -1, createdAt: -1 });

    let aryPropertiesFiltered = [];
    for (let j = 0; j < aryPropertiesInNeighborhood.length; j++) {
        let property = aryPropertiesInNeighborhood[j];
        const creator = await User.findOne({ _id: property._user });
        if (!no_filter) {
            if (_.include(aryDisplay, "by owner")) {
                if (creator.role == 'owner') {
                    let propertyObj = property.toObject();
                    propertyObj.photos = await PropertyPhoto.find({_property: propertyObj._id}).sort({createdAt: 'asc'});
                    propertyObj.user = await User.findOne({_id: propertyObj._user});
                    aryPropertiesFiltered.push(propertyObj);
                }
            } else {
                let propertyObj = property.toObject();
                propertyObj.photos = await PropertyPhoto.find({_property: propertyObj._id}).sort({createdAt: 'asc'});
                propertyObj.user = await User.findOne({_id: propertyObj._user});
                aryPropertiesFiltered.push(propertyObj);
            }
        } else {
            let propertyObj = property.toObject();
            propertyObj.photos = await PropertyPhoto.find({_property: propertyObj._id}).sort({createdAt: 'asc'});
            propertyObj.user = await User.findOne({_id: propertyObj._user});
            aryPropertiesFiltered.push(propertyObj);
        }
    }
    res.success({ data: aryPropertiesFiltered });
}

async function destroy(req, res) {
    await req.Neighborhood.remove();
    res.success({})
}
async function filterNeighborhood(req, res, next) {

    const { startPrice, endPrice, bed_num, extra_room, bathroom_num, moving_date, pets, amenities, walk_up, display, no_filter } = req.body;

    const aryBedNum = Array.from(bed_num);
    const aryWalkUp = Array.from(walk_up);
    const aryAmenities = Array.from(amenities);
    const aryDisplay = Array.from(display);

    let query = { rent_fee: { $gt: startPrice, $lt: endPrice } };
    if (!no_filter) {
        if (aryBedNum.length > 0) {
            query['bed_num'] = { $in: aryBedNum };
        }
        query['bathroom_num'] = { $gte: bathroom_num };
        query['moving_date'] = { $lte: moving_date };
        query['pets'] = { $gte: pets };
        query['walk_up'] = { $in: aryWalkUp };
        if (extra_room < 2) {
            query['extra_room'] = { $ne: extra_room };
        }
        if (_.include(aryDisplay, "broker fee apts") && _.include(aryDisplay, "no fee")) {

        } else if (_.include(aryDisplay, "broker fee apts")) {
            query['broker_fee'] = {$gt: 0};
        } else if (_.include(aryDisplay, "no fee")) {
            query['broker_fee'] = 0;
        }
        if (aryAmenities.length > 0) {
            query['_amenities'] = { $all: aryAmenities };
        }
    }

    let aryTempNeighborhoods = await Neighborhood.find({});
    let aryNeighborhoods = [];

    for (let i = 0; i < aryTempNeighborhoods.length; i ++) {
        var neighborhood = aryTempNeighborhoods[i];
        query['_neighborhood'] = neighborhood.id;
        // Get Number of Properties in the neighborhood and add that as a property of neighborhood
        const aryPropertiesInNeighborhood = await Property.find(query);

        let propertyCount = 0;
        if (no_filter) {
            propertyCount = aryPropertiesInNeighborhood.length;
        } else if (_.include(aryDisplay, "by owner")) {
            for (let j = 0; j < aryPropertiesInNeighborhood.length; j++) {
                var property = aryPropertiesInNeighborhood[j];
                const creator = await User.findOne({_id: property._user});
                if (creator.role == 'owner') {
                    propertyCount++;
                }
            }
        } else {
            propertyCount = aryPropertiesInNeighborhood.length;
        }
        var neighborhoodObj = neighborhood.toObject();
        neighborhoodObj.property_count = propertyCount;

        aryNeighborhoods.push(neighborhoodObj);
    }

    res.success({data: aryNeighborhoods});
}

async function show(req, res) {
    res.success({ data: req.Neighborhood})
}
module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy,
    filterNeighborhood : filterNeighborhood,
    propertiesForNeighborhood: propertiesForNeighborhood,
    propertiesForNeighborhoodFilter : propertiesForNeighborhoodFilter
}
