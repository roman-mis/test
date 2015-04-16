'use strict';
angular.module('origApp.controllers')
    .controller('sspModalController', function($scope, parentScope, HttpResource, $http, MsgService, $modalInstance,ModalService) {

        $scope.candidateId = parentScope.candidateId;
        $scope.candidate = parentScope.candidate;
        $scope.showMe = parentScope.showMe;
        if (!$scope.ssp) {

            $scope.ssp = {};
        };
        $scope.validDate = true;

        function getCandidateContactDetails() {
            HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
                $scope.candidateInfo = data.data.object;
            }, function(err) {});
        }

        getCandidateContactDetails();


        $scope.submitInformation = function(val) {
            if (val === true && $scope.validDate === true && $scope.ssp.days.length > 0) {
                $scope.submitted = false;
                HttpResource.model('actionrequests/' + $scope.candidateId + '/ssp').
                create($scope.ssp).post().then(function(response) {
                    $scope.ssp = {};
                    $scope.temp = {};
                    MsgService.success('Successfully submitted.');
                    $scope.closeModal();
                }, function(error) {
                    MsgService.danger(error);
                });
            } else {

                $scope.submitted = true;

                if ($scope.ssp && $scope.ssp.days && $scope.ssp.days.length === 0) {
                    $scope.validDate = false;
                    $scope.sspMessage = 'No  Statutory data';
                }
            }
        };

        $scope.cancel = function(i, v) {
            $scope.ssp.days[i].amount = v;
        };

        $scope.remove = function(i) {
            $scope.ssp.days.splice(i, 1);
        };

        $scope.changeAmount = function(i) {
            i = false;
        };

        $scope.checkDate = function() {

            $scope.sspMessage=null;
            if (!$scope.ssp) {
                $scope.ssp = {};
            }
            var n = new Date($scope.ssp.dateInformed).valueOf();

            var sickDayFrom = new Date($scope.ssp.startDate).valueOf();
            var sickDayTo = new Date($scope.ssp.endDate).valueOf();

            var validTill = sickDayTo + 604800000;


            if (n >= sickDayTo && n <= validTill && (sickDayTo - sickDayFrom >= 345600000)) {

                $scope.validDate = true;
                $scope.sspMessage = null;

                if(arguments.length){
                    HttpResource.model('actionrequests/' + $scope.candidateId + '/ssp').customGet('verify', {
                        'dateInformed': $scope.ssp.dateInformed,
                        'startDate': $scope.ssp.startDate,
                        'endDate': $scope.ssp.endDate,
                        'maxPeriods': 29
                    }, function(data) {

                        $scope.ssp.days = data.data.objects;

                    }, function(err) {
                    });
                }
                return true;


            } else {
                $scope.validDate = false;
                if(arguments.length){

                 $scope.ssp.days=[];

                }

                if (n < sickDayTo) {
                    $scope.sspMessage = 'Informed date is before the SSP start date.';
                }
                else if(sickDayFrom > sickDayTo){

                   $scope.sspMessage = '"Sick date to" is before the "sick day from".';
                }
                 else if (n > validTill) {
                    $scope.sspMessage = 'He/she hasnot informed within 7 days from Date of sick note to.';
                }
                 else if ((sickDayTo - sickDayFrom) < 345600000) {
                    $scope.sspMessage = '"Sick date from" and "Date of sick to" should be greater or equal to 4 days.';
                } else if ($scope.sick.inform.$error.required || $scope.sick.start.$error.required || $scope.sick.end.$error.required) {
                    $scope.submitted = true;
                }
                return false;
            }
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

        $scope.upload = function() {
            if (!$scope.fileupload) {
                MsgService.danger('Please select a file first.');
                return;
            }
            var file = $scope.fileupload;
            var fileName = new Date().getTime().toString() + '_' + file.name;
            var mimeType = file.type || 'text/plain';

            $scope.isLogoUploading = true;
            HttpResource.model('documents/actionrequest').customGet('signedUrl', {
                mimeType: mimeType,
                fileName: fileName
            }, function(response) {
                //  console.log(response);
                $scope.signedUrl = response.data.signedRequest;
                console.log($scope.signedUrl);
                $http({
                    method: 'PUT',
                    url: $scope.signedUrl,
                    data: file,
                    headers: {
                        'Content-Type': mimeType,
                        'x-amz-acl': 'public-read'
                    }
                }).success(function(l) {

                    $scope.ssp.imageUrl = $scope.temp.logoFileName;
                    $scope.isLogoUploading = false;
                });


            });
        };
        $scope.viewDocument=function(name){

           ModalService.open({
                templateUrl: 'views/candidate/document_view.html',
                parentScope: $scope,
                controller: function($scope, $modalInstance) {

                  $scope.fileURL = 'documents/actionrequest/'+name+'';
                   HttpResource.model($scope.fileURL).customGet('', {}, function(data) {
                    console.log(data);

                    }, function(err) {});


                  $scope.close = function() {
                    $modalInstance.dismiss('cancel');
                  };
                },
                size: 'lg'
              });

        };

        $scope.save = function(actionName) {
            var validate=$scope.checkDate();
            if(validate===true){

                var data = {
                dateInformed: $scope.ssp.dateInformed,
                startDate: $scope.ssp.startDate,
                endDate: $scope.ssp.endDate,
                days: $scope.ssp.days,
                imageUrl:$scope.ssp.imageUrl
            };

            var param, successMsg;

            switch (actionName) {
                case 'saveAndApprove':
                    param = 'approve';
                    successMsg = 'Sick Pay has been Approved.';
                    break;
                case 'saveAndReject':
                    param = 'reject';
                    successMsg = 'Sick Pay has been Rejected.';
                    break;
                case 'saveAndRefer':
                    param = 'refer';
                    successMsg = 'Sick Pay has been Referred.';
                    break;
            }

            if ('save' === actionName) {
                HttpResource.model('actionrequests').create(data).
                patch($scope.ssp.id).then(function() {
                    MsgService.success('Successfully saved.');
                    $scope.closeModal();
                });
            } else {
                HttpResource.model('actionrequests/' + $scope.ssp.id).create(data)
                    .patch(param).then(function() {
                        MsgService.success(successMsg);
                        $modalInstance.close();
                    }, function(err) {
                        MsgService.danger(err);
                    });
            }


            }


        };

        $scope.closeModal = function() {
            $modalInstance.dismiss('close');
        };

    });
