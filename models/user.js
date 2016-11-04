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
    menu : [
      monday = {
        breakfast: [String, Number],
        lunch: [String, Number],
        dinner: [String, Number]
      },
      tuesday = {
        breakfast: String,
        lunch: String,
        dinner: String
      },
      wednesday = {
        breakfast: String,
        lunch: String,
        dinner: String
      },
      thursday = {
        breakfast: String,
        lunch: String,
        dinner: String
      },
      friday = {
        breakfast: String,
        lunch: String,
        dinner: String
      },
      weekend = {
        breakfast: String,
        lunch: String,
        dinner: String
      },
  ],
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
