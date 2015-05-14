'use strict';
angular.module('origApp.controllers')


.controller('sppController', function($scope, parentScope, HttpResource, ConstantsResource, $http, $modalInstance, MsgService) {

    console.log('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    $scope.candidateId = parentScope.candidateId;
    if (!$scope.sppObject) {
        $scope.sppObject = {}
        $scope.sppObject.spp = {};
    }
    //   $scope.spp.startDate=null;

    HttpResource.model('constants/relationships').customGet('', {}, function(data) {
        $scope.relationships = data.data;
    }, function(err) {});

    HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.candidateInfo = data.data.object;
    }, function(err) {});
    $scope.sppObject.maxPeriods = 2;
    $scope.remove = function(i) {

        $scope.sppObject.periods.splice(i, 1);

    };

    $scope.cancel = function(i, v) {

        $scope.sppObject.periods[i].amount = v;
    };
    $scope.cancelAmountFromSppModa

    $scope.checkDateMp = function() {

        if ($scope.sppObject.startDate) {
            $scope.validDate = true;
            $scope.errorMsg = null;
            console.log($scope.sppObject);
            HttpResource.model('actionrequests/' + $scope.candidateId + '/spp').customGet('verify', $scope.sppObject, function(data) {
                $scope.sppObject.periods = data.data.objects;
                console.log($scope.sppObject.periods)


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
        }

    });

    $scope.uploadCompanyLogo = function() {

        if (!$('#upload_company_logo').val()) {
            MsgService.danger('Please select a file first.');
            return;
        }
        var file = $scope.fileupload;
        var fileName = new Date().getTime().toString() + '_' + file.name;
        var mimeType = file.type;
        var fileType=mimeType.substr(0,mimeType.indexOf('/'));

        if(mimeType !='application/pdf' && fileType !='image'){

           MsgService.danger('You can only upload image and pdf file.');
           return;
        }

        $scope.isLogoUploading = true;
        HttpResource.model('documents/actionrequest').customGet('signedUrl', {
            mimeType: mimeType,
            fileName: fileName
        }, function(response) {
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


                $scope.sppObject.imageUrl = $scope.temp.logoFileName;
                $scope.isLogoUploading = false;
            });


        });
    };
    $scope.test = function(){
        console.log('fuck u')
    }
    $scope.submitInformation = function(val) {
        console.log('%%%%%%%%%%%%%%%%%')
        if (val === true && $scope.validDate === true && $scope.sppObject.periods.length > 0) {
            $scope.submitted = false;
            HttpResource.model('actionrequests/' + $scope.candidateId + '/spp').create($scope.sppObject).post().then(function(response) {

                $scope.sppObject.spp = {};
                $scope.sppObject.periods = {};
                $scope.temp = {};
                MsgService.success('Successfully submitted.');
                $modalInstance.close();
            }, function(error) {
                MsgService.danger(error);
            });
        } else {

            $scope.submitted = true;
            if ($scope.sppObject && $scope.sppObject.periods && $scope.sppObject.periods.length === 0) {

                $scope.validDate = false;
                $scope.errorMsg = 'No data.';
            }
        }

    };
    $scope.closeModal = function() {
       $modalInstance.dismiss('close');
    };

     $scope.save = function() {
            HttpResource.model('actionrequests').create($scope.sppObject)
                .patch($scope.sppObject.id).then(function() {
                    MsgService.success('Successfully saved.');
                    $modalInstance.close();
                });
        };
        $scope.saveAndApprove = function() {

            HttpResource.model('actionrequests/' + $scope.sppObject.id + '').create($scope.sppObject)
                .patch('approve').then(function() {
                    MsgService.success('Successfully saved and approved.');
                   $modalInstance.close();

                });

        };
        $scope.saveAndReject = function() {

            HttpResource.model('actionrequests/' + $scope.sppObject.id + '').create($scope.sppObject)
                .patch('reject').then(function() {
                    MsgService.success('Successfully saved and rejected.');
                   $modalInstance.close();

                });

        };
        $scope.saveAndRefer = function() {

            HttpResource.model('actionrequests/' + $scope.sppObject.id + '').create($scope.sppObject)
                .patch('refer').then(function() {
                    MsgService.success('Successfully saved and referred.');
                    $modalInstance.close();

                });

        };
});
