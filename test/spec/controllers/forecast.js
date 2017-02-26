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

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(MainCtrl.awesomeThings.length).toBe(3);
  // });
});
