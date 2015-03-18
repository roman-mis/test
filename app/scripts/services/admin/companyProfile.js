'use strict';
angular.module('origApp.services')
.factory('CompanyProfileService', function(HttpResource, $q) {

  var companyProfile = {};
  var acAPI = HttpResource.model('systems/companyProfile');

  function _getCompanyProfile(){
    var d = $q.defer();

    if(companyProfile.length > 0){
      d.resolve(companyProfile);
    }
    else {
      acAPI.query({}, function(data) {
        if(data.data.companyProfile){
          companyProfile = data.data;
          d.resolve(companyProfile);
        }
        else {
          d.reject('no data');
        }
      });
    }
    
    return d.promise;
  }

  function _saveCompanyProfile(data, docId, tab){
    console.log(docId);
    var d = $q.defer();
  //  var data='data.'+tab;
  if(tab==='/profile'){
    companyProfile=data.contact;
  }else if(tab==='/accounts'){
    companyProfile=data.accounts;
  }else if(tab ==='/bankDetails'){
    companyProfile = data.bankDetails;
  }else if(tab ==='/defaults'){
    companyProfile = data.defaults;
  }
  console.log(companyProfile);
    console.log(data);
    if (docId){
      HttpResource.model('systems/companyProfile/' + docId + tab)
      .create(companyProfile).post().then(function(result){
        console.log(result);
      });
    }
    else {
      acAPI.create(companyProfile).post().then(function(response) {
        console.log(response);
        if (!HttpResource.flushError(response)) {
          console.log('saved successfully');
        }
      });
    }
    d.resolve('saved successfully');
    return d.promise;
  }

  function _getDropDownData(){
    var d = $q.defer();
    HttpResource.model('constants').customGet('/adminCompanyProfileData/', {},
      function(data){
        d.resolve(data.data);
      });
    return d.promise;
  }

  return {
    getCompanyProfile: _getCompanyProfile,
    saveCompanyProfile: _saveCompanyProfile,
    getDropDownData: _getDropDownData
  };

});