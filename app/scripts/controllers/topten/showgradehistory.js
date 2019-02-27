/**
 * @ngdoc function
 * @name heritageApp.controller:ToptenShowgradehistoryCtrl
 * @description
 * # ToptenShowgradehistoryCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
	.controller('ToptenShowgradehistoryCtrl', ['$scope', '$state', '$uibModal', 'TopTenFactory', 'Config', function ($scope, $state, $uibModal, TopTenFactory, Config) {
		'use strict';

		function init() {
			$scope.loadingDiv = true;
			$scope.gradeHistoryList = {};
			$scope.gradeHistory = [
				{
					'questionSetName': '',
					'gradeName': '',
					'achieveDate': ''
  				}
			];
			
			loadAllGradeHistory();
		}
		
		function loadAllGradeHistory() {
			TopTenFactory.findGradeHistory().then(function (response) {
				$scope.gradeHistoryList = response.data;
				$scope.loadingDiv = false;
			}, function (response) {

			});
		}

		init();

  }]);