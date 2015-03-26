'use strict';
angular.module('origApp.services')
    .factory('expensesRateService', function (HttpResource, $q) {

        var expensesRate = {};
        var acAPI = HttpResource.model('systems/expensesRate');

        function _getExpensesRate() {
            var d = $q.defer();

            if (expensesRate.length > 0) {
                d.resolve(expensesRate);
            } else {
                acAPI.query({}, function (data) {
                    if (data.data.objects) {
                        expensesRate = data.data;
                        d.resolve(expensesRate);
                    } else {
                        d.reject('no data');
                    }
                });
            }

            return d.promise;
        }

        function _saveExpensesRate(data, docId) {
            var d = $q.defer();
            expensesRate = data;
            if (docId) {
                acAPI.create(expensesRate).patch().then(function (result) {
                    d.resolve(result);
                });
            } else {
                acAPI.create(expensesRate).post().then(function (response) {
                    if (!HttpResource.flushError(response)) {
                        d.resolve(response);
                    }
                });
            }

            return d.promise;
        }

        return {
            getExpensesRate: _getExpensesRate,
            saveExpensesRate : _saveExpensesRate
        };

    });