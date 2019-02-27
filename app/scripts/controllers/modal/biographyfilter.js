/**
 * @ngdoc function
 * @name heritageApp.controller:ModalBiographyFilterCtrl
 * @description
 * # ModalBiographyFilterCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
  .controller('ModalBiographyFilterCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
    'use strict';

    function init() {
      $scope.search = {
        text: ''
      };
    }

    init();

    $scope.ok = function () {
      $uibModalInstance.close($scope.search.text);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);
