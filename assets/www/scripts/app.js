angular.module('microassistant', ['ngTouch', 'ngAnimate', 'models.user', 'models.respic', 'models.product', 'models.sales', 'models.finance']).
 config(['$provide', '$compileProvider', '$httpProvider', function ($provide, $compileProvider, $httpProvider) {

     $httpProvider.interceptors.push(function () {
         return {
             'response': function (response) {
                 if (response && typeof response.data === 'object') {
                     if (response.data.Error == 11) {
                         setTimeout(function () { angular.section("account-login"); }, 1);
                     }
                 }
                 return response || $q.when(response);
             }
         };
     });

     function makeRefreshDirective(directiveName, eventName) {
         $compileProvider.directive(directiveName, ['$parse', function ($parse) {
             return {
                 compile: function ($element, attr) {
                     var fn = $parse(attr[directiveName]);
                     return function (scope, element, attr) {
                         element.on(angular.lowercase(eventName), function (event) {
                             scope.$apply(function () {
                                 fn(scope, { $event: event });
                             });
                         });
                     };
                 }
             };
         }]);
     }

     makeRefreshDirective('ngRefresh', 'refresh');
 }])
    .constant('$sitecore', $sitecore)
    .constant('$pagination', { pageindex: 0, pagesize: 10 })
    .value('$anchorScroll', angular.noop)
    .service('$dataCache', ['$cacheFactory', function ($cacheFactory) {
        var userCacheKey = 'userCacheKey', catalogsCacheKey = 'catalogsCacheKey', productCacheKey = 'productCacheKey';
        var getCache = function (key) {
            var cache = $cacheFactory.get(key);
            if (!cache) {
                cache = $cacheFactory(key);
            }
            return cache;
        };

        this.getUserCache = function () {
            return getCache(userCacheKey);
        };
        this.getCatalogCache = function () {
            return getCache(catalogsCacheKey);
        };
        this.getProductCache = function (catid) {
            return getCache(productCacheKey + catid);
        };
        this.getListCache = function (catalogKey) {
            return getCache(catalogKey);
        };
    }])
    .service('$routeParams', function () {
        return {};
    })
    .service('$environment', function () {
        return Lungo.Core.environment();;
    });

function MainCtrl($scope, $rootScope, $http, $filter, usermodel, respicmodel) {

    var updataUser = function () {
        usermodel.loadCurrentUser(function (data) {
            $rootScope.CurrentUser = data.Data;
            if (data.Data.PicId > 0) {
                respicmodel.get(data.Data.PicId, function (data) {
                    $rootScope.HeadPicUrl = $sitecore.wrapsrc(data.Data.PicUrl);
                });
            }
            else {
                $rootScope.HeadPicUrl = 'img/Adimg/tx.png';
            }
        }, function () {
            $rootScope.CurrentUser = {};
        });
    }

    $scope.$on('onLoginSuccess', function () {
        updataUser();
    });
    updataUser();

    $scope.showMenu = function (ev) {
        if (angular.isMenuShowing())
            return false;
        angular.showMenu(ev, Lungo.Element.Cache.section);
    };

    $scope.hideMenu = function (ev) {
        angular.hideMenu(ev);
    };

    $scope.menuToSection = function (sectionId, resource) {
        var target = Lungo.dom("#" + sectionId);
        if (resource) {
            if (target.length) {
            }
            else {
                Lungo.Resource.load(resource);
                Lungo.Boot.Data.init("#" + sectionId);
                target = Lungo.dom("#" + sectionId);
                target.trigger('load');
            }
        }
        Lungo.dom("#contentWraper").append(Lungo.dom("#" + sectionId));
        //angular.section(sectionId);
        if (sectionId != Lungo.Element.Cache.section.attr('id'))
        {
            angular.changeMenuContent(Lungo.dom("#" + sectionId));
            Lungo.Element.Cache.section = Lungo.dom("#" + sectionId);

            //Lungo.Element.Cache.section.removeClass(Lungo.Constants.CLASS.SHOW);
            //Lungo.dom("#" + sectionId).addClass(Lungo.Constants.CLASS.SHOW);
        }


        angular.hideMenu({});
    };
}

