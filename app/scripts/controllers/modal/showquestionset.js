/**
 * @ngdoc function
 * @name heritageApp.controller:ModalShowQuestionSetCtrl
 * @description
 * # ModalShowQuestionSetCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('ModalShowQuestionSetCtrl', [
        '$scope',
        '$state',
        'CategoryFactory',
        'Config',
        '$uibModalInstance',
        'category',
        'DashboardFactory',
        'SweetAlert',
        function ($scope, $state, CategoryFactory, Config, $uibModalInstance, category, DashboardFactory, SweetAlert) {
            'use strict';

            var vm = this;

            function loadQuestionSets(id) {
                CategoryFactory.findByCategoryId(id).then(function (response) {
                    vm.questionSetList = response.data;
                    vm.questionSet = vm.questionSetList[0];
                }, function (response) {

                });
            }

            function init() {
                vm.questionSet = {
                    id: '',
                    name: ''
                };
                vm.category = category;
                vm.questionSetList = [];
                loadQuestionSets(vm.category.id);
            }

            init();

            $scope.ok = function () {
                $uibModalInstance.close(vm.questionSet);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
