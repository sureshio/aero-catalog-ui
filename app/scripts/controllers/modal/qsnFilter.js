angular.module('heritageApp')
    .controller('QSNFilterController', ['$scope', '$uibModalInstance', 'filterType', function ($scope, $uibModalInstance, filterType) {
        'use strict';

        $scope.searchText = '';
        $scope.type = '';
        $scope.searchTypeDesc = '';
        $scope.searchType = '';

        switch (filterType) {
            case 'grade':
                $scope.searchType = 'GN';
                break;
            case 'question':
                $scope.searchType = 'QSN';
                break;
        }

        $scope.$watch('searchType', function (newValue, oldValue) {
            if (newValue == 'CN') {
                $scope.searchTypeDesc = 'Category Name (Few Letters)';
            }

            if (newValue == 'QSN') {
                $scope.searchTypeDesc = 'Question Set Name (Few Letters)';
            }

            if (newValue == 'GN') {
                $scope.searchTypeDesc = 'Grade Name (Few Letters)';
            }
        });

        $scope.ok = function () {
            if ($scope.searchType === 'CN') {
                $scope.type = 'categoryName'
            }
            if ($scope.searchType === 'QSN') {
                $scope.type = 'questionSetName'
            }
            if ($scope.searchType === 'GN') {
                $scope.type = 'gradeName'
            }
            var response = {
                type: $scope.type,
                value: $scope.searchText
            };
            $uibModalInstance.close(response);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
