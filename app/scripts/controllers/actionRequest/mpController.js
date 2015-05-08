'use strict';
angular.module('origApp.controllers')

.controller('mpController', function($scope, parentScope, HttpResource, $http, $modalInstance, MsgService) {
    $scope.candidateId = parentScope.candidateId;
    if (!$scope.mp) {
        $scope.mp = {};
    }

    $scope.mp.maxPeriods = 39;

    HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
        $scope.contactdetail = data.data.object;
    }, function(err) {
        console.log(err);
    });

    $scope.closeModal = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.$watch('fileupload', function(fileInfo) {
        if (fileInfo) {
            var fileSize = (fileInfo.size / 1024);
            var picReader = new FileReader();
            picReader.readAsDataURL(fileInfo);

            picReader.addEventListener('load', function(event) {
                $scope.temp.dataUrl = event.target.result;
                $scope.$digest();
            });

            $scope.temp = {
                logoFileName: fileInfo.name,
                logoSize: fileSize
            };
        }

    });

    $scope.closeModal = function() {
        $modalInstance.close('cancel');
    };
    $scope.cancel = function(i, v) {
        $scope.mp.periods[i].amount = v;
    };

    $scope.checkDateMp = function() {
        $scope.mp.periods=[];
        $scope.errorMsg=null;
        var n = new Date($scope.mp.startDate).valueOf();
        var d = new Date($scope.mp.babyDueDate).valueOf();


        if (n >= (d - 6652800000)) { // employee can take earliest leave is 11 weeks before the expected child birth due date.
            $scope.validDate = true;
            $scope.errorMsg = null;
            HttpResource.model('actionrequests/' + $scope.candidateId + '/smp').customGet('verify', $scope.mp, function(data) {
                $scope.mp.periods = data.data.objects;
            }, function() {});
        } else {
            $scope.validDate = false;
            if (n < (d - 6652800000)) {
                $scope.errorMsg = 'The difference between start date and baby due date should not be more than 11 weeks.';
            } else {
                if ($scope.mpForm.start.$error.required || $scope.mpForm.due.$error.required || $scope.mpForm.intend.$error.required) {
                    $scope.errorMsg = null;
                    $scope.submitted = true;
                } else {
                    $scope.errorMsg = 'Please fill all input boxes.';
                }
            }
        }
    };

    $scope.submitInformation = function(val) {
        if (val === true && $scope.validDate === true && $scope.mp.periods.length > 0) {
            $scope.mp.smp = {};
            $scope.mp.smp.babyDueDate = $scope.mp.babyDueDate;
            HttpResource.model('actionrequests/' + $scope.candidateId + '/smp').create($scope.mp).post().then(function() {
                $scope.mp = {};
                $scope.temp = {};
                MsgService.success('Successfully submitted.');
                $modalInstance.dismiss('cancel');
            }, function(error) {
                MsgService.danger(error);
            });
            $scope.submitted = true;

        } else {
            $scope.submitted = true;
            if ($scope.mp && $scope.mp.periods && $scope.mp.periods.length === 0) {
                $scope.validDate = false;
                $scope.errorMsg = 'No data.';
            }
        }
    };
    $scope.remove = function(i) {
        $scope.mp.periods.splice(i, 1);
    };
    $scope.viewFile = function(fileName) {
           $http.get('/api/documents/actionrequest/viewsignedurl/' + fileName).success(function (res) {

              $modal.open({
                templateUrl: 'views/actionRequest/viewFile.html',
                controller: 'actionRequestViewFile',
                size: 'md',
                resolve: {

                    url: function () {
                        return res;
                    },
                    fileName:function(){

                        return fileName;
                    }
                   }
                });

            }).error(function(){

                 MsgService.danger('Something went wrong.');
            });
          };

    $scope.uploadFile = function() {
        if (!$('#upload_file').val()) {
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
            }).success(function() {
                $scope.mp.imageUrl = fileName;
                $scope.isLogoUploading = false;
            });
        });
    };
});
