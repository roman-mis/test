'use strict';

/**
 * @ngdoc function
 * @name origApp.controllers:RegisterHomeController
 * @description
 * # RegisterHomeController
 * Controller of the origApp
 */
angular.module('origApp.controllers')
        .controller('RegisterHomeController', function($scope, HttpResource) {
            
            /*var User = HttpResource.model('candidates');
            var candidate = {
                title: 'MR',
                first_name: 'Wen',
                last_name: 'Xuning',
                email_address: 'eaa@sf.com',
                contact_number: '13',
                ni_number: '123',
                birth_date: '1991-8-2',
                address_1: '12',
                address_2: '',
                address_3: '',
                town: '123',
                county: '123',
                post_code: '123',
                gender: '1',
                nationality: '12',
                arrival_date: '123',
                recent_dep_date: '123',
                emp_last_visit: '132',
                agency_name: '123',
                job_title: '123',
                sector: '1',
                start_date: '123',
                bank_name: '123',
                account_name: '123',
                sort_code: '123',
                account_no: '123',
                bank_roll_no: '123',
                current_p45: '213',
                p45_uploaded: '123',
                p46_uploaded: '23'
            };
            
            var allUsers = User.post(candidate).then(function(data){
                console.log(data);
            }, function(data){
                console.log(data);
            });*/

            $scope.saveEdition = function() {
                return true;
            };
        });
