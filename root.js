

var app = require("express")();
var router = app.router();

router.get("/",function(req, res){
	res.render("index.ejs");
});

module.exports = router;
