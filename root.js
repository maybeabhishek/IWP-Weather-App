var router = require("express").Router();
var User = require('./models/user');
var passport = require('passport');
const request = require('request');
const data = require('./recieveData.js');
const requestIp = require("request-ip");

router.get("/", async function (req, res) {
	const clientIp = requestIp.getClientIp(req); 
	console.log("IP:", clientIp);
	var data = [];
	
	
	if (req.user) {
		console.log(req.user.cities);

		
		const getCityDetails = city => new Promise((resolve, reject) => {
			request("http://localhost:3000/api/forecast/current/" + city, function (err, response, body) {
			
				data.push({"name": JSON.parse(body).name,"temp": Math.round(JSON.parse(body).main.temp*10)/10, "description":JSON.parse(body).weather[0].icon});
				return resolve();
			});
		});
		await (async function loop() {
			for (let i = 0; i < req.user.cities.length; i++) {
				await getCityDetails(req.user.cities[i]);
			}
		})();
		console.log("Data: ", data);
	} 
	
	return res.render("index.ejs", {cities: data});
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
		await User.findByIdAndUpdate(req.user._id, { $addToSet: { cities: req.params.cityname } }).catch((err) => { console.log(err) });
		console.log(req.user.cities);
		return res.send("Successfully Added City!");
	});
});

router.post("/user/city/remove/:cityname", function (req, res) {
	if (!req.isAuthenticated())
		return res.send("Error: Need to login to add city!")
	User.findById(req.user._id, async function (err, user) {
		if (err) console.log(err);
		await User.findByIdAndUpdate(req.user._id, { $pull: { cities: req.params.cityname } }).catch((err) => { console.log(err) });
		console.log(req.user.cities);
		return res.send("Successfully Removed City!");
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
	var data=[];
	
	request("http://localhost:5000", function(err, resp, body){
		if(err) console.log(err);
		console.log(body);
		// res.send(body)
		res.render("prediction.ejs", {data:JSON.parse(body)});
	});
});
module.exports = router;