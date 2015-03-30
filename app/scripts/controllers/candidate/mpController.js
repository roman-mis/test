'use strict';
angular.module('origApp.controllers')


.controller('mpController', function($scope, parentScope, HttpResource, $http, $modalInstance) {



    $scope.candidateId = parentScope.candidateId;
    $scope.mp = {};



    HttpResource.model('candidates/' + $scope.candidateId + '/contactdetail').customGet('', {}, function(data) {
        $scope.contactdetail = data.data.object;
        console.log($scope.contactdetail)
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
