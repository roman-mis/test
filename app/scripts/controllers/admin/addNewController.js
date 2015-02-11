var app = angular.module('origApp.controllers');

app.controller('addNewController',['$scope', '$stateParams', '$location', 'HttpResource', 'adminTemplate','ConstantsResource',
	function($scope, $stateParams, $location, HttpResource, adminTemplate, ConstantsResource){	
		var fields = ['templateName','templateType','mergeFields',
				'templatTitle','body','templateTechnique'];
		var differentStates =['call_log','task','document','email',
		'payslip','invoice'];		
		$scope.data={details:{}};
		$scope.mergeFields = ['please select type first']
		if($stateParams.type === 'edite'){
			if(!adminTemplate.details.templateName){
				$location.path('admin/templates');
			}
			$scope.data=adminTemplate;
		}else{
			var found = false;
			for(var i = 0; i < differentStates.length; i++){
				if($stateParams.type === differentStates[i]){
					$scope.data.details.templateTechnique = $stateParams.type;
					found =true;
					break;
				}
			}
			if(!found){
				$location.path('admin/templates');
			}
		}
		$scope.data.details.type ={};
		$scope.data.details.type.type = $scope.data.details.templateType
		$scope.templatesDropdowns =
		HttpResource.model('constants').customGet(
			'/adminTemplatesData/'+$scope.data.details.templateTechnique,
			 {},function(){

		 });
        
        $scope.select = function(selectedType){
        	for(var i = 0; i < $scope.templatesDropdowns.length; i++){
        		for(var j = 0; j < $scope.templatesDropdowns[i].data.length; j++){
	        		if($scope.templatesDropdowns[i].data[j].type === selectedType){
	        			console.log($scope.templatesDropdowns[i].data[j]);
	        			console.log($scope.templatesDropdowns[i].data[j].mergeFields);
	        			$scope.mergeFields=
	        				$scope.templatesDropdowns[i].data[j].mergeFields;
	        			$scope.data.details.type.type = selectedType;
	        			$scope.data.details.mergeFields="";
	        			$scope.data.details.templateType = $scope.data.details.type.type
	        		}
        		}
        	}
        }

        $scope.changeTemplateType = function(){
        	$scope.data.details.templateType = $scope.data.details.type.type;
        }


        $scope.setMergeField = function(mergeField){
        	$scope.data.details.mergeFields =  mergeField;
        }

		$scope.paste = function(){
			$scope.data=adminTemplate;
			
		}

		$scope.notEmpty = function(vars){
			var notEmpty = true;
			for(var i = 0; i < vars.length; i++){
				if($scope.data.details[vars[i]] === undefined || $scope.data.details[vars[i]] === ''){
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

		$scope.saveNew = function(){
			if($scope.notEmpty(fields)){
				var data = $scope.getData(fields);
				HttpResource.model('admin/templates').create(data).post().then(function(response) {
	              if (!HttpResource.flushError(response)) {
	                $scope.clear();
	                $location.path('admin/templates');
	              }
	            });
			}
		}


	$scope.updateAdminTemplate = function() {
	   console.log(adminTemplate);
	      var id =adminTemplate.details._id;
      console.log(id)
      var data = $scope.getData(fields);
      t = HttpResource.model('admin/templates/'+id)
      .create(data).post().then(function(result){
        console.log('*****');
        console.log(result);
      });
    };
    $scope.save = function(){
    	console.log("hi");
			if($stateParams.type === 'edite'){
				$scope.updateAdminTemplate()
				// console.log()
			}else{
				$scope.saveNew()
			}
		}
}]);