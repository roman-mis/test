'use strict';
angular.module('origApp.controllers')
		.controller('editContactDetailsCtrl', ['$scope', '$modalInstance', '$stateParams', 'HttpResource','parentScope','ConstantsResource',
			function($scope,$modalInstance,$stateParams, HttpResource, parentScope){
				$scope.candidateId = $stateParams.candidateId;
				$scope.candidate = parentScope.candidate;
				
				
				console.log($scope.candidate);
				HttpResource.model('candidates/' + $scope.candidateId+'/contactdetail').query({},function (res) {
					console.log(res);
				});
				
				$scope.status = parentScope.candidate.status;
				$scope.lettersOnly = /^[A-Za-z]+$/;
				$scope.ukMobile = /^0(\d ?){10}$/;
				console.log(parentScope.candidate.status);


				HttpResource.model('constants/nationalities').query({},function (res) {
					// body...
					$scope.nationalities = res.data;
				});
				console.log($scope.nationalities);
				



				$scope.calcAge = function (dateString) {
					var birthday = +new Date(dateString);
					return ~~((Date.now() - birthday) / (31557600000));
				};


				$scope.$watch('form.age',function () {
					if($scope.form.age){

						$scope.$watch('candidate.birthDate', function (newVal) {
							$scope.candidate.birthDate = newVal;
							console.log($scope.candidate.birthDate);
							$scope.age=$scope.calcAge($scope.candidate.birthDate);
							console.log($scope.age);

							
								// $scope.form.age = newVal;
								if($scope.age<16 && $scope.status ==='Live'){
									$scope.isValid = false;
									console.log($scope.isValid);
									$scope.form.age.$setValidity('age',$scope.isValid);
								}else{
									$scope.isValid = true;
									console.log($scope.isValid);
									$scope.form.age.$setValidity('age',$scope.isValid);
								}
							

						});
					}
				});
				
				
				//console.log($scope.age);
				$scope.$watch('candidate.birthDate', function () {
					
				});
				
				//
				$scope.log = function () {
					// boy...
					console.log($scope.form);
					console.log($scope.form.age.$error);
					console.log($scope.nationalities);
				};
		}]);