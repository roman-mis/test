'use strict';

angular.module('origApp.directives')
.directive('ageValidation',[function(){


  return {
    restrict:'A',
    require:'ngModel',
    link:function(scope,ele,attrs,c){

    scope.$watch('candidate.birthDate',function(newValue,oldValue){
       if(newValue || !newValue){
        var today=new Date();

        var d=new Date(newValue);


        if(today.getFullYear()-d.getFullYear() > 16){

          c.$setValidity('agerestrict',true);
        }else{

           c.$setValidity('agerestrict',false);
        }


       }

    });
  }
}


}]);
