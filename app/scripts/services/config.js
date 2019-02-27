/**
 * @ngdoc service
 * @name heritageApp.config
 * @description
 * # config
 * Constant in the heritageApp.
 */
angular.module('heritageApp')
    .constant('Config', {
        BASE_URL: 'http://54.202.130.64:8080/heritage-api',
        API_PATH: '/rest/',
        IMAGE_PATH: '/images/',
        GRID_START: 0,
        GRID_LIMIT: 10,
        QUIZ_NEW: 0,
        QUIZ_CONTD: 1,
        SCORE_WEIGHT: 50
    });
