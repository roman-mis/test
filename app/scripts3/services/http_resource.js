'use strict';

/**
 * @ngdoc service
 * @name originemApp.HttpResourceFactory
 * @description
 * # HttpResourceFactory
 * Provider in the originemApp.
 */
angular.module('origApp.services')
  .provider('HttpResource', function(TastyResourceProvider) {
    var baseUrl = '';
    // setBaseUrl
    this.setBaseUrl = function(uri) {
      baseUrl = uri;
    };

    var formatFactory = function(TastyResource, modelName) {
      var resource = baseUrl + '' + modelName + '/';
      return TastyResource({
        url: resource,
        cache: false
      });
    };

    // Method for instantiating
    this.$get = ['TastyResource', 'MsgService', function(TastyResource, MsgService) {
        return {
          model: function(modelName) {
            return  formatFactory(TastyResource, modelName);
          },
          flushError: function(response){
            if(response.data && response.data.result && response.status === 200){
              return false;
            }
            if(response.data && response.data.message){
              MsgService.alert(response.data.message, 'danger');
            }else{
              MsgService.alert('Unknown error occurred.', 'danger');
            }
            return true;
          }
        };
      }];
  });