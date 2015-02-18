var app = angular.module('origApp.controllers');

app.controller('addNewController',['$rootScope', '$interval','$scope', '$stateParams', '$location', 'HttpResource', 'adminTemplate','ConstantsResource',
	function($rootScope, $interval, $scope, $stateParams, $location, HttpResource, adminTemplate, ConstantsResource){	
		

		// defined values
		var fields = ['templateType','name','subType','title','templateBody'];
		var differentTypes =['call_log','task','document','email','payslip','invoice'];		
		// initialization
		$scope.data={details:{}};
		$scope.mergeFields = ['please select type first']
		if($stateParams.type === 'edite'){
			if(!adminTemplate.details.name){
				$location.path('admin/templates');
			}
			console.log(adminTemplate)
			$scope.data=adminTemplate;
			console.log(adminTemplate)
		}else{
			var definedType = false;
			$scope.data.details.templateBody = '';
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
		

		$rootScope.breadcrumbs = [
		{link:'/', text:'Home'},
        {link: '/admin/home', text: 'Admin'},
        {link: '/admin/templates', text: 'Templates'},
        {link: '/admin/add_new/'+$scope.data.details.templateType, text: breadCrumbAddNewValue()}];

        
		$scope.data.details.current ={};
		$scope.data.details.current.subType = $scope.data.details.subType

		// get dropdowns from the server
		$scope.templatesDropdowns = HttpResource.model('constants')
			.customGet('/adminTemplatesData/'+$scope.data.details.templateType,{},
				function(){
					console.log($scope.templatesDropdowns);
				});
        ////**////
        function breadCrumbAddNewValue(){
        	var s = (($stateParams.type === 'edite')?'Edite ' : 'Add New ' )
				+ breadCrumbformate($scope.data.details.templateType)
			return s;
        }

        function breadCrumbformate(s){
        	var ar = s.split('_');
        	s = '';
        	for(var i = 0; i< ar.length; i++){
        		var arr = ar[i].split('');
				arr[0] = arr[0].toUpperCase();
        		s = s+ arr.join('')+ ' ';
        	}
        	return s;
        }

        // on select function
        $scope.selectSybType = function(selectedSubType){
        	for(var i = 0; i < $scope.templatesDropdowns.length; i++){
        		for(var j = 0; j < $scope.templatesDropdowns[i].data.length; j++){
	        		if($scope.templatesDropdowns[i].data[j].subType === selectedSubType){
	        			$scope.mergeFields = [];
	        			for(var k = 0; k < $scope.templatesDropdowns[i].data[j].mergeFieldsGroupNumber.length; k++){
	        				// $scope.templatesDropdowns[i].data[j].mergeFieldsGroupNumber[k]
	        				for(var m = 0; m < $scope.templatesDropdowns[i].mergeFieldsGroups.length; m++){
	        					if($scope.templatesDropdowns[i].data[j].mergeFieldsGroupNumber[k] ===
	        						$scope.templatesDropdowns[i].mergeFieldsGroups[m].number){
	        						$scope.mergeFields = $scope.mergeFields.concat($scope.templatesDropdowns[i].mergeFieldsGroups[m].mergeFields)
	        						break;
	        					}
	        					
	        				}
	        			console.log($scope.mergeFields);
	        			}
	        			// $scope.mergeFields= $scope.templatesDropdowns[i].data[j].mergeFields;
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
        var formate = function(s){
        	var ar = s.split(' ');
        	s = '';
        	for(var i = 0; i< ar.length; i++){
        		var arr = ar[i].split('');
        		if(i === 0){
        			arr[0] = arr[0].toLowerCase();
        		}else{
					arr[0] = arr[0].toUpperCase();
        		}
        		s = s+ arr.join('');
        	}
        	return s;
        }

        
        $scope.setMergeField = function(mergeField){
        	console.log('******************************');
        	console.log($scope.selection);
        	mergeField = ' %' + formate(mergeField) + '% ';
        	//if the selection not defined
        	if(!$scope.selection || !$scope.selection.startContainer.data){
        		$scope.data.details.templateBody += mergeField;
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
				console.log(vars[i])
				if($scope.data.details[vars[i]] === undefined || $scope.data.details[vars[i]] === ''){
					isNotEmpty = false;
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
	        	$location.path('admin/templates');
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