'use strict';

/**
 * @ngdoc service
 * @name heritageApp.profilefactory
 * @description
 * # profilefactory
 * Factory in the heritageApp.
 */
angular.module('heritageApp')
    .factory('ProfileFactory', ['$http', 'ApiFactory', function ($http, ApiFactory) {
        var profileFactory = {};

        profileFactory.findById = function (arg_profile_id) {
            return $http(ApiFactory.get('profile/' + arg_profile_id, null));
        };

        profileFactory.create = function (arg_profile_form_data, argCheckType) {
            var url = (argCheckType) ? 'profile' : 'profile/admin';
            return $http(ApiFactory.postWithFormData(url, arg_profile_form_data));
        };

        profileFactory.update = function (arg_profile_form_data) {
            return $http(ApiFactory.put('profile', arg_profile_form_data));
        };

        return profileFactory;
    }]);
