var router = require("express").Router();
var User = require('./models/user');
var passport = require('passport');
const request = require('request');
const data = require('./recieveData.js');

router.get("/", function (req, res) {
	if (req.user) {
		console.log(req.user.cities);
		let promise1 = new Promise((resolve, reject) => {
			var data = [];
			new Promise((resolve, reject)=>{
				request("http://localhost:3000/api/forecast/current/delhi", function(err, resp, body){
					resolve(body);
				});
			})
			.then((body)=>{
				console.log("New Promise: ", body);
				data.push(body);
				console.log("Data");
				resolve(data);
			});
		});

		promise1.then((body) => {
			console.log(body);
			res.render("index.ejs");
		})
		.catch((err)=>{
			console.log(err);
		})
	} else {
		console.log("Render");
		res.render("index.ejs");
	}
});

//Login Routes
router.get("/login",function (req, res) {
	var message = req.query.err;
	res.render("login.ejs",{message: message});
})

router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login?err=Invalid Username or Password",
	failureFlash: 'Invalid Username or Password',
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
		await User.findByIdAndUpdate(req.user._id, { $addToSet: { cities: req.params.cityname } }).catch((err) => { console.log(err) });
		console.log(req.user.cities);
		return res.send("Successfully Added City!");
	});
});

router.get("/api/forecast/current/:city", function (req, res) {
	// console.log(req.params.city);
	var input = req.params.city;
	request("https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=58b6f7c78582bffab3936dac99c31b25&units=metric", function (err, response, body) {
		// console.log(response.body);
		return res.send(response.body);
	});
});

router.get("/api/forecast/daily/:city", function (req, res) {
	var appid = '58b6f7c78582bffab3936dac99c31b25';
	console.log(req.params.city);
	var input = req.params.city;
	request("https://api.openweathermap.org/data/2.5/forecast/daily?q=" + input + "&appid=58b6f7c78582bffab3936dac99c31b25&units=metric&cnt=6", function (err, response, body) {
		// console.log(response);
		return res.send(response.body);
	});
});
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