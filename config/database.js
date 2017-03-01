import mongoose from 'mongoose';
import config from './config';
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

let env = process.env.NODE_ENV || 'development';
mongoose.connect(config[env].db);

mongoose.connection.on('connected', () => {
    console.log('Mongoose connection open');
});

mongoose.connection.on('error', err => {
    console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.error('Mongoose connection disconnected');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports = mongoose.connection;