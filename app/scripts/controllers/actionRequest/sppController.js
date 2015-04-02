'use strict';
angular.module('origApp.controllers')


.controller('sppController', function($scope, parentScope, HttpResource, ConstantsResource, $http, $modalInstance,MsgService) {

    $scope.candidateId = parentScope.candidateId;
    $scope.spp = {};
 //   $scope.spp.startDate=null;

    HttpResource.model('constants/relationships').customGet('', {}, function(data) {
        $scope.relationships = data.data;
        console.log('getting relationships:' + $scope.relationships);
    }, function(err) {});

    HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
    }, function(err) {});
    $scope.spp.maxPeriods = 2;
    $scope.remove = function(i) {

        $scope.spp.days.splice(i, 1);

    };
     $scope.cancel=function(i,v){

        $scope.spp.days[i].amount=v;
    };

    $scope.checkDateMp = function() {

        if ($scope.spp.babyDueDate) {
            $scope.validDate = true;
            $scope.errorMsg = null;
            HttpResource.model('actionrequests/' + $scope.candidateId + '/spp').customGet('verify', $scope.spp, function(data) {
                console.log(data);
                $scope.spp.days = data.data.objects;


            }, function(err) {});
        } else {

            $scope.validDate = false;
            if ($scope.sppForm.due.$error.required) {

                $scope.submitted = true;
            }

        }

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
                $scope.spp.imageUrl = response.data.url;
                $scope.isLogoUploading = false;
            });


        });
    };
    $scope.submitInformation = function(val) {

        if (val === true && $scope.validDate === true && $scope.spp.days.length > 0) {
            $scope.submitted=false;
            HttpResource.model('actionrequests/' + $scope.candidateId + '/spp').create($scope.spp).post().then(function(response) {
                $scope.spp = {};
                $scope.temp = {};
                MsgService.success('Successfully submitted.');
            },function (error) {
                    MsgService.danger(error);
                });
        } else {

            $scope.submitted = true;
            if ($scope.spp && $scope.spp.days && $scope.spp.days.length === 0) {

                $scope.validDate = false;
                $scope.errorMsg = 'No data.';
            }
        }

    };
    $scope.closeModal = function() {

        $modalInstance.dismiss('cancel');
    };
});
