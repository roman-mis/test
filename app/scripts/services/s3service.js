'use strict';

/**
 * @ngdoc service
 * @name origApp.s3Service
 * @description
 * # s3Service
 * Factory in the origApp.
 */
angular.module('origApp.services')
        .factory('s3Service', function(HttpResource, $q, $http) {
          var config = {/* Dummy object you should pass to upload file to S3*/
            fileName: null,
            file: null
          };
          var signRequest = function(file) {
            var defer = $q.defer();
            HttpResource.model('public').customGet('sign_s3', {
              s3ObjectType: file.type || "text/plain",
              s3ObjectName: config.fileName
            }, function(response) {
              defer.resolve(response.data);
            });
            return defer.promise;
          };

          var uploadToBucket = function(file, url, publicUrl) {
            var defer = $q.defer();
            var obj = {
              method: 'PUT',
              url: url,
              data: file,
              headers: {'Content-Type': file.type || "text/plain", 'x-amz-acl': 'public-read'}
            };
            $http(obj).success(function(data) {
              defer.resolve(data);
            });
            return defer.promise;
          };

          return {
            upload: function(settings) {

              config = settings;
              var defer = $q.defer();

              signRequest(config.file).then(function(data) {
                uploadToBucket(config.file, data.signedRequest, data.url).then(function(responseData) {
                  defer.resolve(data);
                });
              });
              return defer.promise;
            }
          }
        });