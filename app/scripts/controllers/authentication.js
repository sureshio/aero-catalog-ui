/**
 * @ngdoc function
 * @name heritageApp.controller:AuthenticationController
 * @description
 * # AuthenticationController
 * Controller of the heritageApp
 */
angular.module('heritageApp')
    .controller('AuthenticationController', [
        '$scope',
        '$state',
        'store',
        'SweetAlert',
        'AuthenticationFactory',
        function ($scope, $state, store, SweetAlert, AuthenticationFactory) {
            'use strict';

            var vm = this;

            function errorCallBack(response) {
                if (response.data.message) {
                    SweetAlert.swal('Error', response.data.message, 'error');
                } else {
                    SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                }
            }

            function init() {
                $scope.user = {
                    userName: '',
                    password: ''
                };

                $scope.confirmNewPassword = '';

                $scope.user2 = {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };

                vm.user = {
                    email: ''
                };
            }

            init();

            function validatePasswordChangeForm() {
                if (!$scope.user2.oldPassword) {
                    SweetAlert.swal('Warning', "Old Password field cannot be blank!", 'warning');
                    return false;
                }
                if (!$scope.user2.newPassword) {
                    SweetAlert.swal('Warning', "New Password field cannot be blank!", 'warning');
                    return false;
                }
                if (!$scope.user2.confirmNewPassword) {
                    SweetAlert.swal('Warning', "Confirm Password field cannot be blank!", 'warning');
                    return false;
                }
                if ($scope.user2.newPassword !== $scope.user2.confirmNewPassword) {
                    SweetAlert.swal('Warning', "Passwords do not match!", 'warning');
                    return false;
                }
                return true;
            }

            function validateForm() {
                if (!$scope.user.userName) {
                    SweetAlert.swal('Error', "Please enter username!", 'error');
                    return false;
                }

                if (!$scope.user.password) {
                    SweetAlert.swal('Error', "Please enter password!", 'error');
                    return false;
                }

                return true;
            }

            $scope.login = function () {

                if (validateForm()) {
                    AuthenticationFactory.login($scope.user).then(function (response) {
                        store.set('info', response.data.info);
                        $state.go('home');
                    }, function (response) {
                        SweetAlert.swal('Info', response.data.message, 'error');
                    });
                }
            };

            $scope.updatePassword = function () {
                if (validatePasswordChangeForm()) {
                    AuthenticationFactory.changePassword($scope.user2).then(function (response) {
                        SweetAlert.swal('Info', response.data.message, 'success');
                        $state.go('home.option');
                    }, function (response) {
                        if (response.status === 405) {
                            SweetAlert.swal('Error', 'Unable to complete the request!', 'error');
                        } else {
                            SweetAlert.swal('Error', response.data.message, 'error');
                        }
                    });

                }
            };

            vm.sendRequest = function () {
                var emailPattern = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

                if (!vm.user.email) {
                    SweetAlert.swal('Warning', "User must enter a Email Address!", 'warning');
                    return false;
                }
                if (vm.user.email && !emailPattern.test(vm.user.email)) {
                    SweetAlert.swal('Warning', "User must enter a valid Email Address!", 'warning');
                    return false;
                }

                AuthenticationFactory.forgotPassword(vm.user).then(function (response) {
                    SweetAlert.swal({
                            title: "Success",
                            text: response.data.message,
                            type: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            closeOnConfirm: true
                        },
                        function () {
                            $state.go('sign-in');
                        });
                }, errorCallBack);
            };
        }]);
