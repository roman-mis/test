'use strict';
angular.module('origApp.controllers')


.controller('mpController', function($scope, parentScope, HttpResource, $http, $modalInstance) {



    $scope.candidateId = parentScope.candidateId;
    $scope.mp = {};
    $scope.mp.maxPeriods=39;
    $scope.mp.days;



    HttpResource.model('candidates/' + $scope.candidateId + '/contactdetail').customGet('', {}, function(data) {
        $scope.contactdetail = data.data.object;
       // console.log($scope.contactdetail)
    }, function(err) {})


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
            console.log($scope.temp);
        }

    });
     $scope.closeModal = function() {

        $modalInstance.dismiss('cancel');
    };
    $scope.checkDateMp=function(){
             var n=new Date($scope.mp.startDate).valueOf();
             var d=new Date($scope.mp.babyDueDate).valueOf();
             var i=new Date($scope.mp.intendedStartDate).valueOf();

             if(n <=(d-9072000000)){


                $scope.validDate=true;
                HttpResource.model('actionrequests/' + $scope.candidateId + '/smp').customGet('verify', $scope.mp, function(data) {

                $scope.mp.days=data.data.objects;


            }, function(err) {})
             }else{

                $scope.validDate=false;
                if(n >(d-9072000000)){

                $scope.errorMsg='Start date should be 15 week before baby birth due.';
                }else{

                    $scope.errorMsg='Please fill all input boxes.';
                }



             }



    };
    $scope.submitInformation=function(val){
         if (val === true && $scope.validDate === true && $scope.mp.days.length >0) {
            HttpResource.model('actionrequests/' + $scope.candidateId+'/smp').create($scope.mp).post().then(function(response) {
                  $scope.mp={};
                  $scope.temp={};
                });
        }else{

            $scope.submitted=true;
            if($scope.mp && $scope.mp.days && $scope.mp.days.length===0){

                $scope.validDate=false;
                $scope.errorMsg='No days';
            }
        }


    };
    $scope.remove=function(i){

        $scope.mp.days.splice(i,1);

    };

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
                $scope.mp.imageUrl=response.data.url;
                $scope.isLogoUploading = false;
            });


        });
    };


});
