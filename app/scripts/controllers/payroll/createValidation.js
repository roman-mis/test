var app = angular.module('origApp.controllers');
app.controller('PayrollCreateValidationController',['$location', '$rootScope', '$scope', 'HttpResource',
	function($location,$rootScope,$scope,HttpResource){	
	console.log('hello');
	$scope.colHead = ['Ts ID', 'name', 'refs', 'Description', 'Rate', 'hours', 'net', 'vat', 'total'];
	$scope.test = true;
	$scope.colData=[];
	$scope.timesheets = [];
	
	HttpResource.model('timesheet').customGet('',{},function(timeSheetsData){
      	console.log('done !!');
        console.log(timeSheetsData.data.objects);
        $scope.timesheets = timeSheetsData.data.objects;
	});

	$scope.elemNames = ['name','description','rate','hours','vat','net','total']
	for(var i = 0; i < $scope.timesheets.length; i++){
		$scope.colData[i].name = $scope.timesheets[i].worker.firstName + ' ' + timesheets[i].worker.firstName;
		for(var j = 0; j < timesheets[i].elements.length; j++){
			$scope.colData[i].description[j] = $scope.timesheets[i].elements[j].description;
			$scope.colData[i].rate[j] = $scope.timesheets[i].elements[j].payRate;
			$scope.colData[i].hours[j] = $scope.timesheets[i].elements[j].units;
			$scope.colData[i].vat[j] = $scope.timesheets[i].elements[j].vat;
		}
		$scope.colData[i].net = $scope.timesheets[i].net;
		$scope.colData[i].total = $scope.timesheets[i].total;
	}
	console.log($scope.colData)

	$scope.copy = function(){
		console.log("copying")

		var doc = new jsPDF('l', 'pt', 'letter');

		var elementHandler = {
		  '#ignorePDF': function (element, renderer) {
		  	console.log(1);
		    return true;
		  }
		};
		// var source = window.document.getElementsByTagName("table")[0];
		var source = document.getElementById('allView');
		var source2 = document.getElementById('test');
		console.log(source)

		margins = {
		    top: 20,
		    bottom: 1,
		    left: 20,
		    right:1
		  };
		  // all coords and widths are in jsPDF instance's declared units
		  // 'inches' in this case
		doc.fromHTML(
		  	source2 // HTML string or DOM elem ref.
		  	, margins.left // x coord
		  	, margins.top // y coord
		  	, {
		  		'width': margins.width // max width of content on PDF
		  		, 'elementHandlers': elementHandler
		  	},
		  	function (dispose) {
		  	  // dispose: object with X, Y of the last line add to the PDF
		  	  //          this allow the insertion of new lines after html
		  	  console.log(dispose)
		  	  // doc.setLineWidth(5);
		        
		      },
		  	margins
		  )

		doc.fromHTML(
		  	source // HTML string or DOM elem ref.
		  	, margins.left // x coord
		  	, margins.top // y coord
		  	, {
		  		'width': margins.width // max width of content on PDF
		  		, 'elementHandlers': elementHandler
		  	},
		  	function (dispose) {
		  	  // dispose: object with X, Y of the last line add to the PDF
		  	  //          this allow the insertion of new lines after html
		  	  console.log("dispose2")
		  	  doc.setLineWidth(5);
		        doc.save('Test.pdf');
		      },
		  	margins
		  )

	}
}]);