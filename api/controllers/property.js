import { Property, Neighborhood, PropertyPhoto } from '../models'

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

async function create(req, res, next){

    let property = new Property(req.body);
    property._user = req.decoded._id;

    await property.save();

    return res.success({ data: property});
}

async function update(req, res, next){
    delete req.body._id;
    await req.Property.update(req.body);
    res.success({data: req.Property});
}

async function index(req, res, next){
    const properties = await Property.find({});
    res.success({data: properties});
}

async function show(req, res) {

    var propertyObj = req.Property.toObject();
    propertyObj.photos = await PropertyPhoto.find({_property:req.Property._id});

    res.success({ data: propertyObj})
}

async function copy(req, res, next) {
    const propertyObj = await Property.findOne({ _id:req.body.id });
    let propertyNew = propertyObj.toObject();

    delete propertyNew._id;
    let propertyTemp = new Property(propertyNew);
    await propertyTemp.save();

    return res.success({ data: propertyTemp });
}

async function copyPossible(req, res) {
    console.log("start");
    const { address, apt } = req.query;
    const arytmp = await Property.find({ address: address, apt: apt });
    if (arytmp.length > 0) {
        return res.success({ data: false})
    } else {
        return res.success({ data: true})
    }
}

async function destroy(req, res) {
    await req.Property.remove();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy,
    copy: copy,
    copyPossible: copyPossible
};
