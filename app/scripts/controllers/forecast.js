'use strict';

/**
 * @ngdoc function
 * @name forecastApp.controller:ForecastCtrl
 * @description
 * # ForecastController
 * Controller of the forecastApp
 */
angular.module('forecastApp')
  .controller('ForecastController', ['request', function (request) {

    var that = this;
    //only accept 5 digit zip codes
    that.validZipRegex = /(^\d{5}$)/;    

    function update(forecast){
      that.city = forecast[0];
      that.forecast = forecast.slice(1);
    }
  
    //update with user supplied zip code
    that.manualUpdate = function manualUpdate(){
      if(that.validZipRegex.test(that.zip)){
        request.getForecast(that.zip).then(function(forecast){
          update(forecast);
        });
      } else {
        return false;
      }
    };

    //update using geolocation
    //get coordinates, translate to zip, then get forecast
    that.autoUpdate = function autoUpdate(){
      that.loading = true;
      request.getLocation().then(function(position){
        //remove geolocation warning if present
        that.warning = false;
        request.getZip(position.coords.latitude, position.coords.longitude)
        .then(function(zip){
          that.zip = zip;
          request.getForecast(zip).then(function(forecast){
            update(forecast);
            that.loading = false;
          });
        });
      }, function(){
        //tell user that geolocation is disabled
          that.warning = true;
          //if position unavailable, use default zip
          that.zip = '60661';
          request.getForecast(that.zip).then(function(forecast){
            update(forecast);
            that.loading = false;
          });
      });
    };

  }]);
