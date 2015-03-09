'use strict';
angular.module('origApp.directives')
.directive('autoComplete', [ function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			autoComplete : '@',
			wishList: '@'
		},	
		controller: function($scope, $interval, $element, $attrs, $transclude) {
			console.log($element.context.outerText);
			document.designMode = 'on';
			// $element.context.outerText = 'test';
			// $element[0].innerText = 'test';
			$scope.k = $element[0];
			console.log($scope.k.childNodes[1].innerText);
			$scope.$watch('$scope.k.innerText', function() {
       console.log('hey, myVar has changed!');
       });
			console.log($element.context.outerText);
			$scope.keyDown = function(event){
				console.log(event);
				console.log($element[0].innerText);
				// $element[0].innerText='test'
			};

			$interval(function(){
				console.log('*************');
				console.log($element[0].innerText);
				console.log('*************');
			},1000);

   
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div>{{}}<div ng-mousedown="keyDown($event)" ng-keydown="keyDown($event)" " style="border:10px;display: inline-block" contentEditable="true">hi</div> <span contentEditable="false">hi2</span> </div>',
		// template: '<div><input ng-mousedown="keyDown($event)" ng-keydown="keyDown($event)" " style="border:10px;display: inline-block" contentEditable="true"/> <span>hi2</span> </div>',
		// templateUrl: ,
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			console.log(iElm);
			console.log(iElm.context.outerText);
			
		}
	};
}]);
  // contains