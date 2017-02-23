import jwt from 'jsonwebtoken';
import { User } from '../models';

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

async function login(req, res, next) {

    let {email, password} = req.body;

    console.log("User is logging in : " + JSON.stringify(req.body) + "\n");

    if(!email || !password) {
        console.log("Log in error : Email or password is empty ...\n");
        return res.error('authentication_failed', 401, 'Missing or invalid authentication credentials.')
    }

    let user = await User.findOne({email: email});

    if (!user) {
        console.log("Sign in error : User with the given email does not exist ...\n");
        return res.error('authentication_failed', 401, 'Missing or invalid authentication credentials.')
    }

    if (!user.authenticate(password)) {
        console.log("Sign in error : Password is wrong ...\n");
        return res.error('authentication_failed', 401, 'Missing or invalid authentication credentials.')
    }

    //await user.saveAsync();
    let token = jwt.sign(user, config.secret, {
        expiresInMinutes: 1440 // expires in 24 hours
    });

    console.log("Sign in successful : " + user + "\n");
    res.success({id: user._id, api_token: token, user: user});

}

async function signup(req, res, next) {

    let {email, password} = req.body;

    console.log("User is signing up : " + JSON.stringify(req.body) + "\n");

    if(!email || !password) {
        console.log("Sign up error : email or password is empty ...\n");
        return res.error('signup_failed', 401, 'Email or password cannot be empty.')
    }

    let user = await User.findOne({email: email});

    if (user) {
        console.log("Sign up error : email already taken ...\n");
        return res.error('signup_failed', 401, 'Email already taken.')
    }

    try {
        let newUser = new User(req.body);

        await newUser.save();

        let token = jwt.sign(newUser, config.secret, {
            expiresInMinutes: 1440 // expires in 24 hours
        });

        console.log("Sign up successful : " + newUser + "\n");
        return res.success( {user:newUser, api_token: token});

    } catch (error) {
        console.log("Sign up error : " + JSON.stringify(error) +  "\n");
        return res.error('signup_failed', 401, 'Server error.')
    }
}

async function show(req, res, next) {
    res.success(req.user);
}

async function index(req, res, next) {
    const users = await User.find({});
    res.success({data: users});
}

async function update(req, res, next) {
    delete req.body._id;
    await req.user.update(req.body);
    res.success({_id: req.user._id});
}

async function updateMe(req, res, next) {
    delete req.body._id;
    await req.user.update(req.body);
    res.success({_id: req.user._id});
}
async function destroy(req, res, next) {
    await req.user.remove();
    res.success({});
}

module.exports = {
    login: login,
    signup: signup,
    show: show,
    index: index,
    destroy: destroy,
    update: update,
    updateMe: updateMe
};
