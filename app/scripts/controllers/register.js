/**
 * @ngdoc function
 * @name origApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterController', function($scope, $location, $state, candidate, HttpResource, MsgService) {
          var wizard = ['home', 'step1', 'step2', 'step3', 'step4', 'step5', 'confirm'];
          $scope.currentState = $state.current.name;
          $scope.confirm = {};
          $scope.prevstep = function() {
            if ($scope.isFirstStep === false) {
              $location.path('/register/' + wizard[$scope.currentStep - 1]);
            }
          };
          $scope.nextstep = function() {
            var childScope = angular.element('.register-body').scope();
            var form = childScope.registerform;
            if (form.$validate()) {
              childScope.saveEdition();
              if ($scope.isLastStep === false) {
                $location.path('/register/' + wizard[$scope.currentStep + 1]);
              }
            }
          };
          $scope.submit = function() {
            var newCandidate = {
              title: candidate.getAttribute('title'),
              first_name: candidate.getAttribute('firstName'),
              last_name: candidate.getAttribute('lastName'),
              email_address: candidate.getAttribute('emailAddress'),
              contact_number: candidate.getAttribute('contactNumber'),
              ni_number: candidate.getAttribute('niNumber'),
              birth_date: moment(candidate.getAttribute('dateOfBirthday')).isValid() ? moment(candidate.getAttribute('dateOfBirthday')).format("YYYY-MM-DD") : '',
              address_1: candidate.getAttribute('address1'),
              address_2: candidate.getAttribute('address2'),
              address_3: candidate.getAttribute('address3'),
              town: candidate.getAttribute('town'),
              county: candidate.getAttribute('county'),
              post_code: candidate.getAttribute('postCode'),
              gender: candidate.getAttribute('gender').key,
              nationality: candidate.getAttribute('nationality'),
              arrival_date: moment(candidate.getAttribute('entranceDate')).isValid() ? moment(candidate.getAttribute('entranceDate')).format("YYYY-MM-DD") : '',
              recent_dep_date: moment(candidate.getAttribute('recentEntranceDate')).isValid() ? moment(candidate.getAttribute('recentEntranceDate')).format("YYYY-MM-DD") : '',
              emp_last_visit: candidate.getAttribute('payEmployFlag') ? 1 : 0,
              agency_name: candidate.getAttribute('agencyName'),
              job_title: candidate.getAttribute('jobTitle'),
              sector: candidate.getAttribute('sector'),
              start_date: moment(candidate.getAttribute('jobStartDate')).isValid() ? moment(candidate.getAttribute('jobStartDate')).format("YYYY-MM-DD") : '',
              bank_name: candidate.getAttribute('bankName'),
              account_name: candidate.getAttribute('accountName'),
              sort_code: candidate.getAttribute('sortCode'),
              account_no: candidate.getAttribute('accountNumber'),
              bank_roll_no: candidate.getAttribute('bankRollNumber'),
              current_p45: candidate.getAttribute('haveP45Document') ? 1 : 0,
              p45_document_url: candidate.getAttribute('fileName') ? candidate.getAttribute('fileName').url : '',
              p45_uploaded: candidate.getAttribute('p45Uploaded') ? 1 : 0,
              p46_uploaded: candidate.getAttribute('p46Complted') ? 1 : 0
            };
            HttpResource.model('candidates').create(newCandidate).post().then(function(response) {
              if (!HttpResource.flushError(response)) {
                $location.path('/register/welcome');
              }
            });
          };
          $scope.$watch(function() {
            return $state.current.name;
          }, function(newValue, oldValue, scope) {
            var state = newValue.split('.')[1];
            $scope.currentStep = wizard.indexOf(state);
            $scope.isFirstStep = wizard.indexOf(state) === 0;
            $scope.isLastStep = wizard.indexOf(state) === wizard.length - 1;
          });
        });