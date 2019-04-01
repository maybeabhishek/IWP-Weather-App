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
		email: req.body.email,
		user: req.body.username,
		password: req.body.pass,
	}
	res.locals['loggedIn'] = true;
	res.locals['user'] = req.body.username;
	User.create(userData, function (err, user) {
		console.log(user)
		if (err){ console.log(err);}
		else return res.redirect('/');
	});

})

router.get("/profile", function (req, res) {
	res.render("profile.ejs");
})

router.get("/prediction", function (req, res) {
	res.render("prediction.ejs");
});
module.exports = router;