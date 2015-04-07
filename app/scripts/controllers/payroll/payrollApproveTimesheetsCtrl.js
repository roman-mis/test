'use strict';
angular.module('origApp.controllers')
.controller('payrollApproveTimesheetsCtrl', ['$scope', 'HttpResource', 'ConstantsResource', '$rootScope',
	function ($scope, HttpResource, ConstantsResource, $rootScope) {
	    $rootScope.breadcrumbs = [{ link: '/', text: 'Home' },
                                  { link: '/payroll/home', text: 'Payroll' },
                                  { link: '/payroll/approveTimesheets', text: 'Approve Timesheets' }
	    ];

	    $scope.payfrequencies = ConstantsResource.get('payfrequencies');
	    HttpResource.model('timesheetbatches/with/timesheets').customGet('', {}, function (timesheetBatches) {
	        logs(timesheetBatches, 'Done!, timesheet batches');
	        $scope.timesheetBatches = timesheetBatches.data.objects;
	        angular.copy($scope.timesheetBatches, $scope.cloned);
	    });



	    function logs(record, label) {
	        if (label) console.log(label + ':', record);
	        else console.log(record);
	    }
	}]);