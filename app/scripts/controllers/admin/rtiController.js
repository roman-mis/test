'use strict';

angular.module('origApp.controllers')
.controller('RtiController', function($scope, $rootScope, $timeout,HttpResource,allUsers,ModalService){
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

     HttpResource.model('systems/rti').query({},function (res) {
         $scope.rti = res.data.object;
         $scope.$watch('rti', function () {
          if($scope.rti.enableRti === true){
            $scope.enableRtiValue = 'Yes';
            console.log($scope.enableRtiValue);
          }else if($scope.rti.enableRti === false){
            $scope.enableRtiValue = 'No';
          }

          if($scope.rti.eligibleSmallEmployerAllowance === true){
            $scope.eligibleSmallEmployerAllowanceValue = 'Yes';
          }else if($scope.rti.eligibleSmallEmployerAllowance === false){
            $scope.eligibleSmallEmployerAllowanceValue = 'No';
          }

          if($scope.rti.claimEmploymentAllowance === true){
            $scope.claimEmploymentAllowanceValue = 'Yes';
          }else if($scope.rti.claimEmploymentAllowance === false){
            $scope.claimEmploymentAllowanceValue = 'No';
          }

         });
         
          
     });
     $scope.openEditRti = function() {
            ModalService.open({
              templateUrl: 'views/admin/hmrc/partials/editRtiSubmission.html',
              parentScope: $scope,
              controller: 'editRtiSubmissionCtrl',
              size: 'lg'
            });
          };
});