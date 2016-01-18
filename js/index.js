$(document).ready(function() {
  units = '';
  getLoc();

  $('#switch-temp').on('click', function() {
    if (units == 'metric') {
      units = 'imperial';
      $('#switch-temp').text('C');
    } else {
      units = 'metric';
      $('#switch-temp').text('F');
    }
    getLoc();
  });
  
  // Whooooo are you? Who Who? Who Who?
  function getLoc() {
    
    $.get('http://freegeoip.net/json/?q=', function(response) {
      if (units == '') {
        units = getUnits(response.country_code);
      }
      
      var weatherQuery = 'http://api.openweathermap.org/data/2.5/weather?q=' + response.city + ',' + response.country_code + '&units=' + units + '&APPID=a546a7b045ca006243d6590b9644fca4';
      var weatherForecast = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + response.city + ',' + response.country_code + '&units=' + units + '&cnt=6' + '&APPID=a546a7b045ca006243d6590b9644fca4';
      
      $('#city').text(response.city + ', ' + response.region_name + ', ' + response.country_name);
      
      getWeather(weatherQuery, weatherForecast);
      
    }, 'jsonp');
  }

  function getWeather(weatherQuery, weatherForecast) {
    // Get and display current weather info
    $.get(weatherQuery, function(weather) {
      
      //var units = getUnits(weather.sys.country);
      var unitAbb = getUnitAbb(units);
      var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'];
      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'];
      
      // Get today's date
      var today = new Date(weather.dt * 1000);
      var day = today.getDay();
      var month = today.getMonth();
      
      // Show current temperature
      //$('#city').text(weather.name + ', ' + weather.sys.country);
      $('#today').text(days[today.getDay()] + ', ' + today.getDate() +  ' ' + months[today.getMonth()] + ' ' + today.getFullYear());
      $('#temp').text(Math.round(weather.main.temp * 10) / 10 + '°' + unitAbb);

      // Show max and min temperature
      $('#max-temp').text(Math.round(weather.main.temp_max * 10) / 10 + '°');
      $('#min-temp').text(Math.round(weather.main.temp_min * 10) / 10 + '°');
      
      // Show icon and current conditions
      $('#weather-icon').attr('src', 'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png');
      $('#condition').text(weather.weather[0].main);
      
      changeBackground(weather.weather[0].id);
    }, "jsonp");
    
    // Get and display forecast
    $.get(weatherForecast, function(forecast) {
      
      var units = getUnits(forecast.city.country);
      var unitAbb = getUnitAbb(units);
      var day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      
      for (var i = 1; i < 6; i++) {
        var currentDate = new Date(forecast.list[i].dt * 1000);
        var currentDay = currentDate.getDay();
        var currentNoDay = currentDate.getDate();
        $('#day' + i).text(day[currentDay]);
        $('#date' + i).text(currentNoDay);
        $('#weather-icon' + i).attr('src', 'http://openweathermap.org/img/w/' + forecast.list[i].weather[0].icon + '.png');
        $('#high' + i).text('High ' + Math.round(forecast.list[i].temp.max * 10) / 10 + '°'); 
        $('#low' + i).text('Low ' + Math.round(forecast.list[i].temp.min * 10) / 10 + '°');
      }
    }, "jsonp");
  }

  function getUnits(country) {
    if (country == 'US' | country == 'BS' | country == 'BZ' | country == 'PW' | country == 'KW') {
      var units = 'imperial';
    } else {
      var units = 'metric';
    }
    return units;
  }
  
  function getUnitAbb(units) {
    if (units == 'metric') {
        return 'C ';
      } else {
        return 'F ';
      }
  }
  
  function changeBackground(condition) {
    // Clear
    if (condition >= 800 && condition <= 801) {
      $('body').css('background', 'url(https://dl.dropboxusercontent.com/u/27247835/FreeCodeCamp/weatherizer/Q9bqpfu.jpg)');
    }
    
    // Rain
    if (condition >= 802 && condition <= 804) {
      $('body').css('background', 'url(https://dl.dropboxusercontent.com/u/27247835/FreeCodeCamp/weatherizer/KF7XIvx.jpg)');
    }
    
    // Thunderstorm
    if (condition >= 200 && condition <= 232) {
      $('body').css('background', 'url(https://dl.dropboxusercontent.com/u/27247835/FreeCodeCamp/weatherizer/JnwwKYM.jpg)');
    }
    
    // Rain
    if (condition >= 300 && condition <= 531) {
      $('body').css('background', 'url(https://dl.dropboxusercontent.com/u/27247835/FreeCodeCamp/weatherizer/ndBOcmW.jpg)');
    }
    
    // Snow
    if (condition >= 600 && condition <= 622) {
      $('body').css('background', 'url(https://dl.dropboxusercontent.com/u/27247835/FreeCodeCamp/weatherizer/dqtXqsd.jpg)');
    }
    
    // Haze - fog
    if (condition >= 700 && condition <= 771) {
      $('body').css('background', 'url(https://dl.dropboxusercontent.com/u/27247835/FreeCodeCamp/weatherizer/Q6eZdZk.jpg)');
    }
  }

});