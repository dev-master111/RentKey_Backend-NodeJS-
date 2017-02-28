import database from '../../config/database';

module.exports = {
    User: require('./user'),
    Amenity: require('./amenity'),
    Neighborhood: require('./neighborhood'),
    Property: require('./property'),
    PropertyPhoto: require('./propertyphoto')
};
