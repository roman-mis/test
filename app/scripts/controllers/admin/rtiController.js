'use strict';

angular.module('origApp.controllers')
.controller('RtiController', function($scope, $rootScope, $timeout,HttpResource,allUsers){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/rti', text: 'RTI Submissions'}
    ];
    $scope.$parent.tab = 'rti';


    $scope.delete = function () {
        $scope.user = {};
    };
    
    // HttpResource.model('/api/systems/rti').customGet('',{},function(data){
    // 		console.log('rti');
    // 		console.log(data);
    // });


  

	// var searchTimerPromise = null;
	// $scope.onDelaySearch = function() {
 //    $timeout.cancel(searchTimerPromise);
 //    searchTimerPromise = $timeout(function() {
 //      // $scope.loadCandidates();
 //    }, 1000);
 //  };

 //   $scope.loadCandidates = function() {
 //   	var params = {};
 //   	for(var key in $scope.user){
	// 		if ($scope.user[key]) {
	//       params[key+'_contains'] = $scope.user[key];
	//     }  
	// 	}
 //    console.log(params);
 //    HttpResource.model('candidates').query(params, function(data) {
 //      console.log(data.data.objects);
 //    });
 //  };

     
});