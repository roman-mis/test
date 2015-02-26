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
          d.reject("no data");
        }
      });
    }
    
    return d.promise;
  }

  function _saveStatutoryRates(data, docId){
    var d = $q.defer();
    statutoryRates = data;
    if (docId){
      HttpResource.model('systems/statutoryRates/' + docId)
      .create(statutoryRates).post().then(function(result){
        console.log(result);
      });
    }
    else {
      acAPI.create(statutoryRates).post().then(function(response) {
        if (!HttpResource.flushError(response)) {
          console.log('saved successfully');
        }
      });
    }
    d.resolve('saved successfully');
    return d.promise;
  }

  return {
    getStatutoryRates: _getStatutoryRates,
    saveStatutoryRates: _saveStatutoryRates
  };

});