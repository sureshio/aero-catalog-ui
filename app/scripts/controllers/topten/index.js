/**
 * @ngdoc function
 * @name heritageApp.controller:ToptenIndexCtrl
 * @description
 * # ToptenIndexCtrl
 * Controller of the heritageApp
 */
angular.module('heritageApp')
	.controller('ToptenIndexCtrl', ['$scope', '$state', '$uibModal', 'TopTenFactory', 'CategoryFactory', 'Config', function ($scope, $state, $uibModal, TopTenFactory, CategoryFactory, Config) {
		'use strict';

		function init() {
			$scope.loadingDiv = true;
			$scope.categoryList = {};
			$scope.highScore = [
				{
					high_score_id: '',
					user_id: '',
					player_name: '',
					player_score: '',
					category_id: ''
  				}
			];
			$scope.category = {
				id: '',
				name: ''
			};
			$scope.event = {
				columns: [{
					key: 'rank',
					clickCount: 0
                    }, {
					key: 'playerName',
					clickCount: 0
					}, {
					key: 'playerScore',
					clickCount: 0
				}]
			};
			loadAllCategories();
		}

		$scope.reset = function () {
               loadAllCategories();
            };

		function loadAllCategories() {
			CategoryFactory.findAll().then(function (response) {
				$scope.categoryList = response.data;
				$scope.category = $scope.categoryList[0];
				$scope.loadHighScoreByCategoryId($scope.category.id);
				$scope.loadingDiv = false;
			}, function (response) {

			});
		}
		$scope.loadHighScoreByCategoryId = function (arg_category_id) {
			TopTenFactory.findAll(arg_category_id).then(function (response) {
				$scope.highScoreList = response.data;
			}, function (response) {

			});
		}
		$scope.sort = function (arg_col) {
			var obj = null;
			//$scope.enableSorting = true;
			for (var i = 0; i < $scope.event.columns.length; i += 1) {
				var col = $scope.event.columns[i];
				if (col.key === arg_col) {
					if (col.clickCount === 2) {
						col.clickCount = 0;
					} else {
						col.clickCount += 1;
						obj = {};
						obj.type = arg_col;
						if (col.clickCount === 1) {
							obj.value = 'asc';
						}
						if (col.clickCount === 2) {
							obj.value = 'desc';
						}
					}
				} else {
					col.clickCount = 0;
				}
			}
			if (arg_col) {
				$scope.loadHighScoreByCategoryId();

			}
		};


		init();

  }]);
