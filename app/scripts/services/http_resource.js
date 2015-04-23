'use strict';

/**
 * @ngdoc service
 * @name originemApp.HttpResourceFactory
 * @description
 * # HttpResourceFactory
 * Provider in the originemApp.
 */
angular.module('origApp.services')
  .provider('HttpResource', function() {
    var baseUrl = '';
    // setBaseUrl
    this.setBaseUrl = function(uri) {
      baseUrl = uri;
    };

    var formatFactory = function(TastyResource, modelName) {
        console.log(modelName);
      var resource = baseUrl + '' + modelName + '/';
      console.log(resource);
      //console.log(resource)
      return new TastyResource({
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
              console.log(response);

              MsgService.alert('Unknown error occurred.', 'danger');
            }
            return true;
          }
        };
      }];
  });
