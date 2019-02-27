/**
 * @ngdoc overview
 * @name heritageApp
 * @description
 * # heritageApp
 *
 * Main module of the application.
 */
angular.module('heritageApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'oitozero.ngSweetAlert',
    'angular-storage'
])
    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        'use strict';

        $httpProvider.interceptors.push('RestInterceptor');

        // For any unmatched url, redirect to /signin
        $urlRouterProvider.otherwise("/signin");

        $stateProvider
            .state('site', {
                'abstract': true
            })
            .state('sign-in', {
                parent: 'site',
                url: '/signin',
                views: {
                    'content@': {
                        templateUrl: 'views/signIn.html',
                        controller: 'AuthenticationController'
                    }
                }
            })
            .state('sign-up', {
                parent: 'site',
                url: '/signup',
                views: {
                    'content@': {
                        templateUrl: 'views/signup.html',
                        controller: 'ProfileCreateCtrl'
                    }
                }
            })
            .state('forgot-password', {
                parent: 'site',
                url: '/forgotPassword',
                views: {
                    'content@': {
                        templateUrl: 'views/forgotPassword.html',
                        controller: 'AuthenticationController'
                    }
                }
            })
            .state('home', {
                parent: 'site',
                url: '/',
                cache: false,
                views: {
                    'content@': {
                        templateUrl: 'views/dashboard.html'
                    },
                    'header@home': {
                        templateUrl: 'views/home/homeheader.html'
                    },
                    'menu@home': {
                        templateUrl: 'views/home/homemenu.html'
                    },
                    '@home': {
                        templateUrl: 'views/home/homebodycontent.html'
                    },
                    'footer@home': {
                        templateUrl: 'views/home/homefooter.html'
                    }
                }
            })

            .state('home.option', {
                url: 'optionmenu',
                templateUrl: 'views/home/optionmenu.html',
                controller: 'OptionMenuCtrl'
            })

            .state('home.questionset', {
                url: 'questionset',
                templateUrl: 'views/home/questionset.html'
            })
                .state('home.questionset.index', {
                    url: '/index',
                    params: {
                        returnState: null,
                        returnParams: null
                    },
                    templateUrl: 'views/home/questionset/index.html',
                    controller: 'QuestionSetIndexCtrl'
                })

            .state('home.category', {
                url: 'category',
                templateUrl: 'views/home/category.html'
            })
                .state('home.category.index', {
                    url: '/index',
                    params: {
                        returnState: null,
                        returnParams: null
                    },
                    templateUrl: 'views/home/category/index.html',
                    controller: 'CategoryIndexCtrl'
                })

            .state('home.change-password', {
                url: 'changepassword',
                templateUrl: 'views/home/changepassword.html',
                controller: 'AuthenticationController'
            })

            .state('home.biography', {
                url: 'biography',
                templateUrl: 'views/home/photobook.html'
            })
                .state('home.biography.index', {
                    url: '/index',
                    templateUrl: 'views/home/biography/index.html',
                    controller: 'BiographyIndexCtrl'
                })
                .state('home.biography.list', {
                    url: '/list',
                    templateUrl: 'views/home/biography/list.html'
                })

            .state('home.administrator', {
                url: 'administrator',
                templateUrl: 'views/home/profile.html'
            })
                .state('home.administrator.create', {
                    url: '/create',
                    templateUrl: 'views/home/profile/create.html',
                    controller: 'ProfileCreateCtrl'
                })
                .state('home.administrator.edit', {
                    url: '/{id: int}/edit',
                    templateUrl: 'views/home/profile/edit.html',
                    controller: 'ProfileEditCtrl'
                })

            .state('home.topTen', {
                url: 'topten',
                templateUrl: 'views/home/topten/index.html',
                controller: 'ToptenIndexCtrl'
            })

            .state('home.showGradeHistory', {
                url: 'showgradehistory',
                templateUrl: 'views/home/topten/showgradehistory.html',
                controller: 'ToptenShowgradehistoryCtrl'
            })

            .state('home.question', {
                url: 'question',
                templateUrl: 'views/home/question.html'
            })
                .state('home.question.create', {
                    url: '/create',
                    templateUrl: 'views/home/question/create.html',
                    controller: 'QuestionCreateCtrl'
                })
                .state('home.question.edit', {
                    url: '/{id: int}/edit',
                    templateUrl: 'views/home/question/edit.html',
                    controller: 'QuestionEditCtrl'
                })
                .state('home.question.list', {
                    url: '/list',
                    templateUrl: 'views/home/question/list.html',
                    controller: 'QuestionListCtrl'
                })

            .state('home.quiz', {
                url: 'quiz',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'views/home/quiz/index.html'
            })

            .state('home.grade', {
                url: 'grade',
                templateUrl: 'views/home/grade.html'
            })
                .state('home.grade.index', {
                    url: '/index',
                    templateUrl: 'views/home/grade/index.html',
                    controller: 'GradeIndexCtrl'
                });
    }])
    .run(['$rootScope', '$state', 'SweetAlert', 'AuthenticationFactory', function ($rootScope, $state, SweetAlert, AuthenticationFactory) {
        'use strict';

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            var arr = toState.name.split('.');
            if (arr[0] === 'home') {
                if (!AuthenticationFactory.authorize()) {
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                    $state.go('sign-in');
                }
            }
        });

        $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            if(toState.name === 'home.quiz' && fromState.name === '') {
                e.preventDefault();
                SweetAlert.swal("Error", 'Either you have pressed F5 from keyboard or refreshed from browser!', "error");
                $state.go('home', null, {notify: false}).then(function(state) {
                    $rootScope.$broadcast('$stateChangeSuccess', state, null);
                });
            }

            if(fromState.name === 'home.quiz') {
                e.preventDefault();
                SweetAlert.swal({
                        title: "Warning",
                        text: 'Are you sure you want to leave this page?',
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#A5DC86",
                        confirmButtonText: "Ok",
                        closeOnConfirm: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $state.go('home', null, {notify: false}).then(function(state) {
                                $rootScope.$broadcast('$stateChangeSuccess', state, null);
                            });
                        }
                    });
            }
        });
    }]);
