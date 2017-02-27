'use strict';

describe('Controller: ForecastController', function () {

  // load the controller's module
  beforeEach(module('forecastApp'));

  var ForecastCtrl,
    scope,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    ForecastCtrl = $controller('ForecastController', {
      $scope: scope
    });
    httpBackend = $httpBackend;
  }));

  it('should reject invalid zip codes', function () {
    ForecastCtrl.zip = '1234';
    expect(ForecastCtrl.manualUpdate()).toBe(false);
    ForecastCtrl.zip = 'zip';
    expect(ForecastCtrl.manualUpdate()).toBe(false);
    ForecastCtrl.zip = '60661-6600';
    expect(ForecastCtrl.manualUpdate()).toBe(false);
  });


});
