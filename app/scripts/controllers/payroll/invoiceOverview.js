'use strict';
angular.module('origApp.controllers')
	.controller('invoiceOverviewController',['$scope','HttpResource','$modalInstance', 'parentScope',
	 function ($scope, HttpResource, $modalInstance, parentScope) {
		
        
        $scope.totalInvoiceValue = 0;
        $scope.totalVat = 0;
        $scope.marginValue = 0;
        $scope.displayDetails = [];
        $scope.holidayAmount = 0;
        $scope.totalNumberOfContractors = 0;
        $scope.displayInvoice = parentScope.saveInvoice.data.object;

        console.log($scope.displayInvoice);
        for(var i = 0; i< $scope.displayInvoice.length;++i){

            $scope.totalInvoiceValue += $scope.displayInvoice[i].total;
            //console.log($scope.displayInvoice[i].vat);
            $scope.totalVat += $scope.displayInvoice[i].vat;

            if($scope.displayInvoice[i].companyDefaults.marginChargedToAgency === true){
                $scope.marginValue += $scope.displayInvoice[i].companyDefaults.marginAmount;
            }

            if($scope.displayInvoice[i].companyDefaults.holidayPayIncluded === true){
                $scope.holidayAmount += $scope.displayInvoice[i].companyDefaults.holidayPayDays;
            }
            $scope.totalNumberOfContractors += $scope.displayInvoice[i].lines.length;

            $scope.displayObject = {
                date:$scope.displayInvoice[i].createdDate,
                invoiceNo: $scope.displayInvoice[i].invoiceNumber,
                net: $scope.displayInvoice[i].net,
                vat: $scope.displayInvoice[i].vat,
                total: $scope.displayInvoice[i].total,
            };
            $scope.displayDetails.push($scope.displayObject);

        }
            

        $scope.logMe = function () {
            // body...
            console.log(parentScope.saveInvoice.data,$scope.totalVat);
            console.log('display details',$scope.displayDetails);
            console.log('totalInvoiceValue: ',$scope.totalInvoiceValue,'/n total vat', $scope.totalVat, '/n details'
                , $scope.displayDetails, '/n holidayAmount',$scope.holidayAmount, '/n contractors', $scope.totalNumberOfContractors);
                       // console.table($scope.displayInvoice.data.object);

        };

	}]);