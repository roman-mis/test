'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarCreateDocumentController', function($scope, ModalService, $modalInstance, parentScope, HttpResource, ConstantsResource, params, MsgService, $http) {

          function resetUploadData() {
            $scope.data = {};
            if (params.agency) {
              $scope.data.agency = params.agency;
            }
          }

          resetUploadData();

          $scope.files = [];

          $scope.candidate = parentScope.candidate;
          $scope.agencies = HttpResource.model('agencies').query({}, function() {
            $scope.agenciesHash = ConstantsResource.makeHashData('_id', $scope.agencies);
          });

          //load constants
          $scope.documentTypes = ConstantsResource.get('documenttypes');

          $scope.onSelectFile = function(fileInput) {
            $scope.$apply(function() {
              $scope.data.document_path = fileInput.value;
            });
          };

          $scope.viewFile = function(fileName, $event) {
            HttpResource.model('documents').customGet('sign_temp_viewdoc_s3', {
              file_name: fileName
            }, function(response) {
              ModalService.open({
                templateUrl: 'views/candidate/_documentview.html',
                parentScope: $scope,
                controller: function($scope) {
                  $scope.fileName = fileName;
                  $scope.fileURL = response.data.signed_request;
                  setTimeout(function() {
                    window.open($scope.fileURL, 'docview_frame');
                  }, 100);
                },
                size: 'lg'
              });
            });
          };

          $scope.deleteFile = function(fileName) {
            HttpResource.model('documents/delete')
                    .delete(fileName)
                    .then(function(response) {
                      if (response.data.result) {
                        $scope.files.forEach(function(file, index) {
                          if (file.generated_name === fileName) {
                            $scope.files.splice(index, 1);
                          }
                        });
                      } else {
                        MsgService.danger('Could not delete file.');
                        console.log(response);
                      }
                    });
          };

          //upload file to s3
          $scope.uploadFile = function() {
            var file = $('#upload_file')[0].files[0];
            var fileName = new Date().getTime().toString() + '_' + file.name;
            var mimeType = file.type || 'text/plain';
            $scope.isUploading = true;
            HttpResource.model('documents').customGet('sign_temp_s3', {
              mime_type: mimeType,
              file_name: fileName
            }, function(response) {
              var signedRequest = response.data.signed_request;
              $http({
                method: 'PUT',
                url: signedRequest,
                data: file,
                headers: {'Content-Type': mimeType, 'x-amz-acl': 'public-read'}
              }).success(function(data) {
                //get view url of file
                $scope.isUploading = false;
                $scope.data.generated_name = fileName;
                $scope.data.mime_type = mimeType;
                $scope.data.created_date = moment().toString();
                var newFile = {};
                angular.copy($scope.data, newFile);
                $scope.files.push(newFile);
                resetUploadData();

                $scope.uploadDocumentForm.agency.$setPristine();
                $scope.uploadDocumentForm.document_name.$setPristine();
                $scope.uploadDocumentForm.document_path.$setPristine();
                $scope.uploadDocumentForm.document_type.$setPristine();

              });
            });
          };

          $scope.getConstantDescription = function(constantKey, code) {
            var hashData = constantKey === 'agencies' ? $scope.agenciesHash : ConstantsResource.getHashData(constantKey);
            if (code && hashData && hashData[code]) {
              if (constantKey === 'agencies') {
                return hashData[code].name || '';
              }
              return hashData[code].description || '';
            }
            return '';
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };


          $scope.save = function() {
            $scope.isSaving = true;
            HttpResource.model('candidates/' + $scope.candidate._id + '/document').create({documents: $scope.files}).post()
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        $modalInstance.close();
                        MsgService.success('Uploaded documents have been saved successfully.');
                      }
                    });
          };
        });

