var app = angular.module('origApp.controllers');

app.controller('templatesController',['$scope','$stateParams',
	function($scope,$stateParams){	
	console.log('templatesController');
	console.log($stateParams.templateType);
	$scope.img= '';
	switch($stateParams.templateType){
		case 'Call_log':
			$scope.img='/images/64px/0101-database.png';
		break;
		case 'task':
			$scope.img='/images/64px/0275-spell-check.png';
		break;
		case 'documents':
			$scope.img='/images/64px/0049-folder-open.png';
		break;
		case 'email':
			$scope.img='/images/64px/0070-envelop.png';
		break;
		case 'invoices':
			$scope.img='/images/64px/0039-file-text2.png';
		break;
		default:
			$scope.img="";
	}
	$scope.gridOptions={
		columns:[$scope.img ,'Name','Type','Last edited','Created','Action'],
		data:[]
	};
	for (var i = 0;i<10;i++){
		$scope.gridOptions.data[i]=[];
		for(var j = 0; j < 4; j++){
			$scope.gridOptions.data[i][j]='any data';
		}
	}
}]);