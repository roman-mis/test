'use strict';

module.exports=function(dbs){
	var db=dbs;
	var Q=require('q');
	// var candidateService=require('../candidateservice')(db);
	var candidateCommonService=require('../candidatecommonservice')(db);
	var timesheetService=require('../timesheetService')(db);
	var payrollService=require('../payrollService')(db);
	var enums=require('../../utils/enums');
	var _=require('lodash');
	var service={};
	service.validateSsp=function(id){
		var validationResult=[];
		return Q.Promise(function(resolve,reject){
			candidateCommonService.getCandidate(id)
			.then(function(user){
				if(!user){
					validationResult.push('Worker not found.');
				}	
				else{
					var timesheetRequest={filters:{}};
					timesheetRequest.filters.worker={operator:'equals',term:id};
					timesheetService.getTimesheets(timesheetRequest)
						.then(function(timesheets){
							if(timesheets.length<=0){
								validationResult.push('Worker has no timesheet yet.');
							}
							else{
								var payrolledTimesheets=_.find(timesheets,function(timesheet){
									return timesheet.status===enums.timesheetStatuses.Payrolled;

								});
								var payrolledWeeks=0;
								_.forEach(payrolledTimesheets,function(timesheet){
									// timesheet.
								});



							}
						});
				}
			})
			.then(function(){
				resolve({result:validationResult.length==0,validationResult:validationResult});
			});
		})

	};

	return service;
};


