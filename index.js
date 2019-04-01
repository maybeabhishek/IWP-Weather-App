// =======
// Imports
// =======
var express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require('express-session');
var rootRoute = require('./root.js');

var app = express();

// =================
// App configuration
// =================
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//connect to mongo db
mongoose.connect('mongodb://localhost/weather'); 
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("connected");
});


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Routes
app.use(rootRoute);

app.listen(process.env.PORT || 3004, process.env.IP, function(){
	console.log("Server is running");
});
