/**
 * @ngdoc service
 * @name heritageApp.AuthenticationFactory
 * @description
 * # AuthenticationFactory
 * Factory in the heritageApp.
 */
angular.module('heritageApp')
    .factory('AuthenticationFactory', ['$http', 'store', 'Config', 'ApiFactory', function ($http, store, Config, ApiFactory) {
        'use strict';

        var authenticationFactory = {};

        authenticationFactory.checkUserName = function (argUserName, argCheckType) {
            var url = (argCheckType) ? 'auth/checkusername' : 'auth/admin/checkusername';
            return $http(ApiFactory.post(url, {userName: argUserName}, null));
        };

        authenticationFactory.login = function (argUserCredentials) {
            return $http(ApiFactory.post('auth/login', argUserCredentials, null));
        };

        authenticationFactory.changePassword = function (argObj) {
            return $http(ApiFactory.put('auth/changepassword', {
                oldPassword: argObj.oldPassword,
                newPassword: argObj.newPassword
            }, null));
        };

        authenticationFactory.forgotPassword = function (argObj) {
            return $http(ApiFactory.post('auth/forgotpassword', argObj, null));
        };

        authenticationFactory.authorize = function () {
            var info = angular.fromJson(store.get("info"));
            if (info && info.token) {
                return true;
            } else {
                return false;
            }
        };

        return authenticationFactory;
    }]);
