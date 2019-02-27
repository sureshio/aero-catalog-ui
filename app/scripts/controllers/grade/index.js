angular.module('heritageApp')
    .controller('GradeIndexCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'CategoryFactory',
        'QuestionSetFactory',
        'GradeFactory',
        'store',
        'SweetAlert',
        '$uibModal',
        'Config',
        function ($scope, $state, $stateParams, CategoryFactory, QuestionSetFactory, GradeFactory, store, SweetAlert, $uibModal, Config) {
            'use strict';

            var i = 0;
            $scope.loadingDiv = true;
            $scope.isEdit = false;
            $scope.isDisabled = true;
            $scope.searchText = '';
            $scope.userIdInfo = {};
            $scope.categoryList = [];
            $scope.questionSetList = [];
            $scope.grades = [];
            $scope.temp = {};
            $scope.grid = {
                CURRENT_PAGE: 1,
                TOTAL_RECORDS: 0,
                NUM_PAGES: 0
            };
            $scope.event = {
                columns: [{
                    key: 'gradeName',
                    clickCount: 0
                }, {
                    key: 'minValue',
                    clickCount: 0
                }, {
                    key: 'maxValue',
                    clickCount: 0
                }, {
                    key: 'questionSetName',
                    clickCount: 0
                }]
            };

            $scope.reset = function () {
                $scope.isEdit = false;
                $scope.grade = {
                    id: '',
                    category: {
                        id: '',
                        name: 'Select...'
                    },
                    questionSet: {
                        id: '',
                        name: 'Select...'
                    },
                    name: '',
                    unit: '',
                    maxValue: '',
                    minValue: ''
                };
            };

            $scope.redirectToCategory = function () {
                $state.go('home.category.index', {returnState: 'home.grade.index', returnParams: {id: $stateParams.id}});
            };
            $scope.redirectToQuestionSet = function () {
                $state.go('home.questionset.index', {returnState: 'home.grade.index', returnParams: {id: $stateParams.id}});
            };
            function loadAllCategories() {
                CategoryFactory.findAll().then(function (response) {
                    $scope.categoryList = response.data;
                }, function (response) {

                });
            }

            function findAllGrades(arg_start, arg_limit, arg_filter, arg_sort, arg_user_id) {
                GradeFactory.findByGridParam(arg_start, arg_limit, arg_filter, arg_sort, arg_user_id).then(function (response) {
                    $scope.grades = response.data.resultset;
                    $scope.grid.TOTAL_RECORDS = response.data.totalRecords;
                    $scope.grid.CURRENT_PAGE = arg_start + 1;
                    $scope.caluculatePage();
                    $scope.loadingDiv = false;
                }, function (response) {

                });
            }

            function validateForm() {
                if (!$scope.grade.name) {
                    SweetAlert.swal('Warning', "Grade Name Should not be Empty!", 'warning');
                    return false;
                }
                if (!$scope.grade.unit) {
                    SweetAlert.swal('Warning', "You must select a Unit!", 'warning');
                    return false;
                }
                if (!$scope.grade.maxValue) {
                    SweetAlert.swal('Warning', "Maximum Grade Value Should not Empty!", 'warning');
                    return false;
                }
                if ($scope.grade.unit === '%' && isNaN($scope.grade.maxValue)) {
                    SweetAlert.swal('Warning', "Maximum Grade Value Should be between 0-100!", 'warning');
                    return false;
                }
                if (!$scope.grade.minValue) {
                    SweetAlert.swal('Warning', "Minimum Grade Value Should not Empty!", 'warning');
                    return false;
                }
                if ($scope.grade.unit === '%' && isNaN($scope.grade.minValue)) {
                    SweetAlert.swal('Warning', "Minimum Grade Value Should be between 0-100!", 'warning');
                    return false;
                }
                if (($scope.grade.maxValue - $scope.grade.minValue) < 0) {
                    SweetAlert.swal('Warning', "Minimum Grade Value Should be less than Maximum!", 'warning');
                    return false;
                }
                if (!$scope.grade.category.id) {
                    SweetAlert.swal('Warning', "You must Select a Category name!", 'warning');
                    return false;
                }
                if (!$scope.grade.questionSet.id) {
                    SweetAlert.swal('Warning', "You must Select a QuestionSet!", 'warning');
                    return false;
                }

                return true;
            }

            $scope.refreshGradeList = function () {
                $scope.loadingDiv = true;
                for (var j = 0; j < $scope.event.columns.length; j += 1) {
                    var col = $scope.event.columns[j];
                    col.clickCount = 0;
                }
                $scope.temp.filter = null;
                findAllGrades(Config.GRID_START, Config.GRID_LIMIT, $scope.temp.filter, null, $scope.userIdInfo.userId);
            };

            function init() {
                $scope.reset();

                if (store.get('info')) {
                    $scope.userIdInfo = angular.fromJson(store.get('info'));
                }

                loadAllCategories();
                findAllGrades(Config.GRID_START, Config.GRID_LIMIT, null, null, $scope.userIdInfo.userId);
            }

            init();

            $scope.loadAllQuestionSetsByCategoryId = function (arg_category_id) {
                $scope.loadingDiv = true;
                QuestionSetFactory.findByCategoryId(arg_category_id ? arg_category_id : -1).then(function (response) {
                    $scope.questionSetList = response.data;
                    $scope.loadingDiv = false;
                }, function (response) {

                });
            }

            $scope.caluculatePage = function () {
                var noOfPages = Math.ceil($scope.grid.TOTAL_RECORDS / Config.GRID_LIMIT);
                $scope.grid.NUM_PAGES = noOfPages;

            };

            $scope.showQSNFilter = function (size) {

                var modalInstance = $uibModal.open({

                    templateUrl: 'modalQSNFilter.html',
                    controller: 'QSNFilterController',
                    size: size,
                    resolve: {
                        filterType: function () {
                            return 'grade';
                        }
                    }
                });

                modalInstance.result.then(function (response) {
                    $scope.loadingDiv = true;
                    findAllGrades(Config.GRID_START, Config.GRID_LIMIT, response, null, $scope.userIdInfo.userId);
                }, function () {

                });
                $scope.isEdit = true;
            };

            $scope.editGradeSet = function (arg_item) {
                $scope.grade.id = arg_item.id;
                $scope.grade.name = arg_item.name;
                $scope.grade.unit = arg_item.unit;
                $scope.grade.maxValue = arg_item.maxValue;
                $scope.grade.minValue = arg_item.minValue;
                $scope.grade.category.id = arg_item.questionSet.category.id;
                $scope.grade.category.name = arg_item.questionSet.category.name;
                $scope.grade.questionSet.id = arg_item.questionSet.id;
                $scope.grade.questionSet.name = arg_item.questionSet.name;

                $scope.loadAllQuestionSetsByCategoryId($scope.grade.category.id);

                $scope.isEdit = true;
                $scope.isDisabled = false;
            };

            $scope.addUpdate = function () {
                if (validateForm()) {
                    $scope.loadingDiv = true;
                    GradeFactory.addUpdate($scope.grade, $scope.userIdInfo.userId).then(function (response) {
                        $scope.loadingDiv = false;
                        SweetAlert.swal('Success', response.data.message, 'success');
                        findAllGrades(Config.GRID_START, Config.GRID_LIMIT, null, null, $scope.userIdInfo.userId);
                        $scope.reset();
                    }, function (response) {
                        SweetAlert.swal('Error', response.data.message, 'error');
                    });
                }
            };

            $scope.deleteGrade = function () {
                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "You want to delete this grade!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Delete",
                        closeOnConfirm: false
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            GradeFactory.delete($scope.grade.id, $scope.userIdInfo.userId).then(function (response) {
                                SweetAlert.swal('Succes', response.data.message, 'success');
                                $scope.reset();
                                findAllGrades(Config.GRID_START, Config.GRID_LIMIT, null, null, $scope.userIdInfo.userId);
                            }, function (response) {
                                SweetAlert.swal('Error', response.data.message, 'error');
                            });
                        }
                    });
            };

            $scope.next = function () {
                if ($scope.grid.CURRENT_PAGE < $scope.grid.NUM_PAGES) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE += 1;
                    findAllGrades($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, null);
                }
            };

            $scope.previous = function () {
                if ($scope.grid.CURRENT_PAGE > 1) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE -= 1;
                    findAllGrades($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, null);
                }
            };

            $scope.sort = function (arg_col) {
                $scope.loadingDiv = true;
                var obj = null;
                $scope.enableSorting = true;
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
                    findAllGrades(Config.GRID_START, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, obj, $scope.userIdInfo.userId);
                }
            };
        }]);
