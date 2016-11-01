var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var bcrypt = require('bcryptjs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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

      app.get('/user', function(req, res) {
          User.find(function(err, items) {
              if (err) {
                  return res.status(500).json({
                      message: 'Internal Server Error'
                  });
              } else {
                  console.log("Got a request to disp user db data")
                  res.json(items);
              }

          });
      });

      //--Creates new user in DB from login/signup main page
        app.post('/users/create', function(req, res) {
            console.log("Request to create: " + username, password);
            console.log(req.body);
            var username = req.body.username;
            username = username.trim();
            var password = req.body.password;
            password = password.trim();


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

                User.create({
                    username: username,
                    password: hash,
                }, function(err, item) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Couldnt create user, already exists'
                        });
                    }
                    if(item) {
                        console.log("User: " + username + " created.");
                        return res.json(item);
                    }
                });
                });
            });
        });

      server.listen(3000, function() {
        console.log('Server started, listening on *:3000');
    });

}
