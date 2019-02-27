'use strict';

/**
 * @ngdoc function
 * @name heritageApp.controller:BiographyIndexCtrl
 * @description
 * # BiographyIndexCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('BiographyIndexCtrl', [
        '$scope',
        '$sce',
        '$state',
        '$stateParams',
        '$uibModal',
        'Config',
        'SweetAlert',
        'CategoryFactory',
        'QuestionSetFactory',
        'QuestionFactory',
        function ($scope, $sce, $state, $stateParams, $uibModal, Config, SweetAlert, CategoryFactory, QuestionSetFactory, QuestionFactory) {
            'use strict';

            var temp = {
                filter: null
            };

            function successCallBack(response) {
                SweetAlert.swal('Success', response.data.message, 'success');
                $scope.reset();
                loadAllBiographies(Config.GRID_START, Config.GRID_LIMIT, null, null);
            }

            function errorCallBack(response) {
                if(response.status != 401) {
                    if (response.data.message) {
                        SweetAlert.swal('Error', response.data.message, 'error');
                    } else {
                        SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                    }
                }
            }
            $scope.redirectToCategory = function () {
                $state.go('home.category.index', {returnState: 'home.biography.index', returnParams: {id: $stateParams.id}});
            };
            $scope.redirectToQuestionSet = function () {
                $state.go('home.questionset.index', {returnState: 'home.biography.index', returnParams: {id: $stateParams.id}});
            };

            function loadAllCategories() {
                CategoryFactory.findAll().then(function (response) {
                    $scope.categoryList = response.data;
                }, errorCallBack);
            }

            function loadAllQuestionSetsByCategoryId(arg_category_id) {
                QuestionSetFactory.findByCategoryId(arg_category_id).then(function (response) {
                    $scope.questionSetList = response.data;
                }, errorCallBack);
            }

            function loadAllBiographies(argStart, argLimit, argFilter, argSort) {
                QuestionFactory.findAllBiographiesByGridParam(argStart, argLimit, argFilter, argSort).then(function (response) {
                    $scope.biographyList = response.data.resultset;
                    $scope.grid.TOTAL_RECORDS = response.data.totalRecords;
                    $scope.grid.NUM_PAGES = Math.ceil($scope.grid.TOTAL_RECORDS / Config.GRID_LIMIT);
                    $scope.grid.CURRENT_PAGE = argStart + 1;
                    $scope.loadingDiv = false;
                }, errorCallBack);
            }

            function validateBiographyForm() {
                if (!$scope.biography.title) {
                    SweetAlert.swal('Warning', 'You must enter Picture Title!', 'warning');
                    return false;
                }

                if (!$scope.biography.description) {
                    SweetAlert.swal('Warning', 'You must enter Picture Description!', 'warning');
                    return false;
                }

                return true;
            }

            function init() {
                $scope.categoryList = [];
                $scope.questionSetList = [];
                $scope.biographyList = [];
                $scope.loadingDiv = true;
                $scope.isEdit = false;
                $scope.imageSource = 'images/picture-01-256.png';
                $scope.grid = {
                    CURRENT_PAGE: 1,
                    TOTAL_RECORDS: 0,
                    NUM_PAGES: 0
                };
                $scope.event = {
                    columns: [{
                        key: 'title',
                        clickCount: 0
                    }, {
                        key: 'description',
                        clickCount: 0
                    }]
                };
                $scope.biography = {
                    id: '',
                    title: '',
                    category: {
                        id: '',
                        name: 'Select...'
                    },
                    questionSet: {
                        id: '',
                        name: 'Select...'
                    },
                    description: ''
                };

                loadAllCategories();
                loadAllBiographies(Config.GRID_START, Config.GRID_LIMIT, null, null);
            }

            init();

            $scope.ddlCategory_OnChange = function () {
                loadAllQuestionSetsByCategoryId($scope.biography.category.id);
            };

            $scope.triggerFileUpload = function () {
                angular.element(document.querySelector("#InputBiography")).click();
            };

            $scope.fileNameChanged = function () {
                var fileUpload = angular.element(document.querySelector("#InputBiography"));
                if (fileUpload[0].files.length > 0) {
                    console.log(fileUpload[0].files[0].size);
                    console.log(fileUpload[0].value);
                    var regex = /^([a-zA-Z0-9\s_\\.\-:\,\'\~\`\@\#\$\%\^\&\+\=])+(.jpg|.jpeg|.png|.gif|.bmp)$/;
                    var maxSize = 5 * 1024 * 1024;

                    if (!regex.test(fileUpload[0].value.toLowerCase().replace(/\(|\)/g, ''))) {
                        SweetAlert.swal('Error', "Please upload a valid image file. Allowed Extensions are 'jpg', 'jpeg', 'png', 'gif', 'bmp'.", 'error');
                        return false;
                    }
                    if (fileUpload[0].files[0].size > maxSize) {
                        SweetAlert.swal('Error', "File size is greater than 5MB.", 'error');
                        return false;
                    }

                    if (typeof (FileReader) != "undefined") {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $scope.$apply(function () {
                                $scope.imageSource = e.target.result;
                            });
                        }
                        reader.readAsDataURL(fileUpload[0].files[0]);
                    } else {
                        console.log("This browser does not support FileReader.");
                    }
                } else {
                    $scope.$apply(function () {
                        $scope.imageSource = 'images/picture-01-256.png';
                    });
                    SweetAlert.swal('Warning', 'No Image selected!', 'warning');
                }
            };

            $scope.reset = function () {
                $scope.questionSetList = [];
                $scope.isEdit = false;
                $scope.imageSource = 'images/picture-01-256.png';
                $scope.biography = {
                    id: '',
                    title: '',
                    category: {
                        id: '',
                        name: 'Select...'
                    },
                    questionSet: {
                        id: '',
                        name: 'Select...'
                    },
                    description: ''
                };
            };

            $scope.editBiography = function (item) {
                $scope.biography.id = item.id;
                $scope.biography.title = item.title;
                $scope.biography.category.id = (item.category.id == 0) ? '' : item.category.id;
                $scope.biography.category.name = (item.category.id == 0) ? 'Select...' : item.category.name;
                if ($scope.biography.category.id) {
                    loadAllQuestionSetsByCategoryId($scope.biography.category.id);
                    $scope.biography.questionSet.id = (item.questionSet.id == 0) ? '' : item.questionSet.id;
                    $scope.biography.questionSet.name = (item.questionSet.id == 0) ? 'Select...' : item.questionSet.name;
                } else {
                    $scope.biography.questionSet.id = '';
                    $scope.biography.questionSet.name = 'Select...';
                }
                $scope.biography.description = item.description;

                if (item.picture) {
                    $scope.imageSource = $sce.trustAsUrl(Config.BASE_URL + Config.IMAGE_PATH + item.picture);
                } else {
                    $scope.imageSource = 'images/picture-01-256.png';
                }

                $scope.isEdit = true;
            };

            $scope.addUpdate = function () {
                if (validateBiographyForm()) {
                    var formData = new FormData();

                    formData.append('model', JSON.stringify($scope.biography));

                    var fileUpload = angular.element(document.querySelector("#InputBiography"));
                    if (fileUpload[0].files[0]) {
                        formData.append('image', fileUpload[0].files[0]);
                    }

                    QuestionFactory.addUpdateBiography(formData).then(successCallBack, errorCallBack);
                }
            };

            $scope.remove = function () {
                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "You want to delete this Biography!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Delete",
                        closeOnConfirm: false
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            QuestionFactory.deleteBiography($scope.biography.id).then(successCallBack, errorCallBack);
                        }
                    });
            };

            $scope.showFilter = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'modalFilter.html',
                    controller: 'ModalBiographyFilterCtrl'
                });

                modalInstance.result.then(function (response) {
                    if (response) {
                        $scope.loadingDiv = true;
                        temp.filter = {
                            property: 'titleOrDesc',
                            value: response
                        };
                        loadAllBiographies(Config.GRID_START, Config.GRID_LIMIT, temp.filter, null);
                    }
                }, function () {

                });
            };

            $scope.refresh = function () {
                $scope.loadingDiv = true;
                for (var j = 0; j < $scope.event.columns.length; j += 1) {
                    var col = $scope.event.columns[j];
                    col.clickCount = 0;
                }
                temp.filter = null;
                loadAllBiographies(Config.GRID_START, Config.GRID_LIMIT, null, null);
            };

            $scope.next = function () {
                if ($scope.grid.CURRENT_PAGE < $scope.grid.NUM_PAGES) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE += 1;
                    loadAllBiographies($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, (temp.filter) ? temp.filter : null, null);
                }
            };

            $scope.previous = function () {
                if ($scope.grid.CURRENT_PAGE > 1) {
                    $scope.loadingDiv = true;
                    $scope.grid.CURRENT_PAGE -= 1;
                    loadAllBiographies($scope.grid.CURRENT_PAGE - 1, Config.GRID_LIMIT, (temp.filter) ? temp.filter : null, null);
                }
            };

            $scope.sort = function (arg_col) {
                $scope.loadingDiv = true;
                var obj = null;
                for (var i = 0; i < $scope.event.columns.length; i += 1) {
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
                    loadAllBiographies(Config.GRID_START, Config.GRID_LIMIT, (temp.filter) ? temp.filter : null, obj);
                }
            };
        }]);
