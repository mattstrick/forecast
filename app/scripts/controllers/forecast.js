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
    var zip = 60661,
        req,
        main = this,
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                  'Friday', 'Saturday', 'Sunday'];

    req = {
      method: 'GET',
      url: 'http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + zip +',us&units=imperial&cnt=6&APPID=a5f87f1a4aecee0a31c962e668559da3'
    };

    //request the forecast
    $http(req).then(function(response){
      var result = response.data,
          i,
          end = result.list.length,
          day,
          date = new Date().getDay();

      main.city = result.city.name;
      main.forecast = [];

      for (i = 0; i < end; i++){
        day = result.list[i];
        //build forecast from response data
        main.forecast.push({
          'date': days[date],
          'temp': Math.floor(day.temp.day),
          'high': Math.floor(day.temp.max),
          'low': Math.floor(day.temp.min),
          'sky': day.clouds,
          'weather': day.weather[0].main
        });
        //represents day of the week
        date = (date + 1) % 7;
      }
      console.log(main.forecast);
      console.log(result);
    }, function(){
      //TODO add error message
      console.log('request failed');
    });

  }]);
