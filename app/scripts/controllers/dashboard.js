/**
 * @ngdoc function
 * @name heritageApp.controller:DashboardController
 * @description
 * # DashboardController
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('DashboardController', [
        '$scope',
        '$state',
        '$uibModal',
        'Config',
        'store',
        'QuestionFactory',
        'SweetAlert',
        'DashboardFactory',
        'QuizFactory',
        function ($scope, $state, $uibModal, Config,store, QuestionFactory, SweetAlert, DashboardFactory, QuizFactory) {
            'use strict';

            var vm = this;

            function errorCallback(response) {
                if(response.data.message) {
                    SweetAlert.swal('Error', response.data.message, 'error');
                } else {
                    SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                }
            }

            function loadDashboard() {
                DashboardFactory.load().then(function (response) {

                    for (var j = 0; j < response.data.categoryList.length; j++) {
                        if (response.data.categoryList[j].name.indexOf("Arts") !== -1) {
                            vm.categoryArts = {
                                id: response.data.categoryList[j].id,
                                name: response.data.categoryList[j].name
                            };
                        }
                        if (response.data.categoryList[j].name.indexOf("History") !== -1) {
                            vm.categoryHistory = {
                                id: response.data.categoryList[j].id,
                                name: response.data.categoryList[j].name
                            };
                        }
                        if (response.data.categoryList[j].name.indexOf("Science") !== -1) {
                            vm.categoryScience = {
                                id: response.data.categoryList[j].id,
                                name: response.data.categoryList[j].name
                            };
                        }
                        if (response.data.categoryList[j].name.indexOf("Sports") !== -1) {
                            vm.categorySports = {
                                id: response.data.categoryList[j].id,
                                name: response.data.categoryList[j].name
                            };
                        }
                        if (response.data.categoryList[j].name.indexOf("Custom") !== -1) {
                            vm.categoryQuizAssess = {
                                id: response.data.categoryList[j].id,
                                name: 'Quiz Assessment'
                            };
                        }
                    }

                    if (response.data.isSessionAvailable) {
                        if (response.data.session.categoryID === vm.categoryArts.id) {
                            vm.isSessionAvailableArts = true;
                        }
                        if (response.data.session.categoryID === vm.categoryHistory.id) {
                            vm.isSessionAvailableHistory = true;
                        }
                        if (response.data.session.categoryID === vm.categoryScience.id) {
                            vm.isSessionAvailableScience = true;
                        }
                        if (response.data.session.categoryID === vm.categorySports.id) {
                            vm.isSessionAvailableSports = true;
                        }
                        if (response.data.session.categoryID === vm.categoryQuizAssess.id) {
                            vm.isSessionAvailableQuizAssess = true;
                        }

                        vm.session.category.id = response.data.session.categoryID;
                        vm.session.questionSet.id = response.data.session.questionSetID;
                    }

                    vm.loadingDiv = false;
                }, errorCallback);
            }

            function init() {
                vm.loadingDiv = true;
                vm.info = {};
                if (store.get('info')) {
                    vm.info = angular.fromJson(store.get('info'));
                }

                vm.session = {
                    category: {
                        id: ''
                    },
                    questionSet: {
                        id: ''
                    }
                };
                vm.isSessionAvailableArts = false;
                vm.isSessionAvailableSports = false;
                vm.isSessionAvailableQuizAssess = false;
                vm.isSessionAvailableScience = false;
                vm.isSessionAvailableHistory = false;
                vm.resumeExamContent = {};
                vm.categoryArts = {
                    id: '',
                    name: ''
                };
                vm.categoryHistory = {
                    id: '',
                    name: ''
                };
                vm.categoryScience = {
                    id: '',
                    name: ''
                };
                vm.categorySports = {
                    id: '',
                    name: ''
                };
                vm.categoryQuizAssess = {
                    id: '',
                    name: ''
                };

                loadDashboard();
            }

            vm.continueExam = function () {
                $state.go('home.quiz', {
                    id: vm.session.questionSet.id,
                    type: Config.QUIZ_CONTD
                });
            };

            init();

            vm.showQuestionSet = function (arg_item) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'modalQS.html',
                    controller: 'ModalShowQuestionSetCtrl as vm',
                    size: 'sm',
                    resolve: {
                        category: function () {
                            return arg_item;
                        }
                    }
                });

                modalInstance.result.then(function (argQuestionSet) {
                    QuizFactory.deleteSession(argQuestionSet.id).then(function () {
                        $state.go('home.quiz', {
                            id: argQuestionSet.id,
                            type: Config.QUIZ_NEW
                        });
                    }, errorCallback);
                }, function () {

                });
            };

            vm.redirectToMyProfile = function () {
                $state.go('home.administrator.edit', {
                    id: vm.info.userId
                });
            };

            vm.redirectToOptionMenu = function () {
                $state.go('home.option');
            };

            vm.logout = function () {
                store.remove('info');
                $state.go('sign-in');
            };
        }]);
