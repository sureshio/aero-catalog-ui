/**
 * @ngdoc function
 * @name heritageApp.controller:QuestionListCtrl
 * @description
 * # QuestionListCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('QuestionListCtrl', [
        '$scope',
        '$uibModal',
        'SweetAlert',
        'Config',
        'QuestionFactory',
        function ($scope, $uibModal, SweetAlert, Config, QuestionFactory) {
            'use strict';
            var i = 0;
            $scope.isEdit = false;
            $scope.isDisabled = true;
            $scope.loadingDiv = true;
            $scope.isAllChecked = false;
            $scope.ids = {};
            $scope.questionList = [];
            $scope.temp = {};
            $scope.grid = {
                CURRENT_PAGE: 1,
                TOTAL_RECORDS: 0,
                NUM_PAGES: 0
            };
            $scope.event = {
                columns: [{
                    key: 'questionText',
                    clickCount: 0
                }, {
                    key: 'correctAnswer',
                    clickCount: 0
                }, {
                    key: 'wrongAnswer1',
                    clickCount: 0
                }, {
                    key: 'wrongAnswer2',
                    clickCount: 0
                }, {
                    key: 'wrongAnswer3',
                    clickCount: 0
                }]
            };

            $scope.question = {
                "questionSet": {
                    "id": '',
                    "name": 'Select...',
                    "category": {
                        "id": '',
                        "name": 'Select...'
                    }
                },
                "text": '',
                "isTrueFalse": false,
                "correctAnswer": '',
                "wrongAnswer1": '',
                "wrongAnswer2": '',
                "wrongAnswer3": ''
            };

            $scope.reset = function () {
                $scope.isEdit = false;
                $scope.question = {
                    "questionSet": {
                        "id": '',
                        "name": 'Select...',
                        "category": {
                            "id": '',
                            "name": 'Select...'
                        }
                    },
                    "text": '',
                    "isTrueFalse": false,
                    "correctAnswer": '',
                    "wrongAnswer1": '',
                    "wrongAnswer2": '',
                    "wrongAnswer3": ''
                }
            };

            $scope.checkSelected = function (idsArr) {
                for (var key in idsArr) {
                    if (idsArr[key]) {
                        return true;
                    }
                }
            };

            function retrieveSelectedIds() {
                var idArray = [];

                for (var key in $scope.ids) {
                    if ($scope.ids.hasOwnProperty(key)) {
                        if ($scope.ids[key]) {
                            idArray.push(key);
                        }
                    }
                }

                var idStr = idArray.join();
                return idStr;
            }

            function calculatePage() {
                var noOfPages = Math.ceil($scope.grid.TOTAL_RECORDS / Config.GRID_LIMIT);
                $scope.grid.NUM_PAGES = noOfPages;

            };

            function loadAllQuestions(arg_start, arg_limit, arg_filter, arg_sort) {
                QuestionFactory.findAll(arg_start, arg_limit, arg_filter, arg_sort).then(function (response) {
                    $scope.questionList = response.data.resultset;
                    $scope.grid.CURRENT_PAGE = arg_start + 1;
                    $scope.grid.TOTAL_RECORDS = response.data.totalRecords;
                    calculatePage();
                    $scope.loadingDiv = false;
                }, function (response) {
                    SweetAlert.swal('Error', response.data.message, 'error');
                });
            }

            function init() {
                loadAllQuestions(Config.GRID_START, Config.GRID_LIMIT, null, null);
            }

            init();

            $scope.$watch('isAllChecked', function (newValue, oldValue) {
                $scope.questionList.forEach(function (element) {
                    $scope.ids[element.id] = newValue;
                });
            }, true);

            $scope.$watch('ids', function (newValue, oldValue) {
                if (Object.keys(newValue).length > 0) {
                    var count = 0;

                    for (var key in newValue) {
                        if (newValue.hasOwnProperty(key)) {
                            if (newValue[key]) {
                                count += 1;
                            }
                        }
                    }
                    $scope.isAllChecked = (count === $scope.questionList.length);
                }
            }, true);

            $scope.sort = function (arg_col) {
                $scope.loadingDiv = true;
                var obj = null;
                for (i = 0; i < $scope.event.columns.length; i += 1) {
                    var col = $scope.event.columns[i];
                    if (col.key === arg_col) {
                        if (col.clickCount === 2) {
                            col.clickCount = 0;
                        } else {
                            col.clickCount += 1;
                            obj = {};
                            obj.type = arg_col;
                            if (col.clickCount === 1) {
                                obj.value = 'asc';
                            }
                            if (col.clickCount === 2) {
                                obj.value = 'desc';
                            }
                        }
                    } else {
                        col.clickCount = 0;
                    }
                }
                if (arg_col) {
                    loadAllQuestions(Config.GRID_START, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, obj);
                }
            };

            $scope.refreshQuestionList = function () {
                $scope.loadingDiv = true;
                for (var j = 0; j < $scope.event.columns.length; j += 1) {
                    var col = $scope.event.columns[j];
                    col.clickCount = 0;
                }
                $scope.temp.filter = null;
                loadAllQuestions(Config.GRID_START, Config.GRID_LIMIT, $scope.temp.filter, null);
            };

            $scope.showQSFilter = function (size) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'modalQSNFilter.html',
                    controller: 'QSNFilterController',
                    size: size,
                    resolve: {
                        filterType: function () {
                            return 'question';
                        },
                        type: function () {
                            return 'CN';
                        }
                    }
                });

                modalInstance.result.then(function (response) {
                    if (response) {
                        $scope.loadingDiv = true;
                        $scope.temp.filter = response;
                        loadAllQuestions(Config.GRID_START, Config.GRID_LIMIT, response, null);
                    }
                }, function () {

                });
            };

            $scope.next = function () {
                if ($scope.grid.CURRENT_PAGE < $scope.grid.NUM_PAGES) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE += 1;
                    loadAllQuestions($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, null);
                }
                $scope.isAllChecked = false;
            };

            $scope.previous = function () {
                if ($scope.grid.CURRENT_PAGE > 1) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE -= 1;
                    loadAllQuestions($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, null);
                }
                $scope.isAllChecked = false;
            };

            $scope.removeQuestions = function () {
                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "You want to delete these Questions!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Delete",
                        closeOnConfirm: false
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            QuestionFactory.delete(retrieveSelectedIds()).then(function (response) {
                                SweetAlert.swal('Success', response.data.message, 'success');
                                loadAllQuestions(Config.GRID_START, Config.GRID_LIMIT, null, null);
                            }, function (response) {
                                if (response.status == 500) {
                                    SweetAlert.swal('Error', response.data.message, 'error');
                                } else {
                                    SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                                }
                            });
                        }
                        $scope.reset();
                    });
            };
        }
    ]);
