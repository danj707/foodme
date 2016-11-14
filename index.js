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
                });
            }
        });
    });

    //--Creates new user in DB from login/signup main page
    app.post('/users/create', function(req, res) {
                console.log(req.body);
        var new_username = req.body.new_username;
        var new_password = req.body.new_password;
        var new_email = req.body.new_email;

        console.log("Request to create: " + new_username, new_password, new_email);

        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return res.status(500).json({message: 'Internal server error'});
            }

            bcrypt.hash(new_password, salt, function(err, hash) {
                if (err) {
                    return res.status(500).json({message: 'Internal server error'});
                }

                User.create({
                    username: new_username,
                    password: hash,
                    email: new_email
                }, function(err, items) {
                    if (err) {
                        return res.status(500).json({message: 'Couldnt create user, already exists'});
                    }
                    if (items) {
                        console.log("User: " + new_username + " created with hash and email" + new_email);
                        sendEmail(items.email);
                        return res.json(items);
                    }
                });
            });
        });
    });

    function sendEmail (new_username, new_email) {
        var nodemailer = require('nodemailer');
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
             service: 'Mailgun', // no need to set host or port etc.
             auth: {
                 user: 'postmaster@sandbox6c86cc7ec15f47c480d0c362483dff1a.mailgun.org',
                 pass: 'b57aaa3b2e89f81a5287973225e2884b'
             }
        });

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"FoodMe ?" <danjenner@gmail.com>', // sender address
            to: 'danjenner@gmail.com', // list of receivers
            subject: 'Welcome to FoodMe!', // Subject line
            text: 'Hello world ?', // plaintext body
            html: `<b>Welcome ${new_username}</b>` // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
}


    /* Adds and removes menu data from DB.  Remove called on portlet pickup, add called on drop */

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

        User.findByIdAndUpdate(
            _id,
            {$push: { [toElement]: {foodID: foodID,
                            name: name,
                              url: url,
                              rating: rating
                          }}},
            {safe:true, upsert: true, new: true},
            function(err, model) {
                if (err) {
                    return res.status(500).json({
                        message: "Error, can't update menu data: Add"
                    });
                } else {
                    res.json(model);
                }
            }
        );
    });

    //Delete a menu item in the DB
    app.delete('/remove', function(req, res) {
        var _id = req.body.uid;
        var fromElement = req.body.fromElement;
        var foodID = req.body.foodID;

        User.findByIdAndUpdate(
          _id,
          {$pop: { [fromElement]: { foodID: foodID
                            }}},
            function(err, model) {
                if (err) {
                    return res.status(500).json({
                        message: "Error, can't update menu data: Remove"
                    });
                } else {
                    res.json(model);
                }
            }
        );
    });

    /* Return a user's menu object for display on the main page, typically done once after login */
    app.get('/menu', function(req, res) {
        var _id = req.params._id;
        User.findOne({
            _id : _id
        }, function(err, item) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            } else {
                res.json(item);
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
