'use strict';

angular.module('origApp.controllers')
.controller('MileageController', function($scope, $timeout, $rootScope,HttpResource, Notification){
    $rootScope.breadcrumbs = [{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/hmrc/mileage', text: 'Mileage Rates'}
    ];  
    $scope.showEdit = []; 
    $scope.viewIcon = [];
    $scope.tempValue = '';
    $scope.mileageRates = {};

    // var valuesName = [];
    $scope.mileageRatesNames = ['petrolUpTo1400', 'petrol1401to2000', 'petrolAbove2000', 'diselUpTo1400',
                             'disel1401to2000', 'diselAbove2000', 'lpgUpTo1400', 'lpg1401to2000', 'lpgAbove2000']


    function loadData(){
        HttpResource.model('systems/mileagerates').customGet('',{},function(data){
            if(data.data.objects){
                $scope.mileageRates = data.data.objects;
            }
        });
    }

    loadData();
    $scope.$parent.tab = 'mileage';
    for(var i = 0 ; i < 8; i++){
        $scope.viewIcon[i] = false; 
    }
    function hideAllEdites(){
        for(var i = 0 ; i < 8; i++){
            $scope.showEdit[i] = false; 
        }
        $scope.EditedIndex = -1;
    }
    hideAllEdites();

    $scope.showEditFn = function(index){
        hideAllEdites();
        $scope.showEdit[index] = true;
        $scope.EditedIndex = index;
        $scope.tempValue = $scope.mileageRates[$scope.mileageRatesNames[index]];
    };

    $scope.getEvent = function(event, index){
        if(event.keyCode === 27){
            console.log($scope.tempValue);
            hideAllEdites();
        }else if(event.keyCode === 13){
            if(Number($scope.tempValue)){
                $scope.mileageRates[$scope.mileageRatesNames[index]] = Number($scope.tempValue);      
            }else{
                Notification.error({message: 'Values must be Number', delay: 2000});
            }
            hideAllEdites();
        }else if(event.keyCode === 9){
            if(Number($scope.tempValue)){
                $scope.mileageRates[$scope.mileageRatesNames[index]] = Number($scope.tempValue);      
                $scope.showEditFn(index + 1);
            }else{
                Notification.error({message: 'Values must be Number', delay: 2000});
            }
        }
    };

    $scope.hide = function(){        
        hideAllEdites();
    };

    $scope.hover = function(index){
        $scope.viewIcon[index] = true;
    };
    
    $scope.leave = function(index){
        $scope.viewIcon[index] = false;
    };

    $scope.save = function(){
        HttpResource.model('systems/mileagerates').create($scope.mileageRates).post().then(function() {
        });
    };

    $scope.clearUnsaved = function(){
        loadData();
    };

});