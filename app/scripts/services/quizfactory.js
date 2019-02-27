/**
 * @ngdoc service
 * @name heritageApp.QuizFactory
 * @description
 * # QuizFactory
 * Factory in the heritageApp.
 */
angular.module('heritageApp')
    .factory('QuizFactory', ['$http', 'ApiFactory', function ($http, ApiFactory) {
        'use strict';

        var quizFactory = {};

        quizFactory.complete = function (argQuizData) {
            return $http(ApiFactory.post('quiz/complete', argQuizData, null));
        };

        quizFactory.evaluateScore = function (argQuizData) {
            return $http(ApiFactory.post('quiz/calculate/highscore', argQuizData, null));
        };

        quizFactory.registerHighScore = function(argData) {
            return $http(ApiFactory.post('quiz/register/highscore', argData, null));
        };

        quizFactory.createSession = function(argSessionData) {
            return $http(ApiFactory.post('quiz/session', argSessionData, null));
        };

        quizFactory.deleteSession = function (arg_questionSet_id) {
            return $http(ApiFactory.delete('quiz/session/' + arg_questionSet_id, null, null));
        };

        return quizFactory;
    }]);
