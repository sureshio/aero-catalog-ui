angular.module('heritageApp')
    .filter('pictureUrl', ['$sce', 'Config', function ($sce, Config) {
        return function (input) {
            if(!input) {
                return 'images/picture-01-256.png';
            } else {
                return $sce.trustAsUrl(Config.BASE_URL + Config.IMAGE_PATH + input);
            }
        };
    }]);
