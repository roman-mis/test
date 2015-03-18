'use strict';
angular.module('origApp.services')
    .factory('paymentRatesService', function(HttpResource, $q) {

        var paymentRates = {};
        var acAPI = HttpResource.model('systems/paymentrates');

        function _getPaymentRates(){
            var d = $q.defer();

            if(paymentRates.length > 0){
                d.resolve(paymentRates);
            }
            else {
                acAPI.query({}, function(data) {
                    if(data.data.objects){
                        paymentRates = data.data;
                        d.resolve(paymentRates);
                    }
                    else {
                        d.reject('no data');
                    }
                });
            }

            return d.promise;
        }

        function _savePaymentRates(data, docId){
            var d = $q.defer();
            paymentRates = data;
            if (docId){
                acAPI.create(paymentRates).patch().then(function(result){
                        d.resolve(result);
                    });
            }
            else {
                acAPI.create(paymentRates).post().then(function(response) {
                    if (!HttpResource.flushError(response)) {
                        d.resolve(response);
                    }
                });
            }

            return d.promise;
        }

        return {
            getPaymentRates: _getPaymentRates,
            savePaymentRates : _savePaymentRates
        };

    });