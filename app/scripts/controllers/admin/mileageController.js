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
    $scope.mileageRatesNames = ['petrolUpTo1400', 'petrol1401to2000', 'petrolAbove2001', 'dieselUpTo1600',
                             'diesel1601to2000', 'dieselAbove2001', 'lpgUpTo1400', 'lpg1401to2000', 'lpgAbove2001']

        HttpResource.model('constants/mileageRatesDefault').customGet('',{},function(data){
            console.log(data);
            $scope.defaultValue = data.data;
            loadData();
        });

    function loadData(){
        HttpResource.model('systems/mileagerates').customGet('',{},function(data){
            console.log(data.data.objects);
            $scope.mileageRates = $scope.defaultValue;
            if(data.data.objects){
                for(var key in data.data.objects){
                    if(data.data.objects[key]){
                        $scope.mileageRates[key] = data.data.objects[key];                        
                    }
                }
            }
        });
    }




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

    $scope.save = function(index){
        if(Number($scope.tempValue)){
            if(Number($scope.tempValue)>=0){
                $scope.mileageRates[$scope.mileageRatesNames[index]] = Number($scope.tempValue).toFixed(2);      
                hideAllEdites();
            }else{
                Notification.error({message: 'Values Must be Positive', delay: 2000});   
            }
        }else{
            Notification.error({message: 'Values must be numerical', delay: 2000});
        }
        console.log($scope.mileageRates);
        HttpResource.model('systems/mileagerates').create($scope.mileageRates).post().then(function() {
        });
    };

    $scope.getEvent = function(event, index){
        if(event.keyCode === 27){
            console.log($scope.tempValue);
            hideAllEdites();
        }else if(event.keyCode === 13){
            $scope.save(index);
        }else if(event.keyCode === 9){
            $scope.save(index);
            $scope.showEditFn(index+1);
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

    $scope.clearUnsaved = function(){
        loadData();
    };

});