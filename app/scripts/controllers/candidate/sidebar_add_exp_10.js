'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarAddExp10Controller', function($scope, HttpResource, ConstantsResource, MsgService, $stateParams) {
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

          $scope.summaries = [];
          $scope.sendData = [];
          $scope.types = ConstantsResource.get('otherexpensetypes');
          $scope.candidateId = $stateParams.candidateId;

          $scope.generateSummaries = function() {
            $scope.summaries = [];
            $scope.sendData = [];
            $scope.expenseData.daysInRange.forEach(function(dateItem) {
              if (dateItem.object === 'all') {
                return;
              }
              var summary = {date: dateItem.object};
              var sendItem = {date: dateItem.object, agency: $scope.expenseData.agency._id, expenses: []};
              $scope.expenseData.times.forEach(function(item) {
                if (item.date.getTime() === summary.date.getTime()) {
                  sendItem.startTime = item.startTime + ':00';
                  sendItem.endTime = item.endTime + ':00';
                }
              });
              $scope.expenseData.postCodes.forEach(function(item) {
                if (item.date.getTime() === summary.date.getTime()) {
                  sendItem.postcodes = item.codes;
                }
              });

              //get transports
              summary.travel = 0;
              $scope.expenseData.transports.forEach(function(item) {
                if (item.date.getTime() === summary.date.getTime()) {
                  summary.travel += item.cost * 1;
                  sendItem.expenses.push({
                    expenseType: 'Travel',
                    subType: item.type.description,
                    value: item.cost * 1
                  });
                }
              });

              //get subsistence
              summary.subsistence = 0;
              $scope.expenseData.subsistences.forEach(function(item) {
                if (item.date.getTime() === summary.date.getTime()) {
                  summary.subsistence += item.cost * 1;
                  sendItem.expenses.push({
                    expenseType: 'Subsistence',
                    subType: item.type.description,
                    value: item.cost * 1,
                    description: item.description
                  });
                }
              });

              //get other
              summary.other = 0;
              $scope.expenseData.others.forEach(function(item) {
                if (item.date.getTime() === summary.date.getTime()) {
                  summary.other += item.cost * 1;
                  sendItem.expenses.push({
                    expenseType: 'Other',
                    subType: item.type.description,
                    value: item.cost * 1,
                    description: item.description
                  });
                }
              });

              summary.total = summary.travel + summary.subsistence + summary.other;

              $scope.summaries.push(summary);
              $scope.sendData.push(sendItem);
            });
          };

          $scope.ok = function() {
            $scope.isSaving = true;
            HttpResource.model('candidates/' + $scope.candidateId + '/expenses')
                    .create($scope.sendData)
                    .post()
                    .then(function(response) {
                      $scope.isSaving = false;
                      if (!HttpResource.flushError(response)) {
                        //console.log(response);
                        $scope.gotoNext();
                      }
                    });
          };

          $scope.generateSummaries();
          console.log($scope.summaries);
          console.log($scope.sendData);
        });
