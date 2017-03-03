let jwt = require('jsonwebtoken');
let env = process.env.NODE_ENV || 'development';
let config = require('../../config/config')[env];

import { User } from '../models';

function ensureAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-auth-token'];

    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, async function (err, decoded) {
            if (err) {
                console.log("Error while parsing Token : " + err + "\n");
                return res.json({status: 401, reason: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                req.user = await User.findById(req.decoded._id);
                next();
            }
        });
    } else {
        // if there is no token return an error
        return res.error('no token', 401, 'No token provided');
    }
}

function ensureAdmin(req, res, next) {
    console.log(req.user);
    if (req.user.email != config.admin.email) {
        return res.error('no permission', 401, 'You are not approved to do this action');
    }
    next();
}

module.exports = {
    ensureAuthenticated: ensureAuthenticated,
    ensureAdmin: ensureAdmin
};

function ensureAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-auth-token'];

    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, async function (err, decoded) {
            if (err) {
                console.log("Error while parsing Token : " + err + "\n");
                return res.json({status: 401, reason: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                req.user = await User.findById(req.decoded._id);
                next();
            }
        });
    } else {
        // if there is no token return an error
        return res.error('no token', 401, 'No token provided');
    }
}

function ensureAdmin(req, res, next) {
    console.log(req.user);
    if (req.user.email != config.admin.email) {
        return res.error('no permission', 401, 'You are not approved to do this action');
    }
    next();
}