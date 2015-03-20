'use strict';
console.log('333');
angular.module('origApp.controllers')
        .controller('first', function($scope, $rootScope, $location, AuthService, $state, userPermissions) {
          console.log('dkjd');
          var currentUser = AuthService.getCurrentUser();
          var params = {};
          userPermissions.first(currentUser.userType).then(function(data){
            console.log(data);            // if($location.path() === '/'){
            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
            for(var i = 0; i < data.open.stateParams.length; i++){
              params[data.open.stateParams[i].key] = currentUser[data.open.stateParams[i].value];
            }
            console.log(params);
            $state.go(data.open.state,params);
            // }
          });
        });