
// ================
// Helper Functions
// ================

// Convert a string to title case
function titleCase(str) {
  return str.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.substring(1);
  }).join(' ');
}

// Convert day to full day
function fullDay(str) {
  switch (str) {
    case 'Tue':
      return 'Tuesday';
    case 'Wed':
      return 'Wednesday';
    case 'Thu':
      return 'Thursday';
    case 'Sat':
      return 'Saturday';
    default:
      return str + 'day';
  }
}


// Main function
$(function() {
  // All parts
  var $wrapper = $('.wrapper'),
    $panel = $wrapper.find('.panel'),
    $city = $panel.find('#city'),
    $weather = $panel.find('.weather'),
    $group = $panel.find('.group'),
    $dt = $group.find('#dt'),
    $description = $group.find('#description'),
    $wind = $group.find('#wind'),
    $humidity = $group.find('#humidity'),
    $temperature = $weather.find('#temperature'),
    $temp = $temperature.find('#temp'),
    $icon = $temp.find('#condition'),
    $tempNumber = $temp.find('#num'),
    $celsius = $temp.find('#celsius'),
    $fahrenheit = $temp.find('#fahrenheit'),
    $forecast = $weather.find('#forecast'),
    $search = $wrapper.find('search'),
    $form = $search.find('form'),
    $button = $form.find('#button');

  // use ipapi to get weather of 8.8.8.8
  $.ajax({
      dataType: 'json',
      url: 'https://ipapi.co/8.8.8.8/json/'
    })
    .then(function(data) {
      console.log(data);
      var yourLocation = data.city + ',' + data.postal + ',' + data.country;
      getWeather(yourLocation);
    });

  // Function go get weather details from openweather
  function getWeather(input) {
    // Current Weather
    var requestWeather = $.ajax({
      dataType: 'json',
      url: '/api/forecast/current/'+input
    });

    // Daily forecast
    var requestForecast = $.ajax({
      dataType: 'json',
      url: '/api/forecast/daily/'+input,
    });

    // Change classes
    $celsius.addClass('active').removeAttr('href');
    $fahrenheit.removeClass('active').attr("href", '#');
    $icon.removeClass();
    $button.removeClass().addClass('button transparent');

    // Query is taken
    requestWeather.done(function(data) {
      console.log("Weather: ", data);

      var weather = document.getElementById('weather');
      if (data.code === '404') {
        $city.html('city not found');
        weather.style.display = 'none';
      } else weather.style.display = '';

      // Get date and convert it
      var dt = new Date(data.dt * 1000).toString().split(' ');
      var title = data.sys.country? data.name + ', ' + data.sys.country: data.name;
      
      // Get data from api
      $city.html(title);
      $tempNumber.html(Math.round(data.main.temp));
      $description.html(titleCase(data.weather[0].description));
      $wind.html('Wind: ' + data.wind.speed + ' mph');
      $humidity.html('Humidity ' + data.main.humidity + '%');
      $dt.html(fullDay(dt[0]) + ' ' + dt[4].substring(0, 5));

      // Events
      $celsius.on('click', toCelsius);
      $fahrenheit.on('click', toFahrenheit);

      function toCelsius() {
        $(this).addClass('active').removeAttr('href');
        $fahrenheit.removeClass('active').attr('href', '#');
        $tempNumber.html(Math.round(data.main.temp));
      }
      
      function toFahrenheit() {
        $(this).addClass('active').removeAttr('href');
        $celsius.removeClass('active').attr("href", '#');
        $tempNumber.html(Math.round((data.main.temp + 32) * (9 / 5)));
      }

      // https://openweathermap.org/weather-conditions
      // https://erikflowers.github.io/weather-icons/
      switch (data.weather[0].icon) {
        case '01d':
          $icon.addClass('wi wi-day-sunny');
          break;
        case '02d':
          $icon.addClass('wi wi-day-sunny-overcast');
          break;
        case '01n':
          $icon.addClass('wi wi-night-clear');
          break;
        case '02n':
          $icon.addClass('wi wi-night-partly-cloudy');
          break;
      }

      switch (data.weather[0].icon.substr(0, 2)) {
        case '03':
          $icon.addClass('wi wi-cloud');
          break;
        case '04':
          $icon.addClass('wi wi-cloudy');
          break;
        case '09':
          $icon.addClass('wi wi-showers');
          break;
        case '10':
          $icon.addClass('wi wi-rain');
          break;
        case '11':
          $icon.addClass('wi wi-thunderstorm');
          break;
        case '13':
          $icon.addClass('wi wi-snow');
          break;
        case '50':
          $icon.addClass('wi wi-fog');
          break;
      }
    });

    // Forecast is taken
    requestForecast.done(function(data) {
      // Events
      // console.log("Forecast", data);
      $celsius.on('click', toCelsius);
      $fahrenheit.on('click', toFahrenheit);

      var forecast = [];
      var length = data.list.length;
      // Store all forecasts
      for (var i = 1; i < length; i++) {
        forecast.push({
          date: new Date(data.list[i].dt * 1000).toString().split(' ')[0],
          fahrenheit: {
            high: Math.round((data.list[i].temp.max + 32) * (9 / 5)),
            low: Math.round((data.list[i].temp.min + 32) * (9 / 5))
          },
          celsius: {
            high: Math.round(data.list[i].temp.max),
            low: Math.round(data.list[i].temp.min),
          }
        });
      }

      function toCelsius() {
        doForecast('celsius');
      }

      function toFahrenheit() {
        doForecast('fahrenheit');
      }

      // Show all forecasts
      function doForecast(unit) {
        var arr = [];
        var length = forecast.length;
        for (var i = 0; i < length; i++) {
          arr[i] = ("<div class='block'><h3 class='secondary'>" + forecast[i].date + "</h3><h2 class='high'>" + forecast[i][unit].high + "</h2><h4 class='secondary'>" + forecast[i][unit].low + "</h4></div>");
        }
        $forecast.html(arr.join(''));
      }

      doForecast('celsius');
    });
  }

  // When city is submitted
  $form.submit(function(event) {
    var input = document.getElementById('search').value;
    var inputLength = input.length;
    if (inputLength) getWeather(input);
    event.preventDefault();
  });

});