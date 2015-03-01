
var app = angular.module('origApp.controllers');

app.controller('importExportController',['$rootScope', '$scope', 'HttpResource', 'imExTemplates', '$state',
	function($rootScope,$scope,HttpResource,imExTemplates,$state){

	$scope.loadAllTemplates = function(templatesType) {
      var params = {};
      if (templatesType) {
        params.templateType_contains = templatesType;
      }
      console.log('params');
      console.log(params);
      // console.log($scope.gridOptions.data);

      $scope.allData = HttpResource.model('imExTeplates').query(params, function(data) {
        console.log(data.data.objects);
        $scope.templates = data.data.objects;
      });
    };
    $scope.loadAllTemplates('');

    $scope.showTemplate = function(index){
    	imExTemplates.details = $scope.templates[index];
    	$state.go("app.admin.addNewImEx", { "type": 'Edite'});
    }

	$scope.copy = function(index){
    	imExTemplates.details.items = $scope.templates[index].items;
    }    

    $scope.deleteTemplate = function(index) {
     	 if (!confirm('Are you sure to delete this template?')) {
        return;
      }
    	var id =$scope.templates[index]._id;
    	console.log(id)
      HttpResource.model('imExTeplates')
      .delete(id).then(function(result){
        console.log('*****');
        console.log(result);
        if(result.data.result){
        	$scope.templates.splice(index,1);
        }
      });
    };
}]);