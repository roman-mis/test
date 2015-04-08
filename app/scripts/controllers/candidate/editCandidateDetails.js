'use strict';
angular.module('origApp.controllers')
    .controller('editContactDetailsCtrl', ['$scope', '$modalInstance', '$stateParams', 'HttpResource','parentScope','ConstantsResource','Notification',
        function($scope,$modalInstance,$stateParams, HttpResource, parentScope,ConstantsResource,Notification){
            $scope.candidateId = $stateParams.candidateId;
            $scope.candidate = {};
            $scope.candidate = angular.copy(parentScope.candidate);
            $scope.genders = [{ key: 'M', value: 'Male' }, { key: 'F', value: 'Female' }];

            
            HttpResource.model('candidates/' + $scope.candidateId+'/contactdetail').query({},function (res) {
                console.log(res);
            });

            HttpResource.model('constants/candidateTitle').query({},function (res) {
                
                $scope.titles = res.data;
                
            });

            $scope.status = parentScope.candidate.status;
            $scope.lettersOnly = /^[A-Za-z]+$/;
            


            HttpResource.model('constants/nationalities').query({},function (res) {
                // body...
                $scope.nationalities = res.data;
                
            });




            $scope.nameError = function () {
                
              Notification.error({message:'First Name is required',delay:2000});
              return;
            };
            $scope.calcAge = function (dateString) {
                var birthday = +new Date(dateString);
                return ~~((Date.now() - birthday) / (31557600000));
            };


            $scope.$watch('form.age',function () {
                if($scope.form.age){

                    $scope.$watch('candidate.birthDate', function (newVal) {
                        $scope.candidate.birthDate = newVal;
                        
                        $scope.age=$scope.calcAge($scope.candidate.birthDate);
                        


                        // $scope.form.age = newVal;
                        if($scope.age<16 && $scope.status ==='Live'){
                            $scope.isValid = false;
                            
                            $scope.form.age.$setValidity('age',$scope.isValid);
                        }else{
                            $scope.isValid = true;
                            
                            $scope.form.age.$setValidity('age',$scope.isValid);
                        }
                        
                    });
                }
            });
            $scope.saveCandidate = function () {
                
                HttpResource.model('users').create($scope.candidate)
                .patch($scope.candidateId).then(function () {
                    parentScope.candidate = angular.copy($scope.candidate);
                    
                });
                HttpResource.model('candidates').create($scope.candidate)
                .patch($scope.candidateId+'/contactdetail');

                $modalInstance.dismiss('save');
            };
            $scope.cancelCandidate = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);