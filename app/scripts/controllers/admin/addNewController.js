var app = angular.module('origApp.controllers');

app.controller('addNewController',['$scope', '$stateParams', '$location', 'HttpResource', 'adminTemplate',
	function($scope, $stateParams, $location, HttpResource, adminTemplate){	
		var fields = ['templateName','templateType','mergeFields',
				'templatTitle','body'];
		console.log(adminTemplate.details.templateType);
		if($stateParams.type === 'edite'){
			$scope.data=adminTemplate;	
		}
		
		$scope.paste = function(){
			$scope.data=adminTemplate;
			console.log(adminTemplate);
			console.log('paste');
		}

		$scope.notEmpty = function(vars){
			var notEmpty = true;
			for(var i = 0; i < vars.length; i++){
				if($scope.data.details[vars[i]] === undefined || $scope.data.details[vars[i]] === ''){
					console.log(vars[i] + 'isEmpty');
					isEmpty = false;
					break;
				}
			}
			return notEmpty;
		}

		$scope.clear = function(vars){
			$scope.data.details={};
			adminTemplate.details={};
		}

		$scope.getData = function(fields){
			var data = {};
			for(var i = 0; i < fields.length; i++){
				data[fields[i]] = $scope.data.details[fields[i]];
			}
			return data;
		}

		$scope.save = function(){
			if($scope.notEmpty(fields)){
				var data = $scope.getData(fields);
				console.log(data)
				HttpResource.model('admin/templates').create(data).post().then(function(response) {
	              if (!HttpResource.flushError(response)) {
	                console.log('done!');
	                $scope.clear();
	                $location.path('admin/templates');
	              }
	            });
			}
		}
}]);