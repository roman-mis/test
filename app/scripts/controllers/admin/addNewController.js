var app = angular.module('origApp.controllers');

app.controller('addNewController',['$scope','$stateParams','HttpResource',
	function($scope,$stateParams,HttpResource){	
		var fields = ['templateName','templateType','mergeFields',
				'templatTitle','body'];	
		$scope.templateName = 'dddd';

		$scope.notEmpty = function(vars){
			var isEmpty = true;
			for(var i = 0; i < vars.length; i++){
				if($scope[vars[i]] === undefined || $scope[vars[i]] === ''){
					console.log(vars[i] + 'isEmpty');
					isEmpty = false;
					break;
				}
			}
			
			return isEmpty;
		}

		$scope.clear = function(vars){
			vars.forEach(function(v){
				$scope[v] = '';
			});
		}

		$scope.getData = function(fields){
			var data = {};
			for(var i = 0; i < fields.length; i++){
				data[fields[i]] = $scope[fields[i]];
			}
			return data;
		}

		$scope.save = function(){
			if($scope.notEmpty(fields)){
				var data = $scope.getData(fields);
				HttpResource.model('admin/templates').create(data).post().then(function(response) {
	              if (!HttpResource.flushError(response)) {
	                console.log('done!');
	                $scope.clear(fields);
	              }
	            });
			}
		}
		$scope.get = function(){
			var data = HttpResource.model('admin').customGet('templates', {}, function(response){
                console.log(response);
                console.log(data);
              });
		}
}]);