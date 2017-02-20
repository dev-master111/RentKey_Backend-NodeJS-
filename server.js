import database from './config/database';
import express from 'express';
import fs from 'fs';
import passport from 'passport';
import morgan from 'morgan';
//import logger from './api/common/log';
import cors from 'cors';
import bodyParser from 'body-parser';

let env = process.env.NODE_ENV || 'development';
console.log("Environment: ", env);

let config = require('./config/config')[env];
let app = express();
/*
 process.on('uncaughtException', function(err){
 console.log('uncaughtException', err);
 console.dir(err);
 });

 process.on('uncaughtRejection', function(err){
 console.log('uncaughtRejection', err);
 });*/

app.set('superSecret', config.secret);
//app.use(morgan('short', {stream: logger.asStream('info')}));

app.use(express.static('./public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors());

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.text({type: 'application/text-enriched', limit: '50mb'}));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Acncess-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.set(`X-Powered-By`, `RentKey`);
    next();
});

require('./config/routes')(app, passport);

app.use(function (err, req, res, next) {
    if (err) {
        console.log(err);
        if (typeof err.status != "undefined")   res.status(err.status);
        res.send(err);
    }
});

app.get('/', function (req, res) {
//    res.sendfile('./public/index.html');
});

app.listen(process.env.PORT || 3300);

if (process.env.PORT === undefined) {
    console.log("Server Started at port : " + 3300);
}
else {
    console.log("Server Started at port : " + process.env.PORT);
}