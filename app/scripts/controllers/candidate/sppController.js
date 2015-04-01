'use strict';
angular.module('origApp.controllers')


.controller('sppController', function($scope, parentScope, HttpResource,  ConstantsResource, $http, $modalInstance) {

    $scope.candidateId = parentScope.candidateId;
    $scope.spp = {};

<<<<<<< HEAD

     HttpResource.model('constants/relationships').customGet('', {}, function(data) {
        $scope.relationships = data.data;
        console.log('getting relationships:' +$scope.relationships);
    }, function(err) {});

     HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
    }, function(err) {});
=======
    $scope.spp.startDate=null;
    $scope.spp.maxPeriods=2;
    $scope.remove=function(i){

        $scope.spp.days.splice(i,1);

    };

    HttpResource.model('candidates/' + $scope.candidateId + '/contactdetail').customGet('', {}, function(data) {
        $scope.contactdetail = data.data.object;
        console.log($scope.contactdetail)
    }, function(err) {});
    $scope.checkDateMp=function(){

        HttpResource.model('actionrequests/' + $scope.candidateId + '/spp').customGet('verify', $scope.spp, function(data) {
                console.log(data);
                $scope.spp.days=data.data.objects;


            }, function(err) {})
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
                $scope.spp.imageUrl=response.data.url;
                $scope.isLogoUploading = false;
            });


        });
    };
    $scope.submitInformation=function(){
       HttpResource.model('actionrequests/' + $scope.candidateId+'/smp').create($scope.spp).post().then(function(response) {
                  $scope.spp={};
                  $scope.temp={};
                });

    };
      $scope.closeModal = function() {

        $modalInstance.dismiss('cancel');
    };
>>>>>>> d47b6b7f96b0af7e2b7351217840afe6800d4f3c
});
