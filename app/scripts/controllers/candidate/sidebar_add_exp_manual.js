'use strict';
angular.module('origApp.controllers')
    .controller('CandidateSidebarAddExpManualController', function ($scope) {
        var agencySelected = false;
        var datePicked = false;
        var timesCreated = false;
        var stepTwoAvailable = false;
        var stepThreeAvailable = false;

        var container = document.getElementById('container_modal');
        var close = container.parentElement.parentElement;
        close.classList.add('modal-lg');

        $(document).ready(function () {

            $('#myTab a').click(function (e) {
                e.preventDefault()
                $(this).tab('show');
            });

            $('#categories :input').attr('disabled', true);
            $('#days :input').attr('disabled', true);

            var $tableBody = $('#tableBody'),
                $tableHeader = $('#tableHeader'),
                thTr = $tableHeader.find('tr')[0],
                $ths = $(thTr).find('th'),
                tr0 = $tableBody.find('tr')[0],
                $tds = $(tr0).children();

            function normalizeTables() {
                $($ths[0]).css('width', $($tds[0]).width() + 16 + 'px');
            };

            $(window).on('resize', normalizeTables);
        });

        $scope.agencySelected = function () {
            agencySelected = true;
            checkStepTwoAvailability();
        }

        $scope.datePicked = function () {
            datePicked = true;
            $scope.picking_date = false;
            timesCreated = false;
            checkStepTwoAvailability();
            checkStepThreeAvailability();
        }

        function checkStepTwoAvailability() {
            if (agencySelected && datePicked) {
                stepTwoAvailable = true;
                $('#days :input').removeAttr('disabled');
                $('#addDateButton').attr('disabled', true);
                $('#timesDoneButton').attr('disabled', true);
            }
        }

        $scope.availableTimesAdded = function () {
            timesCreated = true;
            checkStepThreeAvailability();
        }

        function checkStepThreeAvailability() {
            if (timesCreated) {
                stepThreeAvailable = true;
                $('#categories :input').removeAttr('disabled');
                $('#addSubsistenceButton').attr('disabled', true);
                $('#addOtherButton').attr('disabled', true);
            } else {
                stepThreeAvailable = false;
                $('#categories :input').attr('disabled', true);
            }
        }

        function logs(record, label) {
            if (label) console.log(label + ':', record);
            else console.log(record);
        }

    });