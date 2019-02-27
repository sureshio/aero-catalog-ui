'use strict';

describe('Filter: limitToText', function () {

  // load the filter's module
  beforeEach(module('heritageApp'));

  // initialize a new instance of the filter before each test
  var limitToText;
  beforeEach(inject(function ($filter) {
    limitToText = $filter('limitToText');
  }));

  it('should return the input prefixed with "limitToText filter:"', function () {
    var text = 'angularjs';
    expect(limitToText(text)).toBe('limitToText filter: ' + text);
  });

});
