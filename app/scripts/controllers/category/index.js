angular.module('heritageApp')
    .controller('CategoryIndexCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'SweetAlert',
        'Config',
        'CategoryFactory',
        function ($scope, $state, $stateParams, SweetAlert, Config, CategoryFactory) {
            'use strict';

            var i = 0;
            $scope.loadingDiv = true;
            $scope.isEdit = false;
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
                }]
            };
            $scope.categoryList = [];

            function validateCategoryForm() {
                if (!$scope.category.name) {
                    SweetAlert.swal('Warning', 'Category Name should not be empty!', 'warning');
                    return false;
                }

                return true;
            }
            $scope.redirect = function () {
                $state.go($stateParams.returnState, $stateParams.returnParams);
            };

            function calculatePage() {
                var noOfPages = Math.ceil($scope.grid.TOTAL_RECORDS / Config.GRID_LIMIT);
                $scope.grid.NUM_PAGES = noOfPages;

            }

            function loadAllCategories(arg_start, arg_limit, arg_filter, arg_sort) {
                CategoryFactory.findByGridParam(arg_start, arg_limit, arg_filter, arg_sort).then(function (response) {
                    $scope.categoryList = response.data.resultset;

                    $scope.grid.TOTAL_RECORDS = response.data.totalRecords;
                    calculatePage();
                    $scope.loadingDiv = false;
                }, function (response) {

                });
            }

            function init() {
                $scope.isEdit = false;
                $scope.category = {
                    id: '',
                    name: ''
                };

                loadAllCategories(Config.GRID_START, Config.GRID_LIMIT, null, null);
            }

            init();

            $scope.reset = function () {
                $scope.isEdit = false;
                $scope.category = {
                    id: '',
                    name: ''
                };
            };

            $scope.refreshCategoryList = function () {
                $scope.loadingDiv = true;
                for (var j = 0; j < $scope.event.columns.length; j += 1) {
                    var col = $scope.event.columns[j];
                    col.clickCount = 0;
                }
                $scope.temp.filter = null;
                $scope.grid.CURRENT_PAGE = 1;
                loadAllCategories(Config.GRID_START, Config.GRID_LIMIT, $scope.temp.filter, null);
            };

            $scope.next = function () {
                if ($scope.grid.CURRENT_PAGE < $scope.grid.NUM_PAGES) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE += 1;
                    loadAllCategories($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, null);
                }
            };

            $scope.previous = function () {
                if ($scope.grid.CURRENT_PAGE > 1) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE -= 1;
                    loadAllCategories($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, null);
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
                    loadAllCategories($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, ($scope.temp.filter) ? $scope.temp.filter : null, obj);
                }
            };

            $scope.editCategory = function (arg_category) {
                $scope.isEdit = true;
                $scope.category.id = arg_category.id;
                $scope.category.name = arg_category.name;
            };

            $scope.addUpdate = function () {
                if (validateCategoryForm()) {
                    $scope.loadingDiv = true;
                    if ($scope.category.id) {
                        CategoryFactory.create($scope.category).then(function (response) {
                            $scope.loadingDiv = false;
                            SweetAlert.swal('Success', response.data.message, 'success');
                            init();
                        }, function (response) {
                            if (response.status === 500) {
                                SweetAlert.swal('Error', response.data.message, 'error');
                            } else {
                                SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                            }
                        });
                    } else {
                        CategoryFactory.update($scope.category).then(function (response) {
                            $scope.loadingDiv = false;
                            SweetAlert.swal('Success', response.data.message, 'success');
                            init();
                        }, function (response) {
                            if (response.status === 500) {
                                SweetAlert.swal('Error', response.data.message, 'error');
                            } else {
                                SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                            }
                        });
                    }
                }
            };

            $scope.removeCategories = function () {
                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "You want to delete these Categories!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Delete",
                        closeOnConfirm: false
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            CategoryFactory.delete($scope.category.id).then(function (response) {
                                SweetAlert.swal('Success', response.data.message, 'success');
                                init();
                            }, function (response) {
                                if (response.status == 500) {
                                    SweetAlert.swal('Error', response.data.message, 'error');
                                } else {
                                    SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                                }
                            });
                        }
                    });
            };
        }
    ]);
