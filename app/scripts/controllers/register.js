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
            console.log(candidate.details);
            var childScope = angular.element('.register-body').scope();
            var form = childScope.registerform;
            if (form.$validate()) {
              //updated
              //childScope.saveEdition();
              if ($scope.isLastStep === false) {
                $location.path('/register/' + wizard[$scope.currentStep + 1]);
              }
            }
          };
          $scope.submit = function() {
            //updated
            if(candidate.details.p45Document){
              candidate.details.p45DocumentUrl = candidate.details.p45Document.url;
            }else{
              delete candidate.details.p45DocumentUrl;
            }
            var newCandidate = angular.copy(candidate.details);
            console.log(newCandidate)
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