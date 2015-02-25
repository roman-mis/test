angular.module('origApp.controllers')
.controller('HMRCMainController', function($scope) {
    $scope.myvar = '0.5100'; 
    $scope.save = function save() {
        console.log('i\'m saving stuff');  
    };
})
.directive('editText', function(){
    return {
        require: 'ngModel',
        scope: {
            saveFunction: '&'  
        },
        template: '<div class="editable"><span class="inner-editable" contentEditable="true"></span><div class="controls"><div class="cancel" ng-click="cancel()">cancel</div><div class="save" ng-click="save()">save</div></div></div>',
        replace: true,
        link: function(scope, elem, attrs, ngModel) {
            var contentElem = elem.find('span');
            var oldValue;
            ngModel.$formatters.push(function(value) {
                contentElem.text(value);
                oldValue = value;
            });
            contentElem.on('blur keyup paste input', function(e) {
                ngModel.$setViewValue(contentElem.text());
                scope.$apply();
            });
            scope.save = function save() {
                scope.saveFunction();
                oldValue = contentElem.text();
            };
            scope.cancel = function cancel() {
                console.log('wot');
                contentElem.text(oldValue);
                ngModel.$setViewValue(contentElem.text());
            };
        }
    };
});