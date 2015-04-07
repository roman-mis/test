'use strict';
angular.module('origApp.controllers')
.controller('smpController',function($scope,parentScope,HttpResource,ModalService,MsgService,$modalInstance){
  $scope.candidateId =parentScope.candidateId;
  $scope.candidate = parentScope.candidate;
  HttpResource.model('candidates/' + $scope.candidateId).customGet('', {}, function(data) {
    $scope.contactdetail = data.data.object;
     //   $scope.fullname = ($scope.candidateInfo.firstName + ' ' + $scope.candidateInfo.lastName);
   }, function(err) {
    console.log(err);
  });

  $scope.cancel=function(i,v){

    $scope.smpObject.days[i].amount=v;
  };
  $scope.remove = function(i) {

    $scope.smpObject.days.splice(i, 1);

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
                $scope.smpObject.imageUrl = response.data.url;
                $scope.isLogoUploading = false;
              });


          });
  };
  $scope.save=function(){

    HttpResource.model('actionrequests').create('')
    .patch($scope.smpObject.id).then(function () {
      MsgService.success('Successfully saved.');

    });
  };
  $scope.saveAndApprove=function(){

    HttpResource.model('actionrequests/'+$scope.smpObject.id+'').create('')
    .patch('approve').then(function () {
      MsgService.success('Successfully saved and approved.');

    });

  };
  $scope.saveAndReject=function(){

    HttpResource.model('actionrequests/'+$scope.smpObject.id+'').create('')
    .patch('reject').then(function () {
      MsgService.success('Successfully saved and approved.');

    });

  };
  $scope.saveAndRefer=function(){

    HttpResource.model('actionrequests/'+$scope.smpObject.id+'').create('')
    .patch('refer').then(function () {
      MsgService.success('Successfully saved and approved.');

    });

  };
  $scope.closeModal = function() {

    $modalInstance.dismiss('cancel');
  };

});
