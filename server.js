var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongo       = require('./mongo.js'),
    mongoDriver = mongo('people', 'people'),
    port        = process.env.PORT || 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());