/**
 * @ngdoc service
 * @name heritageApp.topTenFactory
 * @description
 * # topTenFactory
 * Service in the heritageApp.
 */
angular.module('heritageApp')
  .service('TopTenFactory',['$http', 'ApiFactory', function($http, ApiFactory) {
	'use strict';
	
	var topTenFactory = {};
	  
	  topTenFactory.findAll = function(arg_category_id) {
          return $http(ApiFactory.getList('highscore/'+ arg_category_id, null));
        };
	  
	  topTenFactory.findGradeHistory = function() {
          return $http(ApiFactory.getList('highscore/grade/history', null));
        };
	
	
	
	return topTenFactory;
   
  }]);
