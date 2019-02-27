angular.module('heritageApp')
	.factory('GradeFactory', ['$http', 'Config', 'ApiFactory', function ($http, Config, ApiFactory) {
		'use strict';
		var gradeFactory = {};

		gradeFactory.findByGridParam = function (arg_start, arg_limit, arg_filter, arg_sort) {
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

			return $http(ApiFactory.get('grade/grid?param=', param));
		};

		gradeFactory.addUpdate = function (arg_grade) {
			var obj = {
                id: arg_grade.id,
                name: arg_grade.name,
                unit: arg_grade.unit,
                maxValue: arg_grade.maxValue,
                minValue: arg_grade.minValue,
                questionSet: {
                    id: arg_grade.questionSet.id,
                    name: arg_grade.questionSet.name,
                    category: {
                        id: arg_grade.category.id,
                        name: arg_grade.category.name
                    }
                }
            };

			if(arg_grade.id) {
			    return $http(ApiFactory.put('grade', obj, null));
			} else {
                return $http(ApiFactory.post('grade', obj, null));
            }
		};

		gradeFactory.delete = function (arg_grade_ids) {
			return $http(ApiFactory.delete('grade?ids=' + arg_grade_ids));
		};

		return gradeFactory;
}]);
