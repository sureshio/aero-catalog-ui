angular.module('heritageApp')
    .filter('rawHtml', ['$sce', function ($sce) {
        return function (input) {
            if(!input) {
                return '';
            } else {
                return $sce.trustAsHtml(input.replace(/(\r\n|\n|\r)/gm, "<br><br>"));
            }
        };
    }]);
