import mongoose from 'mongoose';
import { User } from '../api/models';

let LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    // require('./initializer')

    // serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(err, user)
        })
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.findOne({email: email}, function (err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, {message: 'Unknown user'})
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {message: 'Invalid password'})
                }
                return done(null, user)
            })
        }
    ))
};
