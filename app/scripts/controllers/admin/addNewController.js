var app = angular.module('origApp.controllers');

app.controller('addNewController',['$rootScope', '$interval','$scope', '$stateParams', '$location', 'HttpResource', 'adminTemplate','ConstantsResource',
	function($rootScope, $interval, $scope, $stateParams, $location, HttpResource, adminTemplate, ConstantsResource){	
		
		$rootScope.breadcrumbs = [{link:'/', text:'Home'},
                              {link: '/admin/home', text: 'Admin'},
                              {link: '/admin/templates', text: 'templates'},
                              {link: '/admin/add_new/call_log', text: 'add new '+ $stateParams.type}
                              ];

		// defined values
		var fields = ['templateType','name','subType','title','body','templateBody'];
		var differentTypes =['call_log','task','document','email','payslip','invoice'];		
		// initialization
		$scope.data={details:{}};
		$scope.mergeFields = ['please select type first']
		if($stateParams.type === 'edite'){
			if(!adminTemplate.details.name){
				$location.path('admin/templates');
			}
			$scope.data=adminTemplate;
		}else{
			var definedType = false;
			for(var i = 0; i < differentTypes.length; i++){
				if($stateParams.type === differentTypes[i]){
					$scope.data.details.templateType = $stateParams.type;
					definedType = true;
					break;
				}
			}
			if(!definedType){
				$location.path('admin/templates');
			}
		}
		
		$scope.data.details.current ={};
		$scope.data.details.current.subType = $scope.data.details.subType

		// get dropdowns from the server
		$scope.templatesDropdowns = HttpResource.model('constants')
			.customGet('/adminTemplatesData/'+$scope.data.details.templateType,{},function(){});
        ////**////


        // on select function
        $scope.selectSybType = function(selectedSubType){
        	for(var i = 0; i < $scope.templatesDropdowns.length; i++){
        		for(var j = 0; j < $scope.templatesDropdowns[i].data.length; j++){
	        		if($scope.templatesDropdowns[i].data[j].subType === selectedSubType){
	        			$scope.mergeFields= $scope.templatesDropdowns[i].data[j].mergeFields;
	        			$scope.data.details.current.subType = selectedSubType;
	        			
	        			$scope.data.details.mergeFields="";
	        			$scope.data.details.subType = $scope.data.details.current.subType
	        		}
        		}
        	}
        }


        // on change function
        $scope.changeTemplateSubType = function(){
        	$scope.data.details.subType = $scope.data.details.current.subType;
        }


        $scope.setMergeField = function(mergeField){
        	console.log('******************************');
        	console.log($scope.selection);

        	//if the selection not defined
        	if(!$scope.selection || !$scope.selection.startContainer.data){
        		$scope.data.details.templateBody = mergeField;
        		return; 
        	}

        	if($scope.selection.startContainer.data ===
        		$scope.selection.endContainer.data){
        		
        		$scope.assign('startContainer',
        			$scope.selection.startOffset,
        			$scope.selection.endOffset,
        			mergeField);

        	}else{
        		$scope.assign('startContainer',
        			$scope.selection.startOffset,
        			$scope.selection.startContainer.length,
        			'');

        		$scope.assign('endContainer',
        			0,
        			$scope.selection.endOffset,
        			'');

        		$scope.assign('startContainer',
        			$scope.selection.startContainer.length,
        			$scope.selection.startContainer.length,
        			mergeField);

        	}      	
        }

        $scope.assign = function(container,startOffset,endOffset,data){
        	var ar = $scope.selection[container].data.split('');
			ar.splice(startOffset,
				endOffset-startOffset,data);
			$scope.selection[container].data = ar.join('');
        }

		$scope.paste = function(){
			$scope.data=adminTemplate;
			
		}

		$scope.isNotEmpty = function(vars){
			var isNotEmpty = true;
			for(var i = 0; i < vars.length; i++){
				if($scope.data.details[vars[i]] === undefined || $scope.data.details[vars[i]] === ''){
					isEmpty = false;
					break;
				}
			}
			return isNotEmpty;
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
			if($scope.isNotEmpty(fields)){
				var data = $scope.getData(fields);
				console.log(data);
				HttpResource.model('admin/templates').create(data).post().then(function(response) {
	              if (!HttpResource.flushError(response)) {
	                $scope.clear();
	                $location.path('admin/templates');
	              }
	            });
			}
		}


	$scope.updateAdminTemplate = function() {
		if($scope.isNotEmpty(fields)){
		  console.log(adminTemplate);
		  var id =adminTemplate.details._id;
	      console.log(id)
	      var data = $scope.getData(fields);
	      t = HttpResource.model('admin/templates/'+id)
	      	.create(data).post().then(function(result){
	        	console.log('*****');
	        	console.log(result);
	      	});
  	  	}
    };

    $scope.save = function(){
		if($stateParams.type === 'edite'){
			$scope.updateAdminTemplate()
		}else{
			$scope.saveNew()
		}
	}

}]);