angular.module('origApp.controllers')
.controller('CandidateSidebarAddTimesheetController', function($scope, $modalInstance,$parse, parentScope, HttpResource) {


	
	//$scope.name = $scope.candidate.firstName;
	$scope.candidate = parentScope.candidate;
	// HttpResource.model('agencies').query({}).then(function (response) {
	// 		$scope.agencies = response;
	// 		console.log($scope.agencies)
	// 		// body...
	// });

	 // $scope.agencies = HttpResource.model('agencies').query({});
	 $scope.payrollProducts = HttpResource.model('candidates/' + $scope.candidate._id + '/payrollproduct').query({});

	 $scope.rates = [

	 {type: 'Hourly', description:'Standard Hourly Rate',hours:1},
	 {type: 'Day', description:'Standard Day Rate', hours:7.5},
	 {type: 'Day', description:'Education Day Rate',hours:6},
	 {type: 'Expenses', description:'Billable Expenses',hours:0},
	 {type: 'Holiday', description:'Holiday Pay',hours:0},
	 {type: 'Other', description:'Bonus', hours:0}
	 ]
	 
	 $scope.elements = { unit:null	, payRate:null, chargeRate: null, amount:null, vat:null };
	 $scope.$watch('$scope.elements.payRate', function(newVal,oldVal,scope) {
       // console.log('hey, payRate has changed!',$scope.elements.payRate);
       if(newVal !=oldVal){
       	var parseFun = $parse(newVal);
       	$scope.parsedValue = parseFun(scope)
       }
   });
	 $scope.$watch('$scope.elements.unit', function(newVal,oldVal,scope) {
       // console.log('hey, payRate has changed!',$scope.elements.payRate);
       if(newVal !=oldVal){
       	var parseFun = $parse(newVal);
       	$scope.parsedValue = parseFun(scope)
       }
   });	 


	 	$scope.elements.amount = $scope.elements.unit * $scope.elements.payRate;
	 $scope.cancel = function() {

	 	$modalInstance.dismiss('cancel');
	 };
	 $scope.ok = function() {

	 	$modalInstance.close();
	 };

	 $scope.logMe = function () {
		// body...
		// console.log($scope.payrollProducts)
		console.log($scope.elements.unit);
		console.log($scope.elements.payRate);
		console.log($scope.elements.amount);
	}
});