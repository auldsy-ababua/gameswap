"use strict"

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

var app = express();

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        console.log(err);
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

exports.app = app;
exports.runServer = runServer;
