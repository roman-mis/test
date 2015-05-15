'use strict';

/**
 * @ngdoc function
 * @name origApp.controller:RegisterStep3Controller
 * @description
 * # RegisterStep3Controller
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterStep3Controller', function($scope, candidate) {
            $scope.candidate = candidate;
            $scope.workField = function(){
               var characters=$scope.candidate.details.jobTitle;
               if(characters){
                 $scope.candidate.details.jobTitle = characters.charAt(0).toUpperCase()+characters.substr(1);
               }
            };

         $scope.workFields = [
         	'Accountancy and financial management',
         	'Agriculture, animal and plant resources',
         	'Banking, insurance and financial services',
         	'Business administratio',
         	'Charities and voluntary sector',
         	'Construction, civil engineering and QS',
         	'Emergency services and armed forces',
         	'Engineering',
         	'Environment and natural resources',
         	'Hospitality',
         	'Sport, leisure and tourism',
         	'Human resources',
         	'Recruitment and training',
         	'IT and telecoms',
         	'Languages and culture',
         	'Law, legal services',
         	'Library and information services',
         	'Logistics and transport',
         	'Management consulting',
         	'Management, business and administration',
         	'Manufacturing and processing',
         	'Marketing, advertising and PR',
         	'Media and publishing',
         	'Medical and healthcare',
         	'Performing and creative arts',
         	'Property',
         	'Public sector and civil service',
         	'Retail, sales and customer services',
         	'Science, research and development',
         	'Social, community and youth',
         	'Teaching and education',
         	'Other'
         ];

        });