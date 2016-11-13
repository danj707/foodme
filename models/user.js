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
      monday : [  {foodID: String, name: String, url: String, rating: Number}
      ],
      tuesday : [  {foodID: String, name: String, url: String, rating: Number}
      ],
      wednesday : [  {foodID: String, name: String, url: String, rating: Number}
      ],
      thursday : [  {foodID: String, name: String, url: String, rating: Number}
      ],
      friday : [  {foodID: String, name: String, url: String, rating: Number}
      ],
      saturday : [  {foodID: String, name: String, url: String, rating: Number}
      ],
      sunday : [  {foodID: String, name: String, url: String, rating: Number}
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
