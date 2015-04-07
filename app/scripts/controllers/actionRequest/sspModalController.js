'use strict';
angular.module('origApp.controllers')
    .controller('sspModalController', function ($scope, parentScope, HttpResource, $http, MsgService, $modalInstance) {

        $scope.candidateId = parentScope.candidateId;
        $scope.candidate = parentScope.candidate;
        $scope.showMe = parentScope.showMe;

        function getCandidateContactDetails() {
            HttpResource.model('candidates/' + $scope.candidateId + '/contactdetail').customGet('', {}, function(data) {
                $scope.contactdetail = data.data.object;
            }, function (err) {
                console.log(err);
            });
        }

        getCandidateContactDetails();


        $scope.submitInformation = function (val) {
            if (val === true && $scope.validDate === true && $scope.ssp.days.length > 0) {
                $scope.submitted = false;
                HttpResource.model('actionrequests/' + $scope.candidateId + '/ssp').
                    create($scope.ssp).post().then(function (response) {
                        $scope.ssp = {};
                        $scope.temp = {};
                        MsgService.success('Successfully submitted.');
                    }, function (error) {
                        MsgService.danger(error);
                    });
            } else {

                $scope.submitted = true;

                if ($scope.ssp && $scope.ssp.days && $scope.ssp.days.length === 0 ) {
                    $scope.validDate = false;
                    $scope.sspMessage = 'No  Statutory data';
                }
            }
        };

        $scope.cancel = function (i, v) {
            $scope.ssp.days[i].amount = v;
        };

        $scope.remove = function (i) {
            $scope.ssp.days.splice(i, 1);
        };

        $scope.changeAmount = function (i) {
            i = false;
        };

        $scope.checkDate = function () {

            var n = new Date($scope.ssp.dateInformed).valueOf();

            var sickDayFrom = new Date($scope.ssp.startDate).valueOf();
            var sickDayTo = new Date($scope.ssp.endDate).valueOf();

            var validTill = sickDayTo + 604800000;


            if (n >= sickDayTo && n <= validTill && (sickDayTo - sickDayFrom >= 345600000)) {
                console.log($scope.candidateId);

                $scope.validDate = true;
                $scope.sspMessage = null;
                HttpResource.model('actionrequests/' + $scope.candidateId + '/ssp').customGet('verify', {'dateInformed':$scope.ssp.dateInformed,'startDate':$scope.ssp.startDate,'endDate':$scope.ssp.endDate,'maxPeriods':29}, function(data) {

                    $scope.ssp.days = data.data.objects;

                }, function (err) {
                    console.log(err);
                });


            } else {
                $scope.validDate = false;

                if (n < sickDayTo) {
                    $scope.sspMessage = 'Informed date is less than ssp start date';
                } else if (n > validTill) {
                    $scope.sspMessage = 'He/she hasnot informed within 7 days from Date of sick note to.';
                } else if ((sickDayTo - sickDayFrom) < 345600000) {
                    $scope.sspMessage = 'Date of sick note from and Date of sick note to should be greater than or equal to 4 days.';
                } else if ($scope.sick.inform.$error.required && $scope.sick.start.$error.required && $scope.sick.end.$error.required) {
                    $scope.submitted = true;
                }
            }
        };

        $scope.$watch('fileupload', function (fileInfo) {

            if (fileInfo) {

                var fileSize = (fileInfo.size / 1024);
                var picReader = new FileReader();
                picReader.readAsDataURL(fileInfo);

                picReader.addEventListener('load', function (event) {
                    $scope.temp.dataUrl = event.target.result;
                    $scope.$digest();
                });

                $scope.temp = {
                    logoFileName: fileInfo.name,
                    logoSize: fileSize
                };

            }

        });

        $scope.upload = function () {
            if (!$scope.fileupload) {
                alert('Please select a file first.');
                return;
            }
            var file = $scope.fileupload;
            var fileName = new Date().getTime().toString() + '_' + file.name;
            var mimeType = file.type || 'text/plain';

            $scope.isLogoUploading = true;
            HttpResource.model('documents/actionrequest').customGet('signedUrl', {
                mimeType: mimeType,
                fileName: fileName
            }, function (response) {
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
                }).success(function (l) {

                    //    console.log(response);
                    $scope.ssp.imageUrl = response.data.url;
                    $scope.isLogoUploading = false;
                });


            });
        };

        $scope.save = function () {
            HttpResource.model('actionrequests').create('')
                .patch($scope.ssp.id).then(function () {
                    MsgService.success('Successfully saved.');
                    $scope.closeModal();
                });
        };
        $scope.saveAndApprove = function () {
            HttpResource.model('actionrequests/' + $scope.ssp.id + '').create('')
                .patch('approve').then(function () {
                    MsgService.success('Successfully saved and approved.');
                    $scope.closeModal();
                });
        };
        $scope.saveAndReject = function () {
            HttpResource.model('actionrequests/' + $scope.ssp.id + '').create('')
                .patch('reject').then(function () {
                    MsgService.success('Successfully saved and approved.');
                    $scope.closeModal();
                });
        };
        $scope.saveAndRefer = function () {
            HttpResource.model('actionrequests/' + $scope.ssp.id + '').create('')
                .patch('refer').then(function () {
                    MsgService.success('Successfully saved and approved.');
                    $scope.closeModal();
                });
        };

        $scope.closeModal = function () {
            $modalInstance.close();
        };

    });
