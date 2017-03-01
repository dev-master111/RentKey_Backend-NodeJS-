import tokenCtrl from '../api/controllers/token';
import usersCtrl from '../api/controllers/user';
import amenityCtrl from '../api/controllers/amenity';
import neighborhoodCtrl from '../api/controllers/neighborhood';
import propertyCtrl from '../api/controllers/property';
import propertyphotoCtrl from '../api/controllers/propertyphoto';

import resError from '../api/middlewares/res_error';
import resSuccess from '../api/middlewares/res_success';
import modelMagic from '../api/middlewares/model_magic';

let multer = require('multer');

let avatarUpload = multer({
    dest: 'uploads/avatar',
    rename: function (fieldname, filename) {
        return filename + Date.now();
    }
});

let env = process.env.NODE_ENV || 'development';

module.exports = function (app, passport) {

    let router = require(`express-promise-router`)();
    app.use(resError);
    app.use(resSuccess);
    router.use(resError);
    router.use(resSuccess);

    router.post('/register', usersCtrl.signup);
    router.post('/login', usersCtrl.login);
    router.get('/amenities', amenityCtrl.index);
    router.get('/neighborhoods', neighborhoodCtrl.index);
    router.post('/neighborhoods/filter', neighborhoodCtrl.filterNeighborhood);
    router.get('/properties', propertyCtrl.index);
    router.post('/propertyphotos', propertyphotoCtrl.addPropertyPhoto);

    router.all('/users/:id*', modelMagic('User'));
    router.all('/amenities/:id*', modelMagic('Amenity'));
    router.all('/neighborhoods/:id*', modelMagic('Neighborhood'));
    router.all('/properties/:id*', modelMagic('Property'));
    router.all('/propertyphotos/:id*', modelMagic('PropertyPhoto'));

    router.get('/neighborhoods/:id/properties', neighborhoodCtrl.propertiesForNeighborhood);
    router.post('/neighborhoods/:id/properties', neighborhoodCtrl.propertiesForNeighborhoodFilter);
    router.get('/properties/:id', propertyCtrl.show);
    router.get('/properties/:id/photos', propertyphotoCtrl.index);
    router.get('/copyPossible', propertyCtrl.copyPossible);

    router.use(tokenCtrl.ensureAuthenticated);

    router.get('/me', usersCtrl.show);
    router.put('/me', usersCtrl.updateMe);

    router.get('/users', tokenCtrl.ensureAdmin, usersCtrl.index);
    router.put('/users/:id', tokenCtrl.ensureAdmin, usersCtrl.update);
    router.delete('/users/:id', tokenCtrl.ensureAdmin, usersCtrl.destroy);

    router.get('/amenities/:id', amenityCtrl.show);
    router.delete('/amenities/:id', tokenCtrl.ensureAdmin, amenityCtrl.destroy);
    router.put('/amenities/:id', amenityCtrl.update);
    router.post('/amenities', amenityCtrl.create);

    router.get('/neighborhoods/:id', neighborhoodCtrl.show);
    router.delete('/neighborhoods/:id', tokenCtrl.ensureAdmin, neighborhoodCtrl.destroy);
    router.put('/neighborhoods/:id', neighborhoodCtrl.update);
    router.post('/neighborhoods', neighborhoodCtrl.create);
    router.post('/properties/:id', propertyCtrl.copy);
    router.get('/copyPossible', propertyCtrl.copyPossible);


    router.delete('/properties/:id', propertyCtrl.destroy);
    router.put('/properties/:id', propertyCtrl.update);
    router.post('/properties', propertyCtrl.create);

    router.get('/propertyphotos/:id', propertyphotoCtrl.show);
    router.delete('/propertyphotos/:id', propertyphotoCtrl.destroy);
    router.put('/propertyphotos/:id', propertyphotoCtrl.update);

    app.use('/api/v1', router);
};