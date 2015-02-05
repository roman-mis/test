var app = angular.module('origApp.controllers');

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app.admin.one', {
    url: '/one',
    templateUrl: 'views/admin/page1.html'
  })
  .state('app.admin.two', {
    url: '/two',
    templateUrl: 'views/admin/page2.html'
  })
  .state('app.admin.three', {
    url: '/three',
    templateUrl: 'views/admin/page3.html'
  });
  $urlRouterProvider.otherwise('/one');
});

app.controller('CubeCtrl', function($scope, $rootScope, $location) {

  $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                            {link: '/admin', text: 'Admin'}];

  $scope.go = function(path) {
  $location.path(path);
 }

});