var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    registered: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        // unique: true,
        required: true
    },
    username: {
        type: String,
        // unique: true,
        // required: true
    },
    password: {
        type: String,
        // unique: true,
    },
    cities: [{type:String, lowercase:true}]
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);

module.exports = User;