"use strict"

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var jsonParser = bodyParser.json();
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var config = require('./config');

var app = express();

app.use(express.static(path.join(__dirname, 'build')));


var strategy = new BasicStrategy(function(username, password, callback) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.use(strategy);


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

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

var User = require('./models/models').User;
var UserGame = require('./models/models').UserGame;

//endpoints


var bcrypt = require('bcryptjs');

//signin endpoint
//(create new user) POST (name, email, password, city)
app.post('/users', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            var user = new User({
                username: username,
                password: hash,
                city: req.body.city,
                email: req.body.email
            });

            user.save(function(err) {
                if (err) {
                  console.log(err);
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }

                return res.status(201).json({});
            });
        });
    });
});



//this one confuses me the most
//search games endpoint
//grabbing from user login
app.get('/games', function(req, res) {
    UserGames.find().sort("game").exec(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});

//my games endpoint
//(own (true), own (false)) find UserGame by User
app.get('/mygames', function(req, res) {
    UserGame.find({
        "user": req.body.user
    }).sort("game").exec(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});

//add games
//(own (true or false), game name)
app.post('/mygames', function(req, res) {
    UserGame.create({
        user: req.body.user,
        game: req.body.game,
        own: req.body.own
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

//remove games
//(_id)
app.delete('/mygames/:id', function(req, res) {
    var id = req.params.id;
    UserGame.remove({
        '_id': id
    }, function(err, item) {
        if (err) {
            return res.sendStatus(404);
        }

        return res.sendStatus(210);
    })
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

app.use(passport.initialize());


app.get('/hidden', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({
        message: 'Luke... I am your father'
    });
});

exports.app = app;
exports.runServer = runServer;
