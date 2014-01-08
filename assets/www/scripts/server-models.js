angular.module('$serverModels', []).factory('$serverModels', ['$sitecore', '$http', '$q', function ($sitecore, $http, $q) {

    function ServerModelsFactory() {

        var thenFactoryMethod = function (httpPromise, successcb, errorcb, parseFn, lock) {
            var scb = successcb || angular.noop;
            var ecb = errorcb || angular.noop;
            var parseFn = parseFn || Resource.defaultParseFn;
            if (lock) {
                angular.showLoading(lock);
            }
            return httpPromise.then(function (response) {
                var result;
                if (lock) {
                    angular.hideLoading(lock);
                }
                if (response.Error) {
                    if (ecb == angular.noop) {
                        Resource.error(response.ErrorMessage);
                    }
                }
                else {
                    parseFn(response, function (data) {
                        if (angular.isArray(data)) {
                            result = [];
                            for (var i = 0; i < data.length; i++) {
                                result.push(new Resource(data[i]));
                            }
                        }
                        else {
                            result = new Resource(data);
                        }
                    });
                    scb(result, response.status, response.headers, response.config);
                }
                return result;
            }, function (response) {
                ecb(undefined, response.status, response.headers, response.config);
                return undefined;
            });
        };

        var Resource = function (data) {
            angular.extend(this, data);
        };

        Resource.defaultParseFn = function (response, parsecb) {
            parsecb(response.data);
        };

        Resource.error = function (msg) {
            angular.showMessage(msg);
        };

        Resource.query = function (config) {
            var httpPromise = $http.post(config.url, config.data);
            return thenFactoryMethod(httpPromise, config.scb, config.ecb, config.pfn, false);
        };

        return Resource;
    }

    return ServerModelsFactory;
}]);
