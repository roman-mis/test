'use strict';
angular.module('origApp.controllers')


.controller('sspController', function($scope, parentScope, HttpResource, $http, $modalInstance,MsgService) {



    $scope.candidateId = parentScope.candidateId;
    $scope.candidate = parentScope.candidate;

    $scope.ssp = {};


    HttpResource.model('candidates/' + $scope.candidateId + '/contactdetail').customGet('', {}, function(data) {
        $scope.contactdetail = data.data.object;
        console.log($scope.contactdetail)
    }, function(err) {})
    $scope.submitInformation = function(val) {
        if (val === true && $scope.validDate === true && $scope.ssp.days.length >0) {
                $scope.submitted=false;
                HttpResource.model('actionrequests/' + $scope.candidateId+'/ssp').create($scope.ssp).post().then(function(response) {
                  $scope.ssp={};
                  $scope.temp={};
                  MsgService.success('Successfully submitted.');

                },function (error) {
                    MsgService.danger(error);
                });
        } else {

            $scope.submitted = true;

            if($scope.ssp && $scope.ssp.days && $scope.ssp.days.length===0){
              $scope.validDate = false;

              $scope.sspMessage='No  Statutory data';
            }
        }
    };
    $scope.changeAmount=function(i){

        i=false;
    };
    $scope.remove=function(i){

        $scope.ssp.days.splice(i,1);

    };
    $scope.cancel=function(i,v){

        $scope.ssp.days[i].amount=v;
    };
    $scope.checkDate = function() {

        var n = new Date($scope.ssp.dateInformed).valueOf();

        var sickDayFrom = new Date($scope.ssp.startDate).valueOf();
        var sickDayTo = new Date($scope.ssp.endDate).valueOf();

        var validTill = sickDayTo + 604800000;


        if (n >= sickDayTo && n <= validTill && (sickDayTo - sickDayFrom >= 345600000)) {
            console.log($scope.candidateId);

            $scope.validDate = true;
            $scope.sspMessage=null;
            HttpResource.model('actionrequests/' + $scope.candidateId + '/ssp').customGet('verify', {'dateInformed':$scope.ssp.dateInformed,'startDate':$scope.ssp.startDate,'endDate':$scope.ssp.endDate,'maxPeriods':29}, function(data) {

                $scope.ssp.days=data.data.objects;

            }, function(err) {})


        } else {
            $scope.validDate = false;

            if(n<sickDayTo){

                $scope.sspMessage="Informed date is less than ssp start date";
            }
            if(n>validTill){

                $scope.sspMessage="He/she hasnot informed within 7 days from Date of sick note to.";
            }
            if((sickDayTo-sickDayFrom) < 345600000){

                $scope.sspMessage="Date of sick note from and Date of sick note to should be greater than or equal to 4 days.";
            }
            if($scope.sick.inform.$error.required && $scope.sick.start.$error.required && $scope.sick.end.$error.required){

                $scope.submitted=true;
            }


        }
    };
    $scope.closeModal = function() {

        $modalInstance.dismiss('cancel');
    };
    $scope.$watch('fileupload', function(fileInfo) {

        if (fileInfo) {

            var fileSize = (fileInfo.size / 1024);
            var picReader = new FileReader();
            picReader.readAsDataURL(fileInfo);

            picReader.addEventListener("load", function(event) {
                $scope.temp.dataUrl = event.target.result;
                $scope.$digest();
            });

            $scope.temp = {
                logoFileName: fileInfo.name,
                logoSize: fileSize
            };

        }

    });
    $scope.uploadCompanyLogo = function() {



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
        }, function(response) {
          //  console.log(response);
            $scope.signedUrl = response.data.signedRequest;
            $http({
                method: 'PUT',
                url: $scope.signedUrl,
                data: file,
                headers: {
                    'Content-Type': mimeType,
                    'x-amz-acl': 'public-read'
                }
            }).success(function(l) {

            //    console.log(response);
                $scope.ssp.imageUrl=response.data.url;
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
