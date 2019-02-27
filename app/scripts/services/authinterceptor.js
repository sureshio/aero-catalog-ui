'use strict';

/**
 * @ngdoc service
 * @name heritageApp.authInterceptor
 * @description
 * # authInterceptor
 * Factory in the heritageApp.
 */
angular.module('heritageApp')
    .factory('AuthInterceptor', ['$state', 'store',function ($state,store) {

        return {
            authorize: function () {
                var identification = angular.fromJson(store.get('info'));
                if(!identification || !identification.token) {
                    $state.go('sign-in');
                }
            }
        };
    }]);
