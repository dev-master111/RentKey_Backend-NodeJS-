import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import crypto from 'crypto';

/**
 * User Schema
 */

let User = new Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: 'email address is required.'
    },
    full_name: {type: String, required: 'Full name is required.'},
    role: {
        type: String,
        enum: ['owner', 'renter', 'realtor'],
        default: 'owner'
    },
    company: {type: String, default: ''},
    cell_number: {type: String, default: ''},
    licence: {type: String, default: ''},
    state: {type: String, default: ''},
    city: {type: String, default: ''},
    credit_score: {type: Number, default: 0},
    roomates: {type: Number, default: 0},
    annual_salary: {type: Number, default: 0},
    avatar_url: {type: String, default: ''},
    hashed_password: {
        type: String,
        required: 'Password cannot be blank. '
    },
    salt: {type: String},
    enabled: {type: Boolean, default: true}
});

User.plugin(timestamps);
User.plugin(update, ['email', 'full_name', 'role', 'company', 'cell_number', 'licence', 'state', 'city', 'credit_score', 'roomates', 'annual_salary', 'avatar_url', 'enabled']);

/**
 * Virtuals
 */

User
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() { return this._password })

/**
 * Validations
 */

let validatePresenceOf = function (value) {
    return value && value.length
};


// the below 4 validations only apply if you are signing up traditionally

User.path('email').validate(function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}, 'Please fill a valid email address. ');

User.path('email').validate(function (email, fn) {
    var User = mongoose.model('User');
    // Check only when it is a new user or when email field is modified
    User.find({ email: email }).exec(function (err, users) {
        //return true;
        fn((!err && users.length === 0));
    });
}, 'Email already exists.');

/**
 * Pre-save hook
 */

User.pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password))
        next(new Error('Invalid password'))
    else
        next()
});

/**
 * Methods
 */

User.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    }
};

module.exports = mongoose.model('User', User);
