'use strict';

describe('Controller: ModalShowquestionsetCtrl', function () {

  // load the controller's module
  beforeEach(module('heritageApp'));

  var ModalShowquestionsetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalShowquestionsetCtrl = $controller('ModalShowquestionsetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ModalShowquestionsetCtrl.awesomeThings.length).toBe(3);
  });
});
