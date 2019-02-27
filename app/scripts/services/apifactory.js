/**
 * @ngdoc service
 * @name heritageApp.apiFactory
 * @description
 * # apiFactory
 * Factory in the heritageApp.
 */
angular.module('heritageApp')
    .factory('ApiFactory', ['$window', 'store', 'Config', function ($window, store, Config) {
        'use strict';

        return {

            get: function (arg_url, arg_query_param) {
                var config = {};

                config.method = 'GET';

                config.url = Config.BASE_URL + Config.API_PATH + arg_url;
                if (arg_query_param) {
                    config.url = config.url + JSON.stringify(arg_query_param);
                }

                config.dataType = 'json';

                var identification = {};
                if(store.get('info')) {
                    identification = angular.fromJson(store.get('info'));
                }

                config.headers = {};
                config.headers['x-user-id'] = identification.userId;
                config.headers['x-lang-id'] = 1;
                config.headers['x-token'] = identification.token;
                config.headers['Content-Type'] = "application/json";

                return config;
            },

            getList: function (arg_url, arg_query_param) {
                var config = {};

                config.method = 'GET';

                config.url = Config.BASE_URL + Config.API_PATH + arg_url;

                if (arg_query_param) {
                    config.url = config.url + JSON.stringify(arg_query_param);
                }

                config.dataType = 'json';

                var identification = {};
                if(store.get('info')) {
                    identification = angular.fromJson(store.get('info'));
                }

                config.headers = {};
                config.headers['x-user-id'] = identification.userId;
                config.headers['x-lang-id'] = 1;
                config.headers['x-token'] = identification.token;
                config.headers['Content-Type'] = "application/json";

                return config;
            },

            postWithFormData: function (arg_url, arg_form_data) {
                var config = {};

                config.method = 'POST';

                config.url = Config.BASE_URL + Config.API_PATH + arg_url;

                if (arg_form_data) {
                    config.data = arg_form_data;
                }

                var identification = {};
                if(store.get('info')) {
                    identification = angular.fromJson(store.get('info'));
                }

                config.headers = {};
                config.headers['x-user-id'] = identification.userId;
                config.headers['x-lang-id'] = 1;
                config.headers['x-token'] = identification.token;
                config.headers['Content-Type'] = undefined;

                config.transformRequest = angular.identity;

                return config;
            },

            post: function (arg_url, arg_data, arg_query_param) {
                var config = {};

                config.method = 'POST';

                config.url = Config.BASE_URL + Config.API_PATH + arg_url;
                if (arg_query_param) {
                    config.url = config.url + JSON.stringify(arg_query_param);
                }

                config.dataType = 'json';

                if (arg_data) {
                    config.data = JSON.stringify(arg_data);
                }

                var identification = {};
                if(store.get('info')) {
                    identification = angular.fromJson(store.get('info'));
                }

                config.headers = {};
                config.headers['x-user-id'] = identification.userId;
                config.headers['x-lang-id'] = 1;
                config.headers['x-token'] = identification.token;
                config.headers['Content-Type'] = "application/json";

                return config;
            },

            put: function (arg_url, arg_data, arg_query_param) {
                var config = {};

                config.method = 'PUT';

                config.url = Config.BASE_URL + Config.API_PATH + arg_url;
                if (arg_query_param) {
                    config.url = config.url + JSON.stringify(arg_query_param);
                }

                config.dataType = 'json';

                if (arg_data) {
                    config.data = JSON.stringify(arg_data);
                }

                var identification = {};
                if(store.get('info')) {
                    identification = angular.fromJson(store.get('info'));
                }

                config.headers = {};
                config.headers['x-user-id'] = identification.userId;
                config.headers['x-lang-id'] = 1;
                config.headers['x-token'] = identification.token;
                config.headers['Content-Type'] = "application/json";

                return config;
            },

            delete: function (arg_url) {
                var config = {};

                config.method = 'DELETE';

                config.url = Config.BASE_URL + Config.API_PATH + arg_url;

                var identification = {};
                if(store.get('info')) {
                    identification = angular.fromJson(store.get('info'));
                }

                config.headers = {};
                config.headers['x-user-id'] = identification.userId;
                config.headers['x-lang-id'] = 1;
                config.headers['x-token'] = identification.token;
                config.headers['Content-Type'] = "application/json";

                return config;
            }
        };
    }]);
