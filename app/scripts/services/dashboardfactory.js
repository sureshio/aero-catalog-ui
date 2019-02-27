/**
 * @ngdoc service
 * @name heritageApp.dashboardFactory
 * @description
 * # dashboardFactory
 * Service in the heritageApp.
 */
angular.module('heritageApp')
    .service('DashboardFactory', ['$http', 'ApiFactory', function ($http, ApiFactory) {
        'use strict';

        var dashboardFactory = {};

        dashboardFactory.sendAnswerForSession = function (arg_answer) {
            return $http(ApiFactory.post('quiz/session', arg_answer, null));
        };

        dashboardFactory.getHighScoreJson = function (arg_category_id) {
            return $http(ApiFactory.get('highscore/' + arg_category_id, null, null));
        };

        dashboardFactory.load = function () {
            return $http(ApiFactory.get('dashboard', null, null));
        };

        dashboardFactory.findGradename = function (arg_response_grade) {
            return $http(ApiFactory.post('/grade/calculate', arg_response_grade, null));
        };

        dashboardFactory.sendScoreForHighScore = function (arg_json_for_save_highscore) {
            return $http(ApiFactory.post('highscore/add', arg_json_for_save_highscore, null));
        };

        return dashboardFactory;

    }]);
