'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp9Controller', function($scope, HttpResource, ConstantsResource, MsgService, $http) {

          /*$scope.expenseData.claimDate = new Date("2015-02-06T08:45:07.378Z");
          $scope.expenseData.agency = {"_config": {"url": "/api/agencies/", "cache": false}, "_resolved": true, "_id": "54c8b81a24b51bd816adcd7d", "name": "ok", "postCode": "qwe"};
          $scope.expenseData.claimDateRange = [new Date("2015-02-05T16:00:00.000Z"), new Date("2015-02-07T16:00:00.000Z")];
          $scope.expenseData.daysInRange = [
            {"object": "all", "label": "All dates in selection"},
            {"object": new Date(new Date("2015-02-05T16:00:00.000Z")), "label": "Fri 06/02/2015"},
            {"object": new Date("2015-02-06T16:00:00.000Z"), "label": "Sat 07/02/2015"},
            {"object": new Date("2015-02-07T16:00:00.000Z"), "label": "Sun 08/02/2015"}
          ];
          $scope.expenseData.times = [
            {"date": new Date("2015-02-05T16:00:00.000Z"), "startTime": "09:00", "endTime": "17:00", "$$hashKey": "06M"},
            {"date": new Date("2015-02-07T16:00:00.000Z"), "startTime": "09:00", "endTime": "17:00", "$$hashKey": "06O"},
            {"date": new Date("2015-02-06T16:00:00.000Z"), "startTime": "09:40", "endTime": "18:10", "$$hashKey": "06S"}
          ];
          $scope.expenseData.postCodes = [
            {"date": new Date("2015-02-05T16:00:00.000Z"), "codes": ["ab1 1ab", "ab2 2ab"], "$$hashKey": "06W"},
            {"date": new Date("2015-02-06T16:00:00.000Z"), "codes": ["ac1 1ac"], "$$hashKey": "06Y"},
            {"date": new Date("2015-02-07T16:00:00.000Z"), "codes": ["ad2 2ad", "ad1 1ad"], "$$hashKey": "070"}
          ];
          $scope.expenseData.transports = [
            {"date": new Date("2015-02-05T16:00:00.000Z"), "type": {"code": "1", "description": "Car / Van", "default_ppm": "0.45"}, "cost": 4.5, "$$hashKey": "074"},
            {"date": new Date("2015-02-06T16:00:00.000Z"), "type": {"code": "1", "description": "Car / Van", "default_ppm": "0.45"}, "cost": 4.5, "$$hashKey": "075"},
            {"date": new Date("2015-02-07T16:00:00.000Z"), "type": {"code": "1", "description": "Car / Van", "default_ppm": "0.45"}, "cost": 4.5, "$$hashKey": "076"},
            {"date": new Date("2015-02-05T16:00:00.000Z"), "type": {"code": "2", "description": "Motorbike", "default_ppm": "0.25"}, "cost": 0.25, "$$hashKey": "07A"},
            {"date": new Date("2015-02-07T16:00:00.000Z"), "type": {"code": "4", "description": "Public Transport", "default_ppm": "N/A"}, "cost": "100", "$$hashKey": "07C"}
          ];
          $scope.expenseData.subsistences = [
            {"date": new Date("2015-02-05T16:00:00.000Z"), "type": {"code": "1", "description": "Breakfast", "default_cost": "5.00"}, "cost": "5.00", "$$hashKey": "07G"},
            {"date": new Date("2015-02-06T16:00:00.000Z"), "type": {"code": "1", "description": "Breakfast", "default_cost": "5.00"}, "cost": "5.00", "$$hashKey": "07H"},
            {"date": new Date("2015-02-07T16:00:00.000Z"), "type": {"code": "1", "description": "Breakfast", "default_cost": "5.00"}, "cost": "5.00", "$$hashKey": "07I"},
            {"date": new Date("2015-02-05T16:00:00.000Z"), "type": {"code": "2", "description": "Meal 1", "default_cost": "5.00"}, "cost": "5.00", "description": "description", "$$hashKey": "07M"}
          ];
          $scope.expenseData.others = [
            {"date": new Date("2015-02-05T16:00:00.000Z"), "type": {"code": "2", "description": "Training"}, "cost": "1", "$$hashKey": "07Q"},
            {"date": new Date("2015-02-06T16:00:00.000Z"), "type": {"code": "2", "description": "Training"}, "cost": "1", "$$hashKey": "07R"},
            {"date": new Date("2015-02-07T16:00:00.000Z"), "type": {"code": "2", "description": "Training"}, "cost": "1", "$$hashKey": "07S"},
            {"date": new Date("2015-02-07T16:00:00.000Z"), "type": {"code": "1", "description": "Stationary"}, "cost": "100", "$$hashKey": "07W"}
          ];*/


          $scope.searchType = '';
          $scope.whichShow = 'main';

          $scope.filterByType = function(type) {
            if ($scope.searchType === type) {
              $scope.searchType = '';
            } else {
              $scope.searchType = type;
            }
          };

          $scope.onSelectFile = function(fileInput) {
            $scope.$apply(function() {
              $scope.filePath = fileInput.value;
            });
          };

          //select "match entries to upload" from the dropdown
          $scope.startMatchEntries = function() {
            if (!$('#uploadBtn').val()) {
              MsgService.warn('Please select a file to be uploaded');
              return;
            }
            var selectedExpenses = $scope.listData.filter(function(item) {
              return item.checked;
            });
            if (selectedExpenses.length === 0) {
              MsgService.warn('Please select one or more expenses.');
              return;
            }
            $scope.uploadFile(function(fileName) {
              $scope.showConfirmMatch([fileName], selectedExpenses);
            });
          };

          //upload document to s3
          $scope.uploadFile = function(callback) {
            var file = $('#uploadBtn')[0].files[0];
            var fileName = new Date().getTime().toString() + '_' + file.name;
            var mimeType = file.type || 'text/plain';
            $scope.isUploading = true;
            HttpResource.model('documents/receipts').customGet('signedUrl', {
              mimeType: mimeType,
              fileName: fileName
            }, function(response) {
              var signedRequest = response.data.signedRequest;
              $http({
                method: 'PUT',
                url: signedRequest,
                data: file,
                headers: {'Content-Type': mimeType, 'x-amz-acl': 'public-read'}
              }).success(function() {
                //get view url of file
                $scope.isUploading = false;
                if (callback) {
                  callback(fileName);
                }
                MsgService.info('File has been uploaded');
              });
            });
          };

          //delete uploaded file
          $scope.deleteFile = function(fileNames) {
            fileNames.forEach(function(fileName) {
              HttpResource.model('documents/receipts')
                      .delete(fileName)
                      .then(function(response) {
                        if (response.data.result) {
                        } else {
                          MsgService.danger('Could not delete file.');
                          console.log(response);
                        }
                      });
            });
          };

          /**
           * 
           * @param {type} receiptData {receiptUrls: [''], expenses: []}
           */
          $scope.showConfirmMatch = function(receiptUrls, expenses) {
            $scope.receiptUrls = receiptUrls;
            $scope.confirmExpenses = expenses;
            $scope.whichShow = 'confirm_match';
          };
          $scope.removeConfirmExpenses = function(index) {
            $scope.confirmExpenses.splice(index, 1);
          };
          $scope.matchEntries = function() {
            $scope.confirmExpenses.forEach(function(item) {
              item.receiptUrls = item.receiptUrls || [];
              item.receiptUrls = $.unique(item.receiptUrls.concat($scope.receiptUrls));
            });
            $scope.cancelConfirmMatch();
          };
          $scope.cancelConfirmMatch = function() {
            $scope.confirmExpenses = [];
            $scope.whichShow = 'confirmed';
            $scope.listData.forEach(function(item) {
              item.checked = false;
            });
          };
          
          var _selectedExpenses;
          $scope.showPreviousUploaded = function() {
            _selectedExpenses = $scope.listData.filter(function(item) {
              return item.checked;
            });
            if (_selectedExpenses.length === 0) {
              MsgService.warn('Please select one or more expenses.');
              return;
            }
            $scope.whichShow = 'prev_uploaded';
            var dateSearchStr = moment().add(-4*7, 'days').format('YYYY-MM-DD') + '|' + moment().add(1, 'days').format('YYYY-MM-DD');
            $scope.prevUploadedExpenses = [];
            var prevUploadedData = HttpResource.model('candidates/' + $scope.mainData.candidateId + '/expenses').query({startedDate_between: dateSearchStr}, function(){
              prevUploadedData.forEach(function(object){
                object.days.forEach(function(dayItem){
                  dayItem.expenses.forEach(function(expense){
                    if(expense.receiptUrls && expense.receiptUrls.length > 0){
                      var newExpense = angular.copy(expense);
                      newExpense.date = dayItem.date;
                      $scope.prevUploadedExpenses.push(newExpense);
                    }
                  });
                });
              });
            });
          };
          
          $scope.clickPrevUpload = function(obj){
            $scope.selectedPrevUpload = obj;
          };
          
          $scope.selectPrevUpload = function(){
            $scope.showConfirmMatch(angular.copy($scope.selectedPrevUpload.receiptUrls || []), _selectedExpenses);
            $scope.selectedPrevUpload = null;
          };

          $scope.closePrevUploaded = function() {
            $scope.whichShow = 'confirmed';
            $scope.selectedPrevUpload = null;
          };

          $scope.ok = function() {
            $scope.expenseData.receiptListData = $scope.listData;
            $scope.gotoNext();
          };
  
          $scope.closeConfirmed = function() {
            $scope.whichShow = 'main';
          };

          $scope.generateSendData();
          $scope.listData = $scope.getListDataFromSendData($scope.expenseData.sendData);


          setTimeout(function() {
            $scope.normalizeTables();
          }, 300);
        });
