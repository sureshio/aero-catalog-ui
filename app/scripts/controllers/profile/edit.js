/**
 * @ngdoc function
 * @name heritageApp.controller:ProfileEditCtrl
 * @description
 * # ProfileEditCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('ProfileEditCtrl', [
        '$scope',
        '$uibModal',
        '$state',
        'SweetAlert',
        'ProfileFactory',
        'Config',
        'store',
        function ($scope, $uibModal, $state, SweetAlert, ProfileFactory, Config,store) {
            'use strict';

            function loadProfileDetails(arg_profile_id) {
                ProfileFactory.findById(arg_profile_id).then(function (response) {
                    $scope.profile.id = response.data.profile.profile_id;
                    $scope.profile.firstName = response.data.profile.first_name;
                    $scope.profile.middleName = response.data.profile.middle_name;
                    $scope.profile.lastName = response.data.profile.last_name;
                    $scope.profile.phoneNumber = response.data.profile.phone_number;
                    $scope.profile.mobileNumber = response.data.profile.mobile_number;
                    $scope.profile.email = response.data.profile.email;
                    $scope.profile.address = response.data.profile.address;
                    $scope.profile.city = response.data.profile.city;
                    $scope.profile.state = response.data.profile.state;
                    $scope.profile.zip = response.data.profile.zip;
                    if (response.data.profile.photo_file_name) {
                        $scope.imageUrl = Config.BASE_URL + Config.IMAGE_PATH + response.data.profile.photo_file_name;
                    }
                    $scope.loadingDiv = false;
                }, function (response) {

                });
            }

            function init() {
                $scope.loadingDiv = true;
                $scope.isEdit = false;
                $scope.imageUrl = '';
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
                    isAdmin: ''
                };

                if (store.get('info')) {
                    $scope.info = angular.fromJson(store.get('info'));
                }

                loadProfileDetails($scope.info.userId);
            }

            init();

            function validateProfileForm() {
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

                var emailPattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

                if ($scope.profile.email && !emailPattern.test($scope.profile.email)) {
                    SweetAlert.swal('Warning', "User must enter a valid Email Address!", 'warning');
                    return false;
                }

                if (!$scope.profile.address) {
                    SweetAlert.swal('Warning', "User must enter a Address!", 'warning');
                    return false;
                }

                var zipCodePattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

                if (!$scope.profile.city) {
                    SweetAlert.swal('Warning', "User must enter a city!", 'warning');
                    return false;
                }

                if (!$scope.profile.state) {
                    SweetAlert.swal('Warning', "User must enter a state!", 'warning');
                    return false;
                }

                if (!$scope.profile.zip) {
                    SweetAlert.swal('Warning', "User must enter a zip code!", 'warning');
                    return false;
                } else {
                    if (!zipCodePattern.test($scope.profile.zip)) {
                        SweetAlert.swal('Warning', "User must enter a valid zip code!", 'warning');
                        return false;
                    }
                }

                return true;
            }

            $scope.addUpdate = function () {
                if (validateProfileForm()) {
                    var profileFormData = new FormData();
                    profileFormData.append("model", angular.toJson($scope.profile));
                    if ($scope.files) {
                        profileFormData.append("profileimage", $scope.files[0].files[0]);
                    }

                    ProfileFactory.create(profileFormData).then(function (response) {
                        SweetAlert.swal({
                                title: "Success",
                                text: response.data.message,
                                type: "success",
                                showCancelButton: false,
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                            },
                            function () {
                                if ($state.current.name == 'home.administrator.edit') {
                                    $state.go('home');
                                } else {
                                    $state.go('sign-in');
                                }
                            });
                    }, function (response) {
                        if (response.data.message) {
                            SweetAlert.swal('Error', response.data.message, "error");
                        } else {
                            SweetAlert.swal('Error', 'Unable to complete the request!', "error");
                        }
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
                            return $scope.imageUrl;
                        }
                    }
                });

                modalInstance.result.then(function (response) {
                    $scope.files = response;
                }, function () {

                });
            };

            $scope.enableEditMode = function() {
                console.log('hello');
              $scope.isEdit = true;
            };
        }]);
