var router = require("express").Router();
var User = require('./models/user');

router.get("/", function (req, res) {
	res.render("index.ejs");
});

router.get("/login", function (req, res) {
	res.render("login.ejs");
})

router.get("/register", function (req, res) {
	res.render("register.ejs");
})

router.post("/register/user", function (req, res) {
		var userData = {
			email: req.body.user.email,
			user: req.body.user.username,
			password: req.body.user.password,
		}
		User.create(userData,function(err,user){
			if(err) return next(err);
			else	return res.redirect('/profile');

		});
		
})

router.get("/profile", function(req,res){
	res.render("profile.ejs");
})

router.get("/prediction", function(req, res){
	res.render("prediction.ejs");
});
module.exports = router;
