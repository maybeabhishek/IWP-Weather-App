var mongoose = require('mongoose');
var passLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    registered: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    cities: [String]
});

UserSchema.plugin(passLocalMongoose);
var User = mongoose.model('User', UserSchema);

module.exports = User;