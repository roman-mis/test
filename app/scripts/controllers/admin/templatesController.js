var app = angular.module('origApp.controllers');

app.controller('templatesController',['$rootScope', '$scope','$location','HttpResource', 'adminTemplate',
	function($rootScope,$scope,$location,HttpResource,adminTemplate){	
		console.log('hello');
	
  $rootScope.breadcrumbs = [{link:'/', text:'Home'},
                              {link: '/admin/home', text: 'Admin'},
                              {link: '/admin/templates', text: 'Templates'},
                              ];

	$scope.getImage = function(v){
		var img= '';
  //   switch(v){
		// 	case 'call_log':
		// 		img='/images/64px/0101-database.png';
		// 	break;
		// 	case 'task':
		// 		img='/images/64px/0275-spell-check.png';
		// 	break;
		// 	case 'document':
		// 		img='/images/64px/0049-folder-open.png';
		// 	break;
		// 	case 'email':
		// 		img='/images/64px/0070-envelop.png';
		// 	break;
		// 	case 'invoice':
		// 		img='/images/64px/0039-file-text2.png';
		// 	break;
		// 	default:
		// 		img="";
		// }
		return img;
	}
	  $scope.gridOptions={
		columns:["1" ,'Name','Type','Last Edited','Created','Action'],
		rowdata:['name','subType','updatedDate','createdDate'],
		allData:[],
		data:[],
    image:$scope.image,
		getImage:$scope.getImage,
		limit: 20,
        totalItems: 0,
        isPagination: false,
        onLimitChanged: function() {
          $scope.loadAllAdminTemplates();
        },
        onPageChanged: function() {
          $scope.loadAllAdminTemplates();
        }
	  };
	  
	  $scope.go = function(path) {
    	console.log(path);
 		$location.path(path);
	  }

	  for (var i = 0;i<10;i++){
		$scope.gridOptions.data[i]=[];
		
	  }


      $scope.ableLoadMore = false;
      $scope.searchName = '';

	  //trigger filtering after 500ms from the last typing
	  var searchTimerPromise = null;
	  $scope.onDelaySearch = function() {
	    $timeout.cancel(searchTimerPromise);
	    searchTimerPromise = $timeout(function() {
	      $scope.loadAllAdminTemplates();
	    }, 500);
	  };

    $scope.search = function(){
      console.log("searching " + $scope.filterName)
      $scope.loadAllAdminTemplates();
    }
          // HTTP resource
    var acAPI = HttpResource.model('admin/templates');

    $scope.loadAllAdminTemplates = function() {
      var params = {};
      if ($scope.gridOptions.limit) {
        params._limit = $scope.gridOptions.limit;
      }
      if ($scope.gridOptions.currentPage) {
        params._offset = ($scope.gridOptions.currentPage - 1) * $scope.gridOptions.limit;
      } else {
        params._offset = 0;
      }
      if ($scope.filterName) {
        params.name_contains = $scope.filterName;
      }
      console.log('params');
      console.log(params);
      console.log($scope.gridOptions.data);

      $scope.gridOptions.allData = acAPI.query(params, function(data) {
        $scope.gridOptions.data = [];
        for(var i = 0; i < $scope.gridOptions.allData.length; i++){
        	$scope.gridOptions.data[i] =[];
        	for(var j = 0; j < $scope.gridOptions.rowdata.length; j++){
        		$scope.gridOptions.data[i][j] = 
        		$scope.gridOptions.allData[i][$scope.gridOptions.rowdata[j]];
        	}
        }

        console.log($scope.gridOptions.data);
        if ($scope.gridOptions.data.meta) {
          $scope.gridOptions.totalItems = $scope.gridOptions.data.meta.totalCount;
        }
      });
    };

    $scope.loadAllAdminTemplates();

    $scope.gridOptions.loadAdminTemplate = function(index) {
    	var id = $scope.gridOptions.allData[index]._id;
      t = HttpResource.model('admin/templates/'+id)
      .query({},function(data) {
        console.log(data)
        adminTemplate.details = data.data.object;
        console.log(adminTemplate.details)
        $location.path('/admin/add_new/edite');
      });
    };

    $scope.gridOptions.clone = function(index) {
    	adminTemplate.details = $scope.gridOptions.allData[index];
    	console.log(adminTemplate)
    };

     $scope.gridOptions.deleteAdminTemplate = function(index) {
     	 if (!confirm('Are you sure to delete this template?')) {
        return;
      }
    	var id =$scope.gridOptions.allData[index]._id;
    	console.log(id)
      t = HttpResource.model('admin/templates')
      .delete(id).then(function(result){
        console.log('*****');
        console.log(result);
        if(result.data.result){
        	$scope.gridOptions.data.splice(index,1);
        	$scope.gridOptions.allData.splice(index,1);
        }
      });
    };





}]);