'use strict';

/**
 * @ngdoc constant
 * @name origApp.nationality
 * @description
 * # nationality
 * Constant in the origApp.
 */
angular.module('origApp.constants')
        .factory('ConstantsResource', function(HttpResource) {
          var data = {};
          var hashData = {};

          var api = HttpResource.model('constants');

          var _resource = {
            get: function(key) {
              if (data[key] && data[key].length > 0) {
                return data[key];
              }
              data[key] = api.customGet(key, {}, function(){
                hashData[key] = _resource.makeHashData('code', data[key]);
              });
              return data[key];
            },
            makeHashData: function(hashKey, items) {
              var ret = {};
              items.forEach(function(item){
                ret[item[hashKey]] = item;
              });
              return ret;
            },
            getHashData: function(key){
              return hashData[key];
            }
          };

          return _resource;
        });
