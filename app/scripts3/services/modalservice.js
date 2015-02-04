'use strict';
/*global _:false, $:false */
angular.module('origApp.services')
  .factory('ModalService', function($modal) {
    var defaultOptions = {
      
    };
    
    var _ModalSrv = {
      open: function(options){
        var modalOptions = {
          templateUrl: options.templateUrl,
          controller: options.controller,
          resolve: {
            parentScope: function() {
              return options.parentScope;
            },
            params: function(){
              return options.params;
            }
          }
        };
        if(options.size){
          modalOptions.size = options.size;
        }
        var modalInstance = $modal.open(modalOptions);
        return modalInstance;
      }
    };

    return _ModalSrv;
  });
