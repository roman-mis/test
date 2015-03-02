'use strict';
angular.module('origApp.services')
  .factory('ModalService', function($modal) {
    var _ModalSrv = {
      open: function(options){
        var modalOptions = {
          templateUrl: options.templateUrl,
          controller: options.controller,
          scope: options.scope,
          resolve: {
            parentScope: function() {
              return options.parentScope;
            },
            params: function(){
              return options.params;
            }
          },
          backdrop: options.backdrop || true
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
