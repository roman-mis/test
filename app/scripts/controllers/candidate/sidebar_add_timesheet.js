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
	 
	 $scope.elements = { unit:0	, payRate:0, chargeRate: null, amount:0, vat:0 };

	 $scope.$watch('elements.payRate',function (newVal) {
	 	// body...
	 	// console.log($scope.amount);
	 	$scope.elements.amount = newVal * $scope.elements.unit;
	 	$scope.elements.vat = $scope.elements.amount *20;

	 });	
	 $scope.$watch('elements.unit',function (newVal) {
	 	// body...
	 	// console.log($scope.amount);
	 	$scope.elements.amount = $scope.elements.payRate * newVal;
	 	$scope.elements.vat = $scope.elements.amount *20;

	 });

	 // $scope.$watch('$scope.elements.unit', function(newVal,oldVal,scope) {
  //      // console.log('hey, payRate has changed!',$scope.elements.payRate);
  //      if(newVal !=oldVal){
  //      	var parseFun = $parse(newVal);
  //      	$scope.parsedValue = parseFun(scope)
  //      }
  //  });	 
	 $scope.elements.vat = $scope.elements.amount*0.20;

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