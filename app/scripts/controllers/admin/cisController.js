'use strict';

angular.module('origApp.controllers')
.controller('CisController', function ($scope, $rootScope, HttpResource, allUsers, ModalService) {
    $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
        { link: '/admin/home', text: 'Admin' },
        { link: '/admin/hmrc/cis', text: 'CIS Verification' }
    ];
    $scope.$parent.tab = 'cis';
    console.log('cis');
    console.log(allUsers.details);


    $scope.delete = function () {
        $scope.cisUser = {};
    };
    HttpResource.model('systems/cisverification').query({},function (res) {
        $scope.cis = res.data.object;
    });
    $scope.editCis = function () {
        ModalService.open({
            templateUrl: 'views/admin/hmrc/partials/editCis.html',
              parentScope: $scope,
              controller: 'editCisCtrl',
              size: 'lg'
        });
    };

    // HttpResource.model('/api/systems/cisverification').customGet('',{},function(data){
    // 		console.log(data);
    // });
});