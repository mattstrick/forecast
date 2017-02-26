'use strict';

/**
 * @ngdoc function
 * @name forecastApp.controller:ForecastCtrl
 * @description
 * # ForecastController
 * Controller of the forecastApp
 */
angular.module('forecastApp')
  .controller('ForecastController', ['$http', function ($http) {
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
              'Friday', 'Saturday',],
        that = this;
    //default zipcode
    that.zip = 60661;

    //update forecast based on zip
    //changes forecast array and city name
    that.updateForecast = function updateForecast(){
      var req = {
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + 
              that.zip + ',us&units=imperial&cnt=6&APPID=a5f87f1a4aecee0a31c962e668559da3'
      };

      //request the forecast
      $http(req).then(function(response){
        var result = response.data,
            i,
            end = result.list.length,
            day,
            date = new Date().getDay();

        //update city name
        that.city = result.city.name;

        that.forecast = [];

        for (i = 0; i < end; i++){
          day = result.list[i];
          //build forecast from response data
          that.forecast.push({
            'weekday': weekdays[date],
            'temp': Math.floor(day.temp.day),
            'high': Math.floor(day.temp.max),
            'low': Math.floor(day.temp.min),
            'sky': day.clouds,
            'weather': day.weather[0].main
          });
          //represents day of the week
          date = (date + 1) % 7;
        }
        console.log(that.forecast);
        console.log(result);
      }, function(){
        //TODO add error message
        console.log('request failed');
      });
    };

    //change zipcode to that of user's current location
    //if location unavailable, return false
    that.updateZip = function updateZip(){
      if(window.navigator.geolocation){
        //get coordinates
        window.navigator.geolocation.getCurrentPosition(function(pos){
          //then translate to an address
          $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+pos.coords.latitude+','+pos.coords.longitude).then(function(res){
            //and extract zip code
            //TODO only do this if the zip has changed
            //after updating the zip, also update forecast
              that.zip = res.data.results[0].address_components.slice(-1)[0].short_name;
              console.log(that.zip);
          });
        });
      } else {
        //TODO display error message to user, tell them geolocation is not supported
        return false;
      }
    };

    //Get the initial forecast for default zip
    // that.updateForecast();

  }]);
