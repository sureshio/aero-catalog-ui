angular.module('heritageApp')
    .factory('CategoryFactory', ['$http', 'ApiFactory', function ($http, ApiFactory) {
        'use strict';

        var categoryFactory = {};

        categoryFactory.findByGridParam = function (arg_start, arg_limit, arg_filter, arg_sort) {
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

            return $http(ApiFactory.get('category/grid?param=', param));
        };

        categoryFactory.findAll = function () {
            return $http(ApiFactory.getList('category', null));
        };

        categoryFactory.create = function (arg_category) {
            return $http(ApiFactory.post('category', arg_category));
        };

        categoryFactory.update = function (arg_category) {
            return $http(ApiFactory.put('category', arg_category));
        };

        categoryFactory.delete = function (arg_category_ids) {
            return $http(ApiFactory.delete('category?ids=' + arg_category_ids));
        };

        categoryFactory.findByCategoryId = function (arg_category_id) {
            return $http(ApiFactory.getList('category/' + arg_category_id + '/questionset', null));
        };

        return categoryFactory;
    }]);
