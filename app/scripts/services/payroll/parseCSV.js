'use strict';
var app = angular.module('origApp.services');

app.factory('parseCSV', function($http, $q) {

	function _getFile(file){
		var d = $q.defer();
		Papa.parse(file,  {	// Papa is "papa parser" for parsing csv file
			complete: function(results) {
				var data = [];
				var numberOfTimesheets = 0;
				console.log(results);
				for(var i = 1; i < results.data.length; i++){
					// if(results.data[i][1] == ''){	// skip empty keywords
					// 	continue;
					// }
					data.push({
						'numberOfTimesheets': ++numberOfTimesheets,
						'contractorRefNum': results.data[i][0],
						'contractorForename': results.data[i][1],
						'contractorSurename': results.data[i][2],
						'assignmentId': results.data[i][3],
						'periodEndDate': results.data[i][4],
						'rateDescription': results.data[i][5],
						'noUnits': results.data[i][6],
						'unitRate': results.data[i][7],
						'totalNet': results.data[i][8],
						'vat': results.data[i][9],
						'totalGross': results.data[i][10],
						'holidayPayRule': results.data[i][11],
						'holidayPayRate': results.data[i][12],
						'holidayPay': results.data[i][13],
						'isNonTaxable': results.data[i][14],
						'importStatus': ''
					});
				}

				d.resolve(data);
			}
		});
		return d.promise;
	}

	return {
		get: _getFile
	};

});