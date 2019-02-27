/**
 * @ngdoc function
 * @name heritageApp.controller:BiographyListCtrl
 * @description
 * # BiographyListCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('BiographyListCtrl', [
        '$scope',
        '$sce',
        'Config',
        '$timeout',
        'SweetAlert',
        'QuestionFactory',
        function ($scope, $sce, Config, $timeout, SweetAlert, QuestionFactory) {
            'use strict';
            var vm = this;

            function errorCallBack(response) {
                if (response.data.message) {
                    SweetAlert.swal('Error', response.data.message, 'error');
                } else {
                    SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                }
            }

            function loadAllBiographies() {
                QuestionFactory.findAllBiographies().then(function (response) {
                    response.data.forEach(function (element, index, array) {
                        vm.photoList.push({
                            index: index,
                            id: element.id,
                            title: element.title,
                            description: element.description,
                            picture: element.picture
                        });

                        if (index === 0) {
                            vm.current.index = index;
                            vm.current.id = element.id;
                            vm.current.title = element.title;
                            vm.current.description = element.description;
                            vm.current.picture = element.picture;
                        }
                    });

                    vm.loadingDiv = false;
                }, errorCallBack);
            }

            function init() {
                vm.loadingDiv = true;
                vm.index = 0;
                vm.photoList = [];
                vm.current = {
                    index: 0,
                    id: '',
                    title: '',
                    description: '',
                    picture: ''
                };

                loadAllBiographies();
            }

            init();

            vm.ddlTitle_OnChange = function () {
                $timeout(function () {
                    vm.index = vm.current.index;
                }, 1000);
            };

            vm.next = function () {
                //vm.loadingDiv = true;
                if(vm.index < vm.photoList.length) {

                    vm.index += 1;
                    var result = vm.photoList.filter(function(element, index, array) {
                        return (element.index === vm.index);
                    });
                    if(result.length > 0) {
                        vm.current = result[0];
                    }
                    //vm.loadingDiv = false;
                }

                //vm.loadingDiv = false;
            };

            vm.previous = function () {
                //vm.loadingDiv = true;
                if(vm.index > 0) {
                    vm.index -= 1;
                    var result = vm.photoList.filter(function(element, index, array) {
                        return (element.index === vm.index);
                    });
                    if(result.length > 0) {
                        vm.current = result[0];
                    }
                    //vm.loadingDiv = false;
                }
            };
        }]);
