'use strict';
angular.module('origApp.controllers')


.controller('sspController',function($scope,parentScope,HttpResource,$http){



          $scope.candidateId = parentScope.candidateId;
          $scope.ssp={};



          HttpResource.model('candidates/'+$scope.candidateId+'/contactdetail').customGet('',{},function(data){
              $scope.contactdetail=data.data.object;
            console.log($scope.contactdetail)
          },function(err){
          })
          $scope.submitInformation=function(val){
               if(val===true && $scope.validDate===true){

                     console.log('hey we r good to go');
               }else{

                $scope.submitted=true;
               }
          };
          $scope.checkDate=function(){

            var n=new Date($scope.ssp.inform).valueOf();

                var sickDayFrom=new Date($scope.ssp.sickDateFrom).valueOf();
                var sickDayTo=new Date($scope.ssp.sickDateTo).valueOf();

                var validTill=sickDayTo+604800000;


                if(n >=sickDayTo && n<=validTill && (sickDayTo-sickDayFrom>=345600000)){

                  $scope.validDate=true;
                }else{

                  $scope.validDate=false;
                }
          };
          $scope.$watch('fileupload', function (fileInfo) {

            if (fileInfo) {

                var fileSize =  (fileInfo.size / 1024);
                var picReader = new FileReader();
                picReader.readAsDataURL(fileInfo);

                picReader.addEventListener("load", function (event) {
                    $scope.temp.dataUrl = event.target.result;
                    $scope.$digest();
                });

                $scope.temp = {
                    logoFileName : fileInfo.name,
                    logoSize : fileSize
                };
                console.log($scope.temp);
            }

        });
          $scope.uploadCompanyLogo = function () {



            if (!$('#upload_company_logo').val()) {
                alert('Please select a file first.');
                return;
            }
            var file = $scope.fileupload;
            var fileName = new Date().getTime().toString() + '_' + file.name;
            console.log(fileName);
            var mimeType = file.type || 'text/plain';
            $scope.isLogoUploading = true;
            HttpResource.model('documents/actionrequest').customGet('signedUrl', {
                mimeType: mimeType,
                fileName: fileName
            }, function (response) {
                $scope.signedUrl = response.data.signedRequest;
                 $http({
                    method: 'PUT',
                    url:$scope.signedUrl,
                    data: file,
                    headers: { 'Content-Type': mimeType, 'x-amz-acl': 'public-read' }
                }).success(function () {


                  $scope.isLogoUploading = false;
                });


            });
        };
       /*   $scope.$watch('ssp.inform',function(newValue,oldValue){

                $scope.checkDate();

          });
          $scope.$watch('ssp.sickDateFrom',function(){

            $scope.checkDate();
          });
          $scope.$watch('ssp.sickDateTo',function(){
             $scope.checkDate();

          })   */


});
