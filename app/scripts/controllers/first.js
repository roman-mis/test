'use strict';
console.log('333');
angular.module('origApp.controllers')
        .controller('first', function($scope, $rootScope, $location, AuthService, $state, userPermissions) {
          console.log('dkjd');
          $rootScope.currentUser = null;
          if(AuthService.isLoggedIn()){
            $rootScope.currentUser = AuthService.getCurrentUser();
          }
          var currentUser = AuthService.getCurrentUser();
          console.log(currentUser);
          $state.go('app.agencies');
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