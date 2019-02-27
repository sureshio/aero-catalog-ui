'use strict';

describe('Service: restInterceptor', function () {

  // load the service's module
  beforeEach(module('heritageApp'));

  // instantiate service
  var restInterceptor;
  beforeEach(inject(function (_restInterceptor_) {
    restInterceptor = _restInterceptor_;
  }));

  it('should do something', function () {
    expect(!!restInterceptor).toBe(true);
  });

});
