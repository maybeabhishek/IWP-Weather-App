var router = require("express").Router();
var User = require('./models/user');
var passport = require('passport');
const request = require('request');
const data = require('./recieveData.js');

router.get("/", function (req, res) {
	res.render("index.ejs");
});

//Login Routes
router.get("/login", function (req, res) {
	res.render("login.ejs");
})

router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}), function (req, res) {
	return res.send("Hello");
})


//Register Routes
router.get("/register", function (req, res) {
	res.render("register.ejs");
})

router.post("/register", function (req, res) {
	User.register(new User({
		username: req.body.username,
		email: req.body.email
	}), req.body.pass, function (err, user) {
		if (err) {
			console.log(err)
			return res.redirect("/register");
		}
		user = req.body.username;
		passport.authenticate("local")(req, res, function () {
			res.redirect("/");
		});
	});
})

router.get('/logout', function (req, res) {
	req.logOut();
	res.redirect("/");
})

router.post("/user/city/add/:cityname", function (req, res) {
	if (!req.isAuthenticated())
		return res.send("Error: Need to login to add city!")
	User.findById(req.user._id, async function (err, user) {
		if (err) console.log(err);
		await User.findOneAndUpdate({
			_id: req.user._id
		}, {
			$addToSet: {
				cities: req.params.cityname
			}
		}).catch((err) => {
			console.log(err)
		});
		return "Successfully Added City!";
	});
});




router.get("/profile", function (req, res) {
	res.render("profile.ejs");
})


router.get("/prediction", async function (req, res) {
	var temp = []

	request.post('http://localhost:5000', {
		json: {
			data: '22'
		}
	}, (error, res, body) => {
		if (error) {
			console.error(error)
			return
		}
		console.log(body)
		temp = body
	})

	console.log(temp)
	dates = ['06/04/19', '07/04/19', '08/04/19']
	res.render("prediction.ejs", {
		dates: dates,
		temp: body
	});
});
module.exports = router;