'use strict';
angular.module('origApp.controllers')
        .controller('CandidateSidebarDPAController', function($scope, $modalInstance, parentScope, HttpResource) {
          //define private properties
          var candidateInfo = parentScope.candidate;
          var candidateResource = HttpResource.model('candidates/' + candidateInfo._id);
          function shuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
              ;
            return o;
          }

          //define public properties
          $scope.dpaLists = [
            {question: 'What is your postcode?', answer: candidateInfo.postCode},
            {question: 'What is your first line of address?', answer: candidateInfo.address1},
            {question: 'What is your NI Number?', answer: candidateInfo.niNumber},
            {question: 'What is your birthday?', answer: candidateInfo.birthDate},
            {question: 'What is email address?', answer: candidateInfo.emailAddress}
          ];
          $scope.generatedSets = [];
          $scope.remainingSets = [];

          //regnerate all sets
          $scope.reGenerateAllSets = function() {
            var ary = shuffle($scope.dpaLists);
            $scope.generatedSets = ary.slice(0, 3);
            $scope.remainingSets = ary.slice(3);
            $scope.generatedSets.forEach(function(item) {
              item.correct = false;
            });
          };

          //regenerate set
          $scope.reGenerateSet = function(index) {
            $scope.remainingSets = shuffle($scope.remainingSets);
            var newSet = $scope.remainingSets[0];
            var previousSet = $scope.generatedSets[index];
            $scope.remainingSets[0] = previousSet;
            $scope.generatedSets[index] = newSet;
            $scope.generatedSets[index].correct = false;
          };

          //correct question
          $scope.correctSet = function(index) {
            $scope.generatedSets[index].correct = true;
          };

          $scope.isAllCorrect = function() {
            var bool = true;
            $scope.generatedSets.forEach(function(set) {
              if (!set.correct) {
                bool = false;
              }
            });
            return bool;
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
          
          $scope.save = function() {
            $scope.isSaving = true;
            candidateResource.patch('dpa')
                    .then(function(response) {
                        $scope.isSaving = false;
                        if (!HttpResource.flushError(response)) {
                          $modalInstance.close();
                        }
                    });
          };

          $scope.reGenerateAllSets();
        });

