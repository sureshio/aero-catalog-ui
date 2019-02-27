angular.module('heritageApp')
    .factory('QuestionSetFactory', ['$http', 'Config', 'ApiFactory', function ($http, Config, ApiFactory) {
        'use strict';

        var questionSetFactory = {};

        questionSetFactory.addUpdate = function (arg_question_set) {
            var obj = {
                id: arg_question_set.id,
                category: {
                    id: arg_question_set.category.id,
                    name: arg_question_set.category.name
                },
                name: arg_question_set.name
            };

            if (arg_question_set.id) {
                return $http(ApiFactory.put('questionset', obj, null));
            } else {
                return $http(ApiFactory.post('questionset', obj, null));
            }
        };

        questionSetFactory.delete = function (arg_question_set_id) {
            return $http(ApiFactory.delete('questionset?ids=' + arg_question_set_id));
        };

        questionSetFactory.findByCategoryId = function (arg_category_id) {
            return $http(ApiFactory.getList('category/' + arg_category_id + '/questionset', null));
        };

        questionSetFactory.findAllQuestionSets = function (arg_start, arg_limit, arg_filter, arg_sort) {
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

            return $http(ApiFactory.getList('questionset/grid?param=', param));
        };

        return questionSetFactory;
    }]);
