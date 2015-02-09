var app = angular.module('origApp.controllers');

app.controller('templatesController',['$scope','$location','HttpResource', 'adminTemplate',
	function($scope,$location,HttpResource,adminTemplate){	
		console.log('hello');
	// console.log('templatesController');
	// console.log($stateParams.templateType);
	// $scope.img= '';
	// switch($stateParams.templateType){
	// 	case 'Call_log':
	// 		$scope.img='/images/64px/0101-database.png';
	// 	break;
	// 	case 'task':
	// 		$scope.img='/images/64px/0275-spell-check.png';
	// 	break;
	// 	case 'documents':
	// 		$scope.img='/images/64px/0049-folder-open.png';
	// 	break;
	// 	case 'email':
	// 		$scope.img='/images/64px/0070-envelop.png';
	// 	break;
	// 	case 'invoices':
	// 		$scope.img='/images/64px/0039-file-text2.png';
	// 	break;
	// 	default:
	// 		$scope.img="";
	// }

	  $scope.gridOptions={
		columns:["1" ,'Name','Type','Last edited','Created','Action'],
		rowdata:['templateName','templateType','updatedDate','createdDate'],
		allData:[],
		data:[],
		limit: 20,
        totalItems: 0,
        isPagination: false,
        onLimitChanged: function() {
          $scope.loadAdminTemplates();
        },
        onPageChanged: function() {
          $scope.loadAdminTemplates();
        }
	  };
	  
	  $scope.go = function(path) {
    	console.log(path);
 		$location.path(path);
	  }

	  for (var i = 0;i<10;i++){
		$scope.gridOptions.data[i]=[];
		for(var j = 0; j < 4; j++){
			$scope.gridOptions.data[i][j]='any data';
		}
	  }


      $scope.ableLoadMore = false;
      $scope.searchName = '';

	  //trigger filtering after 500ms from the last typing
	  var searchTimerPromise = null;
	  $scope.onDelaySearch = function() {
	    $timeout.cancel(searchTimerPromise);
	    searchTimerPromise = $timeout(function() {
	      $scope.loadAdminTemplates();
	    }, 500);
	  };


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
            if ($scope.filterFirstName) {
              params.firstName_contains = $scope.filterFirstName;
            }
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
              console.log(t);
              adminTemplate.details = t.object;
              console.log(adminTemplate);
            });
          };

           $scope.gridOptions.deleteAdminTemplate = function(index) {
           	 if (!confirm('Are you sure to delete this branch?')) {
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
          console.log($scope.gridOptions);
}]);