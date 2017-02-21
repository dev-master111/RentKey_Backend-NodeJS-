import { Amenity } from '../models'

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

async function create(req, res, next){
    let amenity = new Amenity(req.body);
    await amenity.save();

    return res.success({data: amenity});
}

async function update(req, res, next){
    delete req.body._id;
    await req.Amenity.update(req.body);
    res.success({body: req.Amenity});
}

async function index(req, res, next){
    const amenities = await Amenity.find({});
    res.success({data: amenities});
}

async function show(req, res) {
    res.success({ data: req.Amenity})
}

async function destroy(req, res) {
    await req.Amenity.remove();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy
}
