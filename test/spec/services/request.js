'use strict';

describe('Service: request', function () {

  // load the service's module
  beforeEach(module('forecastApp'));

  // instantiate service
  var request,
      httpBackend;
  beforeEach(inject(function (_request_, $httpBackend) {
    request = _request_;
    httpBackend = $httpBackend;
  }));

  //TODO add tests

});
