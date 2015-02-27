'use strict';

angular.module('origApp.controllers')
.controller('HmrcController', function($scope, $rootScope, $stateParams) {
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
      {link: '/admin/home', text: 'Admin'},
      {link: '/admin/hmrc', text: 'HMRC'}
    ];
});