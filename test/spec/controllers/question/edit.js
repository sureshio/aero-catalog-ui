'use strict';

describe('Controller: QuestionEditCtrl', function () {

  // load the controller's module
  beforeEach(module('heritageApp'));

  var QuestionEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestionEditCtrl = $controller('QuestionEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(QuestionEditCtrl.awesomeThings.length).toBe(3);
  });
});
