/**
 * @ngdoc function
 * @name heritageApp.controller:QuestionCreateCtrl
 * @description
 * # QuestionCreateCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('QuestionCreateCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'SweetAlert',
        'CategoryFactory',
        'QuestionSetFactory',
        'QuestionFactory',
        function ($scope, $state, $stateParams, SweetAlert, CategoryFactory, QuestionSetFactory, QuestionFactory) {
            'use strict';

            function errorCallback(response) {
                if (response.status !== 401) {
                    if(response.data.message) {
                        SweetAlert.swal('Error', response.data.message, 'error');
                    } else {
                        SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                    }
                }
            }
            $scope.redirectToCategory = function () {
                $state.go('home.category.index', {returnState: 'home.question.create', returnParams: {id: $stateParams.id}});
            };
            $scope.redirectToQuestionSet = function () {
                $state.go('home.questionset.index', {returnState: 'home.question.create', returnParams: {id: $stateParams.id}});
            };

            function loadAllCategories() {
                CategoryFactory.findAll().then(function (response) {
                    $scope.categoryList = response.data;
                }, errorCallback);
            }

            function validateQuestionForm() {
                if (!$scope.question.category.id) {
                    SweetAlert.swal('Warning', 'You must select Category Name!', 'warning');
                    return false;
                }
                if (!$scope.question.questionSet.id) {
                    SweetAlert.swal('Warning', 'You must select Question Set Name!', 'warning');
                    return false;
                }
                if (!$scope.question.text) {
                    SweetAlert.swal('Warning', 'Question should not be empty!', 'warning');
                    return false;
                }
                /*if (!new String($scope.question.correctAnswer)) {
                    SweetAlert.swal('Error', "Please enter correctAnswer!", 'error');
                    return false;
                }
                if (!new String($scope.question.wrongAnswer1)) {
                    SweetAlert.swal('Error', "Please enter wrongAnswer1!", 'error');
                    return false;
                }
                if (!$scope.question.isTrueFalse) {
                    if (!$scope.question.wrongAnswer2) {
                        SweetAlert.swal('Error', "Please enter wrongAnswer2!", 'error');
                        return false;
                    }
                    if (!$scope.question.wrongAnswer3) {
                        SweetAlert.swal('Error', "Please enter wrongAnswer3!", 'error');
                        return false;
                    }
                }*/
                if (!$scope.question.isTrueFalse) {
                    if (!$scope.question.correctAnswer) {
                        SweetAlert.swal('Error', "Please enter correctAnswer!", 'error');
                        return false;
                    }
                    if (!$scope.question.wrongAnswer1) {
                        SweetAlert.swal('Error', "Please enter wrongAnswer1!", 'error');
                        return false;
                    }
                    if (!$scope.question.wrongAnswer2) {
                        SweetAlert.swal('Error', "Please enter wrongAnswer2!", 'error');
                        return false;
                    }
                    if (!$scope.question.wrongAnswer3) {
                        SweetAlert.swal('Error', "Please enter wrongAnswer3!", 'error');
                        return false;
                    }
                } else {
                    if ($scope.question.correctAnswer.length == 0) {

                        SweetAlert.swal('Error', "Please enter correctAnswer!", 'error');
                        return false;
                    }
                    if ($scope.question.wrongAnswer1.length == 0) {

                        SweetAlert.swal('Error', "Please enter wrongAnswer!", 'error');
                        return false;
                    }
                }

                return true;
            }

            function init() {
                $scope.question = {
                    id: '',
                    category: {
                        id: '',
                        name: 'Select...'
                    },
                    questionSet: {
                        id: '',
                        name: 'Select...'
                    },
                    text: '',
                    isTrueFalse: false,
                    correctAnswer: '',
                    wrongAnswer1: '',
                    wrongAnswer2: '',
                    wrongAnswer3: ''
                };
                $scope.categoryList = [];
                $scope.questionSetList = [];

                loadAllCategories();
            }

            init();

            $scope.loadAllQuestionSetsByCategoryId = function (arg_category_id) {
                QuestionSetFactory.findByCategoryId(arg_category_id).then(function (response) {
                    $scope.questionSetList = response.data;
                }, errorCallback);
            };

            $scope.reset = function () {
                init();
            };

            $scope.toggleQuestion = function () {
                $scope.question.correctAnswer = '';
                $scope.question.wrongAnswer1 = '';
                if ($scope.question.isTrueFalse) {
                    $scope.question.wrongAnswer2 = '';
                    $scope.question.wrongAnswer3 = '';
                }
            };

            $scope.toggleAnswer = function (arg_initiator, arg_target) {
                $scope.question[arg_target] = !$scope.question[arg_initiator];
            };

            $scope.addQuestion = function () {
                if (validateQuestionForm()) {
                    QuestionFactory.create($scope.question).then(function (response) {
                        SweetAlert.swal('Success', response.data.message, 'success');
                        init();
                    }, errorCallback);
                }
            };
        }]);
