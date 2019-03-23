// =======
// Imports
// =======
var express = require("express");
var mongoose = require("mongoose");
var app = express();

var rootRoute = require('./root.js');
var APIRoute = require("./api.js");

// =================
// App configuration
// =================
mongoose.connect("mongodb+srv://shrey:shrey@iwp-f62sh.mongodb.net/iwp?retryWrites=true");
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// Routes
app.use(rootRoute);
app.use(APIRoute);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server is running");
});
