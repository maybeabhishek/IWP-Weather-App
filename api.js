var owpApiKey = "1d48703c6ea469ebb169ef3abb7aec86" // OWP
var apiKey = "mJ0F20zP4OlvYs7rNEa6TDimEgUJCry1" //AccuWeather

var express = require('express');
var request = require("request");

var router = express.Router();

// Accuweather

// Search Cities by text
router.get("/cities/search/:city", function(req, res){
  let city = req.params.city;
  var info = [];
  request("http://dataservice.accuweather.com/locations/v1/cities/search?apikey="+apiKey+"&q="+city, function(err, resp, body){
    if(err) return console.log(err);
    JSON.parse(resp["body"]).forEach((city)=>{
      info.push({"type": city.type, "name": city.EnglishName, "id": city.Region.ID, "country": city.Country.EnglishName, "dataset": city.DataSets, "geo": city.GeoPosition, "key":city.Key});
    })
    res.send(info);
  });  
});

// Search City by location key
router.get("/cities/search/key/:cityID", function(req, res){
  let cityID = req.params.cityID;
  request("https://dataservice.accuweather.com/locations/v1/"+cityID+"?apikey="+apiKey,function(err, resp, body){
    return res.send(JSON.parse(resp["body"]));
  });
});

// Get neighbours of the city
router.get("/cities/neighbours/:cityID", function(req, res){
  let cityID = req.params.cityID;
  var neighbours = [];
  request("http://dataservice.accuweather.com/locations/v1/cities/neighbors/"+cityID+"?apikey="+apiKey, function(err, resp, body){
    if(err) return console.log(err);
    JSON.parse(resp["body"]).forEach((neighbour)=>{
      neighbours.push({"key":neighbour.Key, "name": neighbour.LocalizedName, "type": neighbour.Type, "country":neighbour.Country.EnglishName});
    })
    return res.send(neighbours);
  })
});


// OpenWeather
// https://openweathermap.org/current
// https://openweathermap.org/forecast5
// https://openweathermap.org/api/uvi
// https://openweathermap.org/triggers

// get city id by name
router.get("/owp/cities/search/:cityName", function(req, res){
  
});


// Current details by city
router.get("/owp/cities/:cityName", function(req, res){
  var name = req.params.cityName;
  request("https://api.openweathermap.org/data/2.5/weather?q="+name+"&APPID="+owpApiKey, function(err, resp, body){
    if(err) return console.log(err);
    return res.send(JSON.parse(resp['body']));
  });
});

// Forecast
router.get("/owp/cities/forecast/:cityName", function(req, res){
  let name = req.params.cityName;
  request("http://samples.openweathermap.org/data/2.5/forecast?q="+name+"&appid="+owpApiKey, function(err, resp, body){
    if(err) return console.log(err);
    return res.send(JSON.parse(resp["body"]));
  })
})

module.exports = router;