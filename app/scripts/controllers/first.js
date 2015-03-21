'use strict';
angular.module('origApp.controllers')
        .controller('first', function($scope, $rootScope, $location, AuthService, $state, userPermissions) {
          console.log(1111)
          $rootScope.currentUser = null;
          if(!AuthService.isLoggedIn()){
            $state.go('register.home');
          } else {
            $rootScope.currentUser = AuthService.getCurrentUser();
            var params = {};
            userPermissions.first($rootScope.currentUser.userType).then(function(data){
              for(var i = 0; i < data.open.stateParams.length; i++){
                params[data.open.stateParams[i].key] = $rootScope.currentUser[data.open.stateParams[i].value];
              }
              $state.go(data.open.state, params);
            });
          }
        });