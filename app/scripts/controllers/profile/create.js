/**
 * @ngdoc function
 * @name heritageApp.controller:ProfileCreateCtrl
 * @description
 * # ProfileCreateCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('ProfileCreateCtrl', [
        '$scope',
        '$state',
        '$uibModal',
        'SweetAlert',
        'ProfileFactory',
        'AuthenticationFactory',
        function ($scope, $state, $uibModal, SweetAlert, ProfileFactory, AuthenticationFactory) {
            'use strict';

            $scope.files = null;

            function init() {
                $scope.isLoading = false;
                $scope.isAvailable = false;
                $scope.error = {
                    class: '',
                    message: ''
                };
                $scope.confirmPassword = '';
                $scope.profile = {
                    id: '',
                    userName: '',
                    password: '',
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    phoneNumber: '',
                    mobileNumber: '',
                    email: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    isAdmin: ($state.current.name == 'home.administrator.create')
                };
            }

            init();

            function validateProfileForm() {
                if (!$scope.profile.userName) {
                    SweetAlert.swal('Warning', "Username cannot be blank!", 'warning');
                    return false;
                }

                if ($scope.profile.userName && !$scope.isAvailable) {
                    SweetAlert.swal('Warning', "This Username is not available.Please try another!", 'warning');
                    return false;
                }

                if (!$scope.profile.password || !$scope.confirmPassword) {
                    SweetAlert.swal('Warning', "Password should not be blank and Confirm Password properly!", 'warning');
                    return false;
                }

                if ($scope.profile.password != $scope.confirmPassword) {
                    SweetAlert.swal('Warning', "Password should not be blank and Confirm Password properly!", 'warning');
                    return false;
                }

                if (!$scope.profile.firstName) {
                    SweetAlert.swal('Warning', "User must enter a First Name!", 'warning');
                    return false;
                }

                if (!$scope.profile.lastName) {
                    SweetAlert.swal('Warning', "User must enter a Last Name!", 'warning');
                    return false;
                }

                var phoneNumberPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

                if ($scope.profile.phoneNumber && !phoneNumberPattern.test($scope.profile.phoneNumber)) {
                    SweetAlert.swal('Error', "User must enter a valid Phone Number!", 'error');
                    return false;
                }
                var mobileNumberPattern = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;

                if ($scope.profile.mobileNumber && !mobileNumberPattern.test($scope.profile.mobileNumber)) {
                    SweetAlert.swal('Error', "User must enter a valid Mobile Number!", 'error');
                    return false;
                }

                if (!$scope.profile.email) {
                    SweetAlert.swal('Warning', "User must enter an Email Address!", 'warning');
                    return false;
                }

                var emailPattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

                if ($scope.profile.email && !emailPattern.test($scope.profile.email)) {
                    SweetAlert.swal('Warning', "User must enter a valid Email Address!", 'warning');
                    return false;
                }

                if ($state.current.name === 'home.administrator.create' && !$scope.profile.address) {
                    SweetAlert.swal('Warning', "User must enter a Address!", 'warning');
                    return false;
                }

                var zipCodePattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

                if ($state.current.name === 'home.administrator.create' && !$scope.profile.city) {
                    SweetAlert.swal('Warning', "User must enter a city!", 'warning');
                    return false;
                }

                if ($state.current.name === 'home.administrator.create' && !$scope.profile.state) {
                    SweetAlert.swal('Warning', "User must enter a state!", 'warning');
                    return false;
                }

                if ($state.current.name === 'home.administrator.create' && !$scope.profile.zip) {
                    SweetAlert.swal('Warning', "User must enter a zip code!", 'warning');
                    return false;
                }

                if ($scope.profile.zip && !zipCodePattern.test($scope.profile.zip)) {
                    SweetAlert.swal('Warning', "User must enter a valid zip code!", 'warning');
                    return false;
                }

                return true;
            }

            $scope.reset = function () {
                init();
            };

            $scope.addUpdate = function () {
                if (validateProfileForm()) {
                    var profileFormData = new FormData();
                    profileFormData.append("model", angular.toJson($scope.profile));
                    if ($scope.files) {
                        profileFormData.append("profileimage", $scope.files[0].files[0]);
                    }

                    ProfileFactory.create(profileFormData, $state.current.name == 'sign-up').then(function (response) {
                        SweetAlert.swal({
                                title: ($state.current.name == 'sign-up') ? 'Congratulation' : "Success",
                                text: response.data.message,
                                type: "success",
                                showCancelButton: false,
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                            },
                            function () {
                                if ($state.current.name == 'home.administrator.create') {
                                    $state.go('home.option');
                                } else {
                                    $state.go('sign-in');
                                }
                            });
                    }, function (response) {
                        SweetAlert.swal('Error', response.data.message, "error");
                    });
                }
            };

            $scope.showUploadForm = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'modalImageUpload.html',
                    controller: 'ModalImageUploadCtrl',
                    size: '',
                    resolve: {
                        imageUrl: function () {
                            return '';
                        }
                    }
                });

                modalInstance.result.then(function (response) {
                    $scope.files = response;
                }, function () {

                });
            };

            $scope.checkUserNameAvailability = function (arg_user_name) {
                if (arg_user_name) {
                    $scope.isLoading = true;
                    AuthenticationFactory.checkUserName($scope.profile.userName, $state.current.name == 'sign-up').then(function (response) {
                        $scope.isLoading = false;
                        $scope.isAvailable = true;
                        $scope.error.class = 'label-success';
                        $scope.error.message = response.data.message;
                    }, function (response) {
                        $scope.isLoading = false;
                        $scope.isAvailable = false;
                        $scope.error.class = 'label-danger';
                        $scope.error.message = response.data.message;
                    });
                } else {
                    $scope.isLoading = false;
                    $scope.error.class = '';
                    $scope.error.message = '';
                }
            };
        }]);
