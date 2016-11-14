var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var bcrypt = require('bcryptjs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var server = http.Server(app);
var User = require('./models/user');

var options = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};
mongoose.connect('mongodb://localhost/foodme', options); // foodme is the database.
mongoose.connection.on('connected', function(ref) {
    initApp();
}); //when connected we try to apply express application
process.on('SIGINT', function() { //When you use control in gitbash, this event catches it and shuts down database.
    console.log("Caught interrupt signal");
    mongoose.disconnect(function() {
        console.log("disconnected perfectly.");
        process.exit();
    });
});

function initApp() {
    //get and app stuff here
    //GET, displays a list of all the items in DB
    var schema = 'User';

    //Show list of all users in DB
    app.get('/user', function(req, res) {
        User.find(function(err, items) {
            if (err) {
                return res.status(500).json({message: 'Internal Server Error'});
            } else {
                console.log("Got a request to disp user db data")
                res.json(items);
            }

        });
    });

    //--Login of single user from login page, protected by bcrypt and hashed PWD's
    app.post('/login', function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        var uname = req.body.username;
        var pwd = req.body.password;

        User.findOne({
            username: uname
        }, function(err, items) {
            if (err) {
                return res.status(500).json({message: 'Internal Server Error'});
            }
            if (!items) {
                //bad username
                return res.status(401).json({message: 'Not found'});
            } else {
                items.validatePassword(pwd, function(err, isValid) {
                    if (err) {
                        console.log("No clue what this does - if it ever logs, check it out");
                    }
                    if (!isValid) {
                        return res.status(401).json({message: 'Not found'});
                    } else {
                        console.log("User: " + uname + " logged in.")
                        return res.json(items);
                    }
                    //return something here
                });
            }
        });
    });

    //--Creates new user in DB from login/signup main page
    app.post('/users/create', function(req, res) {
        console.log("Request to create: " + username, password, email);
        console.log(req.body);
        var username = req.body.username;
        username = username.trim();
        var password = req.body.password;
        password = password.trim();
        var email = req.body.email;
        email = email.trim();

        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return res.status(500).json({message: 'Internal server error'});
            }

            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    return res.status(500).json({message: 'Internal server error'});
                }

                User.create({
                    username: username,
                    password: hash,
                    email: email
                }, function(err, item) {
                    if (err) {
                        return res.status(500).json({message: 'Couldnt create user, already exists'});
                    }
                    if (item) {
                        console.log("User: " + username + " created with hash and email" + email);
                        return res.json(item);
                    }
                });
            });
        });
    });


    /*  Adds menu data to existing user - DEV USE ONLY
        This API adds an entry for the monday menu only, for testing, to see the DB with data.  Takes the unique user _id field as key, and updates the monday record.
    */

    app.post('/update', function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        var _id = req.body.uid;
        var fromElement = req.body.fromElement;
        var toElement = req.body.toElement;
        var foodID = req.body.foodID;
        var name = req.body.name;
        var url = req.body.url;
        var rating = req.body.rating;

        //console.log(_id, toElement, foodID, rating, url);
        User.findByIdAndUpdate(
            _id,
            {$push: { [toElement]: {foodID: foodID,
                            name: name,
                              url: url,
                              rating: rating
                          }}},
            {safe:true, upsert: true, new: true},
            function(err, model) {
                console.log(err, model);
            }
        );
    });



    //Delete a menu item in the DB
    app.delete('/remove', function(req, res) {
        var _id = req.body.uid;
        var fromElement = req.body.fromElement;
        var foodID = req.body.foodID;
        console.log("deleting?");

        User.findByIdAndRemove(
          _id,
          {$pop: { [fromElement]: { foodID: foodID
                            }}},
            function(err, model) {
                console.log(err, model);
            }
        );

    });

    /* Return a user's menu object for display on the main page, typically done once after login */
    app.get('/menu', function(req, res) {
        var _id = req.params._id;
        User.findOne({
            _id : _id
        }, function(err, items) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            } else {
                res.json(items);
            }
        });
    });

    //REMOVES Team by ID from DB
    app.delete('/users/:id', function(req,res) {
       User.remove({
           _id: req.params.id
       }, function(err,item) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            res.status(201).json(item);
       });
    });

    server.listen(3000, function() {
        console.log('Server started, listening on *:3000');
    });

}
