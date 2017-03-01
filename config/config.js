import path from 'path';
let rootPath = path.normalize(__dirname + '/..');
import plaid from 'plaid';

module.exports = {
    development: {
        db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/rentkey_dev',
        root: rootPath,
        app: {
            name: 'RentKey Backend'
        },
        secret: 'secretkeyforrentkeywebservice',
        admin: {
            email: 'admin@rentkey.com',
            password: 'pass'
        },
        avatarImagesFolder: 'uploads/avatars',
        propertyImagesFolder: 'uploads/properties'
    },
    production: {
        db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/rentkey_prod',
        root: rootPath,
        app: {
            name: 'Rentkey Backend'
        },
        secret: 'secretkeyforrentkeywebservice',
        admin: {
            email: 'admin@rentkey.com',
            password: 'pass'
        },
        avatarImagesFolder: 'uploads/avatars',
        propertyImagesFolder: 'uploads/properties'
    }
};
