/**
 * @ngdoc service
 * @name heritageApp.questionfactory
 * @description
 * # questionfactory
 * Factory in the heritageApp.
 */
angular.module('heritageApp')
    .factory('QuestionFactory', ['$http', 'Config', 'ApiFactory', function ($http, Config, ApiFactory) {
        'use strict';
        var questionFactory = {};

        questionFactory.findAll = function (arg_start, arg_limit, arg_filter, arg_sort) {
            var param = {};
            param.start = arg_start;
            param.limit = arg_limit;
            param.filter = [];
            param.sort = [];

            if (arg_filter) {
                param.filter.push({
                    property: arg_filter.type,
                    value: arg_filter.value
                });
            }

            if (arg_sort) {
                param.sort.push({
                    property: arg_sort.type,
                    value: arg_sort.value
                });
            }

            return $http(ApiFactory.getList('question/grid?param=', param));
        };

        questionFactory.create = function (arg_question) {
            var objQuestion = {
                id: arg_question.id,
                questionSet: {
                    id: arg_question.questionSet.id,
                    name: arg_question.questionSet.name,
                    category: {
                        id: arg_question.category.id,
                        name: arg_question.category.name
                    }
                },
                text: arg_question.text.replace(/'/g, '`'),
                isTrueFalse: arg_question.isTrueFalse,
                correctAnswer: arg_question.correctAnswer,
                wrongAnswer1: arg_question.wrongAnswer1,
                wrongAnswer2: arg_question.wrongAnswer2,
                wrongAnswer3: arg_question.wrongAnswer3
            };

            return $http(ApiFactory.post('question', objQuestion, null));
        };

        questionFactory.update = function (arg_question) {
            var objQuestion = {
                id: arg_question.id,
                questionSet: {
                    id: arg_question.questionSet.id,
                    name: arg_question.questionSet.name,
                    category: {
                        id: arg_question.category.id,
                        name: arg_question.category.name
                    }
                },
                text: arg_question.text.replace(/'/g, '`'),
                isTrueFalse: arg_question.isTrueFalse,
                correctAnswer: arg_question.correctAnswer,
                wrongAnswer1: arg_question.wrongAnswer1,
                wrongAnswer2: arg_question.wrongAnswer2,
                wrongAnswer3: arg_question.wrongAnswer3
            };

            return $http(ApiFactory.put('question', objQuestion, null));
        };

        questionFactory.delete = function (arg_question_ids) {
            return $http(ApiFactory.delete('question?ids=' + arg_question_ids));
        };

        questionFactory.findByQuestionSetID = function (arg_question_set_id) {
            return $http(ApiFactory.getList('/questionset/' + arg_question_set_id + '/question'));
        };

        questionFactory.findByQuestionID = function (arg_question_id) {
            return $http(ApiFactory.get('question/' + arg_question_id ));
        };

        questionFactory.resumeExam = function (arg_question_id) {
            return $http(ApiFactory.get('/quiz/' + arg_question_id, null, null));
        };

        questionFactory.findAllBiographies = function () {
            return $http(ApiFactory.getList('question/biography', null));
        };

        questionFactory.findAllBiographiesByGridParam = function (argStart, argLimit, argFilter, argSort) {
            var param = {};
            param.start = argStart;
            param.limit = argLimit;
            param.filter = [];
            param.sort = [];

            if (argFilter) {
                param.filter.push(argFilter);
            }

            if (argSort) {
                param.sort.push({
                    property: argSort.type,
                    value: argSort.value
                });
            }
            return $http(ApiFactory.get('question/biography/grid?param=', param));
        };

        questionFactory.addUpdateBiography = function (arg_biography) {
            return $http(ApiFactory.postWithFormData('question/biography', arg_biography));
        };

        questionFactory.deleteBiography = function (arg_biography_id) {
            return $http(ApiFactory.delete('question/biography?ids=' + arg_biography_id));
        };

        return questionFactory;
    }]);
