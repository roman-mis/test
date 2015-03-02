angular.module('origApp.controllers')
	.controller('invoiceOverviewController',['$scope','HttpResource','$modalInstance', 'parentScope',
	 function ($scope, HttpResource, $modalInstance, parentScope) {
		
	 	    $(document).ready(function() {
        var $tableBody = $('#tableBody'),
            $tableHeader = $('#tableHeader'),
            thTr = $tableHeader.find('tr')[0],
            $ths = $(thTr).find('th'),
            tr0 = $tableBody.find('tr')[0],
            $tds = $(tr0).children();

        function normalizeTables () {
            $($ths[0]).css('width', $($tds[0]).width() + 16 + 'px');
            $($ths[1]).css('width', $($tds[1]).width() + 16 + 'px'); 
            $($ths[2]).css('width', $($tds[2]).width() + 16 + 'px'); 
            $($ths[3]).css('width', $($tds[3]).width() + 16 + 'px'); 
            $($ths[4]).css('width', $($tds[4]).width() + 16 + 'px');
        }
        $('#myModal').on('shown.bs.modal', normalizeTables);
        $(window).on('resize', normalizeTables);
    });

	}])