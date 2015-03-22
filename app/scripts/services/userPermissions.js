'use strict';
angular.module('origApp.services')
.factory('userPermissions', function(HttpResource, $q) {

  var permissions = {permissions:{}};

  function _getUserPermission(type){
    var d = $q.defer();

    var acAPI = HttpResource.model('constants/profiles/' + type + '/permissions');

    acAPI.query({}, function(data) {
      permissions.permissions = data.data;
      d.resolve(permissions);
    });
    
    return d.promise;
  }

  function _first(type){
    var d = $q.defer();

    var acAPI = HttpResource.model('constants/profiles/' + type + '/first');

    acAPI.query({}, function(data) {
      var first = data.data;
      d.resolve(first);
    });
    
    return d.promise;
  }

  return {
    first: _first,
    permissions: permissions,
    getUserPermission: _getUserPermission
  };

});