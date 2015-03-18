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

  function _saveCompanyProfile(data, tab){
    var d = $q.defer();
  if(tab==='contact'){
  
    companyProfile=data.contact;
  }else if(tab==='accounts'){
    companyProfile=data.accounts;
  }else if(tab ==='bankDetails'){
    companyProfile = data.bankDetails;
  }else if(tab ==='defaults'){
    companyProfile = data.defaults;
  }

    if (data){
      HttpResource.model('systems/companyProfile/' + tab)
      .create(companyProfile).post().then(function(result){
        console.log(result);
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