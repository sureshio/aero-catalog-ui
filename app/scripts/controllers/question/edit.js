/**
 * @ngdoc function
 * @name heritageApp.controller:QuestionEditCtrl
 * @description
 * # QuestionEditCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('QuestionEditCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'SweetAlert',
        'QuestionFactory',
        'CategoryFactory',
        'QuestionSetFactory',
        function ($scope, $state, $stateParams, SweetAlert, QuestionFactory, CategoryFactory, QuestionSetFactory) {
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
                $state.go('home.category.index', {returnState: 'home.question.edit', returnParams: {id: $stateParams.id}});
            };
            $scope.redirectToQuestionSet = function () {
                $state.go('home.questionset.index', {returnState: 'home.question.edit', returnParams: {id: $stateParams.id}});
            };

            function loadQuestionDetails(arg_questionSet_id) {
                QuestionFactory.findByQuestionID(arg_questionSet_id).then(function (response) {
                    $scope.question.id = response.data.id;
                    $scope.question.questionSet.id = response.data.questionSet.id;
                    $scope.question.questionSet.name = response.data.questionSet.name;
                    $scope.question.category.id = response.data.questionSet.category.id;
                    $scope.question.category.name = response.data.questionSet.category.name;
                    $scope.question.text = response.data.text;
                    $scope.question.isTrueFalse = response.data.isTrueFalse;
                    if ($scope.question.isTrueFalse) {
                        $scope.question.correctAnswer = response.data.correctAnswer;
                        $scope.question.wrongAnswer1 = response.data.wrongAnswer1;
                    } else {
                        $scope.question.correctAnswer = response.data.correctAnswer;
                        $scope.question.wrongAnswer1 = response.data.wrongAnswer1;
                        $scope.question.wrongAnswer2 = response.data.wrongAnswer2;
                        $scope.question.wrongAnswer3 = response.data.wrongAnswer3;
                    }
                    $scope.loadAllQuestionSetsByCategoryId($scope.question.category.id);
                }, errorCallback);
            }

            function loadAllCategories() {
                CategoryFactory.findAll().then(function (response) {
                    $scope.categoryList = response.data;
                    $scope.loadingDiv = false;
                }, errorCallback);
            }

            $scope.loadAllQuestionSetsByCategoryId = function (arg_category_id) {
                QuestionSetFactory.findByCategoryId(arg_category_id ? arg_category_id : -1).then(function (response) {
                    $scope.questionSetList = response.data;
                }, errorCallback);
            }

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

            function init() {
                $scope.isEdit = false;
                $scope.loadingDiv = true;
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
                loadAllCategories();
                loadQuestionDetails($stateParams.id);

            }

            init();

            function validateQuestionForm() {
                if (!$scope.question.category.id) {
                    SweetAlert.swal('Warning', 'You must select Category Name!', 'warning');
                    return false;
                }
                if (!$scope.question.questionSet.id) {
                    SweetAlert.swal('Warning', 'You must select Category Name!', 'warning');
                    return false;
                }
                if (!$scope.question.text) {
                    SweetAlert.swal('Warning', 'Question should not be empty!', 'warning');
                    return false;
                }
                if (!new String($scope.question.correctAnswer)) {
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
                }

                return true;
            }

            $scope.editQuestion = function () {
                $scope.isEdit = true;

                if($scope.question.isTrueFalse){
                    $scope.question.correctAnswer = ($scope.question.correctAnswer === 'true');
                    $scope.question.wrongAnswer1 = ($scope.question.wrongAnswer1 === 'true');
                }else {
                    $scope.question.correctAnswer = $scope.question.correctAnswer;
                    $scope.question.wrongAnswer1 = $scope.question.wrongAnswer1;
                    $scope.question.wrongAnswer2 = $scope.question.wrongAnswer2;
                    $scope.question.wrongAnswer3 = $scope.question.wrongAnswer3;
                }


            };

            $scope.updateQuestion = function () {
                if (validateQuestionForm()) {
                    QuestionFactory.update($scope.question).then(function (response) {
                        SweetAlert.swal('Success', response.data.message, 'success');
                        init();
                    }, errorCallback);
                }
            };
        }]);
