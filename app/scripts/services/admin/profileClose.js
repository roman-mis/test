'use strict';
angular.module('origApp.services')
.factory('closeProfile',function(){

        var property={};

        return {

        	setValue:function(val){

        		property=val;
        	},
        	
        	returnValue:function(){

               return property;
        	}
        }
});