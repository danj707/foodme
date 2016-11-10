var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    menu : {
      monday : [  {id: String, name: String, url: String, rating: Number}
      ],
      tuesday : [  {id: String, name: String, url: String, rating: Number}
      ],
      wednesday : [  {id: String, name: String, url: String, rating: Number}
      ],
      thursday : [  {id: String, name: String, url: String, rating: Number}
      ],
      friday : [  {id: String, name: String, url: String, rating: Number}
      ],
      saturday : [  {id: String, name: String, url: String, rating: Number}
      ],
      sunday : [  {id: String, name: String, url: String, rating: Number}
      ],
  },
  faves : Array,
});

UserSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isValid) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
