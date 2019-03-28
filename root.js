

var router = require("express").Router();

router.get("/", function (req, res) {
	res.render("index.ejs");
});

router.get("/prediction", function(req, res){
	res.render("prediction.ejs");
});
module.exports = router;
