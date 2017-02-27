'use strict';

describe('Controller: ForecastController', function () {

  // load the controller's module
  beforeEach(module('forecastApp'));

  var ForecastCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForecastCtrl = $controller('ForecastController', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should reject invalid zip codes', function () {
    ForecastCtrl.zip = '1234';
    expect(ForecastCtrl.manualUpdate()).toBe(false);
  });
});
