'use strict';
angular.module('origApp.controllers')
    .controller('CandidateSidebarAddExpManualController', function ($scope, $modal) {
        var agencySelected = false;
        var timesCreated = false;
        var stepTwoAvailable = false;
        $scope.stepThreeAvailable = false;

        var container = document.getElementById('container_modal');
        var close = container.parentElement.parentElement;
        close.classList.add('modal-lg');

        $(document).ready(function () {

            $('#myTab a').click(function (e) {
                e.preventDefault()
                $(this).tab('show');
            });

            //$('#categories :input').attr('disabled', true);
            $('#days :input').attr('disabled', true);
            //document.getElementById("footer").style.visibility = "hidden";

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

        function checkStepTwoAvailability() {
            if (agencySelected) {
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
                $scope.stepThreeAvailable = true;
                //$('#categories :input').removeAttr('disabled');
                //$('#addSubsistenceButton').attr('disabled', true);
                //$('#addOtherButton').attr('disabled', true);
                //$('#addMilagePostcode').attr('disabled', true);
                //$('#vehicleSaveButton').attr('disabled', true);
                //document.getElementById("footer").style.visibility = "visible";
            } else {
                $scope.stepThreeAvailable = false;
                //$('#categories :input').attr('disabled', true);
                //document.getElementById("footer").style.visibility = "hidden";
            }
        }

        function logs(record, label) {
            if (label) console.log(label + ':', record);
            else console.log(record);
        }

    });