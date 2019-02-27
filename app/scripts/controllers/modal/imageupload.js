'use strict';

/**
 * @ngdoc function
 * @name heritageApp.controller:ModalImageUploadCtrl
 * @description
 * # ModalImageUploadCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
  .controller('ModalImageUploadCtrl', [
    '$scope',
    '$uibModalInstance',
    '$sce',
    'imageUrl',
    function ($scope, $uibModalInstance, $sce, imageUrl) {

      function init() {
        $scope.message = {
          type: '',
          text: ''
        };

        if (imageUrl) {
          $scope.imageSource = $sce.trustAsUrl(imageUrl);
        } else {
          $scope.imageSource = 'images/picture-01-256.png';
        }
      }

      init();

      $scope.ok = function () {
        var fileUpload = angular.element(document.querySelector("#file"));
        if (fileUpload[0].files[0]) {
          $uibModalInstance.close(fileUpload);
        } else {
          $uibModalInstance.close(null);
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.triggerFileUpload = function () {
        angular.element(document.querySelector("#file")).click();
      };

      $scope.fileNameChanged = function () {
        var fileUpload = angular.element(document.querySelector("#file"));
        if(fileUpload[0].files.length > 0) {
          console.log(fileUpload[0].files[0].size);
          console.log(fileUpload[0].value);
          var regex = /^([a-zA-Z0-9\s_\\.\-:\,\'\~\`\@\#\$\%\^\&\+\=])+(.jpg|.jpeg|.png|.gif|.bmp)$/;
          var maxSize = 5 * 1024 * 1024;

          $scope.message.type = 'text-danger';
          if (!regex.test(fileUpload[0].value.toLowerCase().replace(/\(|\)/g, ''))) {
            $scope.message.text = "Please upload a valid image file. Allowed Extensions are 'jpg', 'jpeg', 'png', 'gif', 'bmp'.";
            $scope.$apply();
            return false;
          }
          if (fileUpload[0].files[0].size > maxSize) {
            $scope.message.text = "File size is greater than 5MB.";
            $scope.$apply();
            return false;
          }

          $scope.message.text = '';
          $scope.$apply();
          if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
              $scope.imageSource = e.target.result;
              $scope.$apply();

            }
            reader.readAsDataURL(fileUpload[0].files[0]);
          } else {
            console.log("This browser does not support FileReader.");
          }
        } else {
          $scope.imageSource = 'images/picture-01-256.png';
          $scope.message.type = 'text-warning';
          $scope.message.text = "No Image selected!";
          $scope.$apply();
        }
      };
    }]);
