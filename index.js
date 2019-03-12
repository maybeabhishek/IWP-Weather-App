// =======
// Imports
// =======
var express = require("express");
var app = express();

var rootRoute = require('./root.js');

// =================
// App configuration
// =================
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// Routes
app.use(rootRoute);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server is running");
});
