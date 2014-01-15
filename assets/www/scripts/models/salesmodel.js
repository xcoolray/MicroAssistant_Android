angular.module('models.sales', ['$serverModels']);
angular.module('models.sales').factory('salesmodel', ['$serverModels', function ($serverModels) {

    var salesmodel = $serverModels();

    salesmodel.get = function (pid, scb, ecb) {
        return salesmodel.query({
            url: $sitecore.urls["GetPic"],
            data: { picid: pid },
            lock: false,
            scb: scb,
            ecb: ecb
        });
    };

    return salesmodel;
}]);