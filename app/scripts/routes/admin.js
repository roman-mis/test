angular.module("origApp").config(function($stateProvider) {
  $stateProvider
    .state('app.admin', {
      url: '/admin',
      templateUrl: 'views/admin/home.html',
      controller: 'CubeCtrl'
    });
});