var app = angular.module('origApp.controllers');

app.controller("payrollPayrollCtrl", ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
    // $http.get("random.json").success(function (data) {
    //     $scope.fields = data;
    // });

    $scope.fields= [
                      {
                        "_id": "54fff16865c23dc23e602549",
                        "id": 866,
                        "firstname": "Grant",
                        "lastname": "Bond",
                        "taxcode": 80,
                        "wkno": 21,
                        "unit": "elit",
                        "rate": "0.0",
                        "ded": "duis",
                        "taxni": 723,
                        "erni": "0.0",
                        "pensions": "0.0",
                        "holiday": "in",
                        "margin": "ipsum",
                        "net": "deserunt"
                      },
                      {
                        "_id": "54fff168c668cba644a39474",
                        "id": 200,
                        "firstname": "Glenda",
                        "lastname": "House",
                        "taxcode": 609,
                        "wkno": 30,
                        "unit": "proident",
                        "rate": "0.0",
                        "ded": "est",
                        "taxni": 741,
                        "erni": "0.0",
                        "pensions": "0.0",
                        "holiday": "laboris",
                        "margin": "nisi",
                        "net": "fugiat"
                      },
                      {
                        "_id": "54fff16897b2a912161ebedd",
                        "id": 596,
                        "firstname": "Duffy",
                        "lastname": "Mccarty",
                        "taxcode": 95,
                        "wkno": 60,
                        "unit": "pariatur",
                        "rate": "0.0",
                        "ded": "officia",
                        "taxni": 775,
                        "erni": "0.0",
                        "pensions": "0.0",
                        "holiday": "culpa",
                        "margin": "culpa",
                        "net": "id"
                      },
                      {
                        "_id": "54fff168ee1a602217a7e067",
                        "id": 727,
                        "firstname": "Luna",
                        "lastname": "Coffey",
                        "taxcode": 191,
                        "wkno": 60,
                        "unit": "velit",
                        "rate": "0.0",
                        "ded": "fugiat",
                        "taxni": 843,
                        "erni": "0.0",
                        "pensions": "0.0",
                        "holiday": "irure",
                        "margin": "ullamco",
                        "net": "fugiat"
                      }];
	
    $scope.editItem = function (index) {
        var item = {};
        angular.copy($scope.fields[index], item);
        //console.log(item);
        open('lg', item);
    }

    function open(size, itemToEdit) {
        var modalInstance = $modal.open({
            templateUrl: 'views/payroll/payrollpayrolledit.html',
            controller: 'payrollPayrollEditCtrl',
            size: size,
            resolve: {
                item: function () {
                    return itemToEdit;
                }
            }
        });

        modalInstance.result.then(function (editedItems) {
            //console.log(editedItems);
        }, function () {
            //console.log("Dismissed");
        });
    }
}]);