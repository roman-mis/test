'use strict';
angular.module('origApp.services')
.factory('StatutoryRatesService', function(HttpResource, $q) {

  var statutoryRates = {};
  var acAPI = HttpResource.model('systems/statutoryRates');

  function _getStatutoryRates(){
    var d = $q.defer();

    if(statutoryRates.length > 0){
      d.resolve(statutoryRates);
    }
    else {
      acAPI.query({}, function(data) {
        if(data.data.statutoryRates){
          statutoryRates = data.data;
          d.resolve(statutoryRates);
        }
        else {
          d.reject('no data');
        }
      });
    }
    
    return d.promise;
  }

  function _addToStatutoryRates(data, statutoryRateType){
    var d = $q.defer();
    // statutoryRates = data;
    if (statutoryRateType){
      HttpResource.model('systems/statutoryRates/add/' + statutoryRateType)
      .create(data).post().then(function(result){
        d.resolve(result);
      });
    }
    return d.promise;
  }

  function _deleteFromStatutoryRates(id, statutoryRateType){
    var d = $q.defer();
    HttpResource.model('systems/statutoryRates/' + statutoryRateType)
    .delete(id).then(function(result){
      d.resolve(result);
    });
    return d.promise;
  }

  return {
    getStatutoryRates: _getStatutoryRates,
    addToStatutoryRates: _addToStatutoryRates,
    deleteFromStatutoryRates: _deleteFromStatutoryRates
  };

});