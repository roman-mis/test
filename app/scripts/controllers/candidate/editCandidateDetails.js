'use strict';
angular.module('origApp.controllers')
		.controller('editContactDetailsCtrl', ['$scope', '$modalInstance', '$stateParams', 'HttpResource','parentScope','ConstantsResource','$http',
			function($scope,$modalInstance,$stateParams, HttpResource, parentScope, $http){
				$scope.candidateId = $stateParams.candidateId;
				$scope.candidate = parentScope.candidate;
				
				
				console.log($scope.candidate);
				HttpResource.model('candidates/' + $scope.candidateId+'/contactdetail').query({},function (res) {
					console.log(res);
				});

        HttpResource.model('constants/candidateTitle').query({},function (res) {
          console.log(res.data);
          $scope.titles = res.data;
          console.log($scope.candidate.title)
        });
				
				$scope.status = parentScope.candidate.status;
				$scope.lettersOnly = /^[A-Za-z]+$/;
				$scope.ukMobile = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
        $scope.ukPhone = /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
        $scope.emailPattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
				console.log(parentScope.candidate.status);


				HttpResource.model('constants/nationalities').query({},function (res) {
					// body...
					$scope.nationalities = res.data;
          console.log($scope.nationalities);
				});
				
				



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
                $scope.save = function () {
                  HttpResource.model('users/'+$scope.candidateId).create($scope.candidate)
                  .patch($scope.candidateId).then(function (res) {
                    console.log(res);
                  });
                };
                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };
						});
					}
				});
		}]);