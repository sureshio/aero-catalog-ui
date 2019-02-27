'use strict';

/**
 * @ngdoc filter
 * @name heritageApp.filter:limitToText
 * @function
 * @description
 * # limitToText
 * Filter in the heritageApp.
 */
angular.module('heritageApp')
    .filter('limitToText', function () {
        return function (input) {
            if(!input) {
                return '';
            } else {
                if(input.length > 150) {
                    return input.substring(0, 255) + '...';
                } else {
                    return input;
                }
            }
        };
    });
