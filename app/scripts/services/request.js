'use strict';

/**
 * @ngdoc service
 * @name forecastApp.request
 * @description
 * # request
 * Factory in the forecastApp.
 */
angular.module('forecastApp')
  .factory('request', ['$http', '$q', function ($http, $q) {
    
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday', 'Saturday',];


    //retrieve six day forecast for current zip
    //returns promise for forecast request
    var getForecast = function getForecast(zip){
      var req = {
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + 
              zip + ',us&units=imperial&cnt=6&APPID=a5f87f1a4aecee0a31c962e668559da3'
      };

      //request the forecast
      return $http(req).then(function(response){
        var result = response.data,
            i,
            end = result.list.length,
            day,
            date = new Date().getDay(),
            forecast = [],
            current;

        //update city name
        forecast.push(result.city.name);

        for (i = 0; i < end; i++){
          day = result.list[i];
          //build forecast from response data
          current = {
            'weekday': weekdays[date],
            'temp': Math.floor(day.temp.day),
            'high': Math.floor(day.temp.max),
            'low': Math.floor(day.temp.min),
            'sky': day.clouds,
            'weather': day.weather[0].main
          };

          if (current.weather === 'Snow'){
            current.weather = 'Chance of snow';
          } else if (current.weather === 'Rain'){
            current.weather = 'Chance of rain';
          }

          forecast.push(current);
          //represents day of the week
          date = (date + 1) % 7;
        }
        return forecast;
      }, function(){
        //TODO add error message
        console.log('request failed');
      });
    };

      //use geolocation to get current position
    //returns promise for location request
    var getLocation = function getLocation(){
      var deferred = $q.defer();
      if(window.navigator.geolocation){
        window.navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject);
      } else {
        deferred.reject('Browser does not support geolocation');
      }
      return deferred.promise;
    };

    //use google maps api to translate coordinates into zip
    //returns promise for api call
    var getZip = function getZip(lat, long){
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
    };

    return {
      getForecast: getForecast,
      getLocation: getLocation,
      getZip: getZip
    };

  }]);
