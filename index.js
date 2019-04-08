// =======
// Imports
// =======
var express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require('passport');
var rootRoute = require('./root.js');
var User = require('./models/user')
var LocalStrategy = require('passport-local');
var flash = require('connect-flash');
passportLocalMongoose = require("passport-local-mongoose");


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var app = express();
app.use(flash());
app.use(require('express-session')({
  secret: "Data ata data dataata",
  resave: false,
  saveUninitialized: false
}))
// =================
// App configuration
// =================
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res, next){
  res.locals.username = req.user;
  next();
})

//connect to mongo db
mongoose.connect('mongodb://localhost/weather-api'); 
// var db = mongoose.connection;

// //handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log("connected");
// });



app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Routes
app.use(rootRoute);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server is running");
});
