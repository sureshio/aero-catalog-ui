/**
 * @ngdoc service
 * @name heritageApp.RestInterceptor
 * @description
 * # RestInterceptor
 * Factory in the heritageApp.
 */
angular.module('heritageApp')
    .factory('RestInterceptor', ['$location', '$q', 'store', function ($location, $q, store) {
        'use strict';

        var restInterceptor = {};

        restInterceptor.request = function (config) {
            return config;
        };

        restInterceptor.requestError = function(config) {
            return config;
        };

        restInterceptor.response = function (response) {
            return response;
        };

        restInterceptor.responseError = function (response) {
            if (response.status === 401) {
                store.remove('info');
                $location.url('/signin');
            }

            return $q.reject(response);
        };

        return restInterceptor;
    }]);
