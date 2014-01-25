angular.module('models.sales', ['$serverModels']);
angular.module('models.sales').factory('salesmodel', ['$serverModels', function ($serverModels) {

    var salesmodel = $serverModels();

    salesmodel.getlist = function (steps, pageindex, pagesize, scb, ecb) {
        var url;
        switch (steps) {
            case 'chance':
                url = $sitecore.urls["salesChanceList"];
                break;
            case 'visit':
                url = $sitecore.urls["salesChanceVisitList"];
                break;
            case 'contract':
                url = $sitecore.urls["salesConractList"];
                break;
            case 'after':
                url = $sitecore.urls["salesChanceList"];
                break;
        }

        return salesmodel.querylist({
            url: url,
            data: { pageIndex: pageindex, pageSize: pagesize },
            lock: true,
            refresh: pageindex < 0,
            getMore: pageindex > 0,
            cacheKey: 'sales_' + steps,
            pagesize: pagesize,
            scb: scb,
            ecb: ecb
        });
    };

    salesmodel.getaddress = function (lat, lng, scb, ecb) {
        var url = $sitecore.urls["BaiduGeocoder"];
        url = url.replace('{lat}', lat);
        url = url.replace('{lng}', lng);
        return salesmodel.query({
            url: url,
            data: { },
            lock: false,
            scb: scb,
            ecb: ecb
        });
    };

    salesmodel.addvisit = function (visit, scb, ecb) {
        return salesmodel.query({
            url: $sitecore.urls["salesAddChanceVisits"],
            data: {
                cid: visit.IdmarketingChance,
                vid: visit.IdmarketingVisit,
                visitType: visit.VisitType,
                remark: visit.Remark,
                amount: visit || 0,
                address: visit.Address
            },
            lock: false,
            scb: scb,
            ecb: ecb
        });
    };

    return salesmodel;
}]);