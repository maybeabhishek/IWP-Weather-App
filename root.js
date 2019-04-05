var router = require("express").Router();
var User = require('./models/user');
var passport = require('passport');



router.get("/", function (req, res) {
	res.render("index.ejs");
});

//Login Routes
router.get("/login", function(req, res){
	res.render("login.ejs");
})

router.post("/login", passport.authenticate("local",{
	successRedirect: "/",
	failureRedirect: "/login"
}),function (req, res) {
	return res.send("Hello");
})


//Register Routes
router.get("/register", function (req, res) {
	res.render("register.ejs");
})

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username, email: req.body.email}),req.body.pass, function(err,user){
		if(err){
			console.log(err)
			return res.render("register.ejs");
		}
		user = req.body.username;
		passport.authenticate("local")(req,res, function(){
			res.redirect("/");
		});
	});
})

router.get('/logout',function(req, res){
	req.logOut();
	res.redirect("/");
})

// router.post("/register/user", function (req, res) {
// 	var userData = {
// 		email: req.body.email,
// 		user: req.body.username,
// 		password: req.body.pass,
// 	}
// 	loggedIn = true;
// 	user = req.body.username;
// 	User.create(userData, function (err, user) {
// 		console.log(user)
// 		if (err){ console.log(err);}
// 		else return res.redirect('/');
// 	});

// })

router.get("/profile", function (req, res) {
	res.render("profile.ejs");
})

router.get("/prediction", function (req, res) {
	dates = ['06/04/19','07/04/19','08/04/19']
	temp = ['22','24','26']
	res.render("prediction.ejs",{dates:dates, temp:temp});
});
module.exports = router;