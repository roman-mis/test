'use strict';
console.log(1)
angular.module('origApp.services')
.factory('userPermissions', function(HttpResource, $q) {

  var permissions = {};

  function _getUserPermission(type){
    var d = $q.defer();

    var acAPI = HttpResource.model('constants/candidateProfile/' + type);

    acAPI.query({}, function(data) {
      permissions = data.data;
      d.resolve(permissions);
    });
    
    return d.promise;
  }



  return {
    permissions: permissions,
    getUserPermission: _getUserPermission
  };

});