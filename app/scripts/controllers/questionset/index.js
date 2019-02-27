angular.module('heritageApp')
    .controller('QuestionSetIndexCtrl', [
        '$scope',
        '$state',
        'store',
        '$stateParams',
        'CategoryFactory',
        'QuestionSetFactory',
        'SweetAlert',
        '$uibModal',
        'Config',
        function ($scope, $state,store, $stateParams, CategoryFactory, QuestionSetFactory,  SweetAlert, $uibModal, Config) {
            'use strict';
            var i = 0;
            $scope.loadingDiv = true;
            $scope.isEdit = false;
            $scope.isCollapsed = false;
            $scope.searchText = '';
            $scope.userIdInfo = {};
            $scope.questionSetList = [];
            $scope.categories = [];
            $scope.temp = {};
            $scope.grid = {
                CURRENT_PAGE: 1,
                TOTAL_RECORDS: 0,
                NUM_PAGES: 0
            };
            $scope.event = {
                columns: [{
                    key: 'categoryName',
                    clickCount: 0
                }, {
                    key: 'questionSetName',
                    clickCount: 0
                }]
            };
            $scope.redirect = function () {
                $state.go($stateParams.returnState, $stateParams.returnParams);
            };

            function loadAllCategories() {
                CategoryFactory.findAll().then(function (response) {
                    $scope.categories = response.data;
                    $scope.loadingDiv = false;
                }, function (response) {

                });
            }

            function loadAllQuestionSets(arg_start, arg_limit, arg_filter, arg_sort, arg_user_id) {
                QuestionSetFactory.findAllQuestionSets(arg_start, arg_limit, arg_filter, arg_sort, arg_user_id).then(function (response) {

                    $scope.questionSetList = response.data.resultset;
                    $scope.grid.TOTAL_RECORDS = response.data.totalRecords;
                    $scope.caluculatePage();
                    $scope.loadingDiv = false;
                }, function (response) {
                    alert("error");
                });
            }

            $scope.caluculatePage = function () {
                var noOfPages = Math.ceil($scope.grid.TOTAL_RECORDS / Config.GRID_LIMIT);
                $scope.grid.NUM_PAGES = noOfPages;

            };

            $scope.reset = function () {
                $scope.isEdit = false;
                $scope.questionSet = {
                    id: '',
                    category: {
                        id: '',
                        name: 'Select...'
                    },
                    name: ''
                };
            };

            function init() {
                if (store.get('info')) {
                    $scope.userIdInfo = angular.fromJson(store.get('info'));
                }

                $scope.reset();
                loadAllCategories();
                loadAllQuestionSets(Config.GRID_START, Config.GRID_LIMIT, null, null, $scope.userIdInfo.userId);
            }

            init();

            function validateForm() {
                if (!$scope.questionSet.category.id) {
                    SweetAlert.swal('Warning', "Category Name Should Not be Empty!", 'warning');
                    return false;
                }

                if (!$scope.questionSet.name) {
                    SweetAlert.swal('Warning', "QuestionSet Name Should Not be Empty!", 'warning');
                    return false;
                }
                return true;
            }

            $scope.editQuestionSet = function (arg_item) {
                $scope.questionSet = {
                    id: arg_item.id,
                    category: {
                        id: arg_item.category.id,
                        name: arg_item.category.name
                    },
                    name: arg_item.name
                };
                $scope.isEdit = true;
            };

            $scope.addUpdate = function () {
                if (validateForm()) {
                    $scope.loadingDiv = true;
                    QuestionSetFactory.addUpdate($scope.questionSet, $scope.userIdInfo.userId).then(function (response) {
                        $scope.loadingDiv = false;
                        SweetAlert.swal('Info', response.data.message, 'success');
                        $scope.reset();
                        $scope.sort('');
                        loadAllQuestionSets(Config.GRID_START, Config.GRID_LIMIT, null, null, $scope.userIdInfo.userId);
                    }, function (response) {
                        SweetAlert.swal('info', response.data.message, 'error');
                    });
                }

            };

            $scope.deleteQuestionSet = function () {
                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "You want to delete this question set!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Delete",
                        closeOnConfirm: false
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            QuestionSetFactory.delete($scope.questionSet.id, $scope.userIdInfo.userId).then(function (response) {
                                SweetAlert.swal('Info', response.data.message, 'success');
                                loadAllQuestionSets(Config.GRID_START, Config.GRID_LIMIT, null, null, $scope.userIdInfo.userId);
                            }, function (response) {
                                SweetAlert.swal('info', response.data.message, 'error');
                            });
                        }
                    });
            };

            $scope.refreshQuestionList = function () {
                $scope.loadingDiv = true;
                for (var j = 0; j < $scope.event.columns.length; j += 1) {
                    var col = $scope.event.columns[j];
                    col.clickCount = 0;
                }
                loadAllQuestionSets(Config.GRID_START, Config.GRID_LIMIT, null, null, $scope.userIdInfo.userId);
            };

            $scope.next = function () {
                if ($scope.grid.CURRENT_PAGE < $scope.grid.NUM_PAGES) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE += 1;
                    loadAllQuestionSets($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, null, $scope.userIdInfo.userId);
                }
            };

            $scope.previous = function () {
                if ($scope.grid.CURRENT_PAGE > 1) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE -= 1;
                    loadAllQuestionSets($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, null, $scope.userIdInfo.userId);
                }
            };

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
                    loadAllQuestionSets(Config.GRID_START, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, obj, $scope.userIdInfo.userId);
                }
            };

            $scope.showQSNFilter = function (size) {

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
                        loadAllQuestionSets(Config.GRID_START, Config.GRID_LIMIT, response, null, $scope.userIdInfo.userId);
                    }
                }, function () {

                });
            };
        }]);
