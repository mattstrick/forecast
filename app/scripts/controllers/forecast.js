'use strict';

/**
 * @ngdoc function
 * @name forecastApp.controller:ForecastCtrl
 * @description
 * # ForecastController
 * Controller of the forecastApp
 */
angular.module('forecastApp')
  .controller('ForecastController', ['$http', '$q', function ($http, $q) {
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
              'Friday', 'Saturday',],
        that = this;
    //default zipcode
    that.zip = 60661;

    //retrieve six day forecast for current zip
    //returns promise for forecast request
    function getForecast(){
      var req = {
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + 
              that.zip + ',us&units=imperial&cnt=6&APPID=a5f87f1a4aecee0a31c962e668559da3'
      };

      //request the forecast
      return $http(req).then(function(response){
        var result = response.data,
            i,
            end = result.list.length,
            day,
            date = new Date().getDay(),
            forecast = [];

        //update city name
        that.city = result.city.name;

        for (i = 0; i < end; i++){
          day = result.list[i];
          //build forecast from response data
          forecast.push({
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
        return forecast;
      }, function(){
        //TODO add error message
        console.log('request failed');
      });
    }

    //use geolocation to get current position
    //returns promise for location request
    function getLocation(){
      var deferred = $q.defer();
      if(window.navigator.geolocation){
        window.navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject);
      } else {
        deferred.reject(new Error("Browser does not support geolocation"));
      }
      return deferred.promise;
    }

    //use google maps api to translate coordinates into zip
    //returns promise for api call
    function getZip(lat, long){
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long).then(function(res){
          var i,
              arr = res.data.results[0].address_components,
              end = arr.length;
          for (i = 0; i < end; i++){
            if(arr[i].types.indexOf('postal_code') !== -1){
              return arr[i].short_name;
            }
          }
      });
    }

    //get position, translate to zip, request and update forecast
    function updateForecast(){
      getLocation().then(function(position){
        console.log(position);
        getZip(position.coords.latitude, position.coords.longitude)
        .then(function(zip){
          that.zip = zip;
          getForecast().then(function(forecast){
            that.forecast = forecast;
          });
        });
      }, function(err){
        console.err(err);
      });
    }

    //Get the initial forecast for default zip
    updateForecast();

  }]);
