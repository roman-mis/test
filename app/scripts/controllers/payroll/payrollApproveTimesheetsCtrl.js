'use strict';
angular.module('origApp.controllers')
.controller('payrollApproveTimesheetsCtrl', ['$scope', '$http', 'HttpResource', 'ConstantsResource', '$rootScope',
	function ($scope, $http, HttpResource, ConstantsResource, $rootScope) {
	    $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                                  { link: '/payroll/home', text: 'Payroll' },
                                  { link: '/payroll/approveTimesheets', text: 'Approve Timesheets' }
	    ];

	    $scope.payfrequencies = ConstantsResource.get('payfrequencies');
	    HttpResource.model('timesheetbatches/with/timesheets').customGet('', {}, function (timesheetBatches) {
	        logs(timesheetBatches, 'Done!, timesheet batches');
	        $scope.timesheetBatches = timesheetBatches.data.objects;
	        $scope.cloned = [];
	        angular.copy($scope.timesheetBatches, $scope.cloned);
	        //logs($scope.cloned, 'cloned');
	    });

	    $http.get('/api/constants/timesheetStatus').success(function (res) {
	        //logs(res, 'timesheet status');
	        $scope.timesheetStatus = res;
	    });

	    //$scope.logger = function (x, y) {
	    //    logs(x, 'x');
	    //    logs(y, 'y');
	    //}

	    function logs(record, label) {
	        if (label) console.log(label + ':', record);
	        else console.log(record);
	    }
	}]);