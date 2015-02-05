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
                firstName: 'Wen',
                lastName: 'Xuning',
                emailAddress: 'eaa@sf.com',
                phone: '13',
                niNumber: '123',
                birthDate: '1991-8-2',
                address1: '12',
                address2: '',
                address3: '',
                town: '123',
                county: '123',
                postCode: '123',
                gender: '1',
                nationality: '12',
                arrivalDate: '123',
                recentDepDate: '123',
                empLastVisit: '132',
                agencyName: '123',
                jobTitle: '123',
                sector: '1',
                startDate: '123',
                bankName: '123',
                accountName: '123',
                sortCode: '123',
                accountNo: '123',
                bankRollNo: '123',
                currentP45: '213',
                p45Uploaded: '123',
                p46Uploaded: '23'
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
