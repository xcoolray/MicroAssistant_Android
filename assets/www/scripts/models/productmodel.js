angular.module('models.product', ['$serverModels']);
angular.module('models.product').factory('productmodel', ['$serverModels', '$pagination', '$dataCache', function ($serverModels, $pagination, $dataCache) {

    var productmodel = $serverModels();
    var catalogCache = $dataCache.getCatalogCache();

    var removeCatalogCache = function () {
        catalogCache.removeAll();
    }


    productmodel.getcatalogs = function (pageindex, pagesize, scb, ecb) {
        var refresh = pageindex < 0;
        pageindex = pageindex >= 0 ? pageindex : 0;
        var key = 'cat_' + pageindex + '_' + pagesize;
        if (!refresh) {
            var cache = catalogCache.get(key);
            if (cache) {
                typeof scb == 'function' && scb.apply(null, [cache]);
                return;
            }
        }
        else {
            removeCatalogCache();
        }
        return productmodel.query({
            url: $sitecore.urls["productCat"],
            data: { pageIndex: pageindex, pageSize: pagesize },
            lock: true,
            scb: function (data) {
                catalogCache.put(key, data);
                typeof scb == 'function' && scb.apply(this, arguments);
            },
            ecb: ecb
        });
    };

    productmodel.getproducts = function (catid, pageindex, pagesize, scb, ecb) {

        var productCache = $dataCache.getProductCache(catid);

        var refresh = pageindex < 0;
        pageindex = pageindex >= 0 ? pageindex : 0;
        var key = 'pro_' + pageindex + '_' + pagesize;

        if (!refresh) {
            var cache = productCache.get(key);
            if (cache) {
                typeof scb == 'function' && scb.apply(null, [cache]);
                return;
            }
        }
        else {
            productCache.removeAll();
        }

        return productmodel.query({
            url: $sitecore.urls["productList"],
            data: { typeid: catid, pageIndex: pageindex, pageSize: pagesize },
            lock: true,
            scb: function (data) {
                productCache.put(key, data);
                typeof scb == 'function' && scb.apply(this, arguments);
            },
            ecb: ecb
        });
    };

    productmodel.addcatalog = function (name, picid, scb, ecb) {
        return productmodel.query({
            url: $sitecore.urls["productAddCat"],
            data: { fatherid: 0, pTypeName: name, ptypepicid: picid || 0 },
            lock: true,
            scb: function (data) {
                removeCatalogCache();
                typeof scb == 'function' && scb.apply(this, arguments);
            },
            ecb: ecb
        });
    };

    return productmodel;
}]);