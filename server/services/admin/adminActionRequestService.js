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
	var utils=require('../../utils/utils');

	var moment=require('moment');

	service.saveSsp=function(id,sspDetails){
		
		return Q.Promise(function(resolve,reject){
			return candidateCommonService.getUser(id)
					.then(function(user){
						if(user){
							var sspModel=new db.ActionRequest(sspDetails);
							return Q.nfcall(sspModel.save.bind(sspModel))
								.then(function(){
									resolve({result:true,object:{'sspModel':sspModel,'user':user}});
								});

						}
						else{
							reject({result:false,name:'NOTFOUND',message:'User not found'});
						}
					});
		});
	};

	service.getActionRequestPayments=function(id,request){
		var maxWeeks=0;
		console.log('request is ');
		console.log(request);
		var dateInformed=request.dateInformed;
		var startDate=moment(request.startDate);
		var endDate=moment(request.endDate);
		console.log('startDate:  '+request.startDate);
		console.log('endDate:  '+request.endDate);
		var weeklyPay=88.45;
		var perDayPay=weeklyPay/7;
		var workingDaysPerWeek=5;

		return Q.Promise(function(resolve,reject){
			return candidateCommonService.getUser(id)
					.then(function(user){

						if(!user){
							reject({result:false,message:'User is not found.'});
							return;
						}
						var payFrequency=user.worker.payrollTax.payFrequency;
						var qualifyingDays=0,waitingDays=0,totalNumberOfDays;
						waitingDays=0;//TODO: work out waiting days
						var weeks=[];
						totalNumberOfDays=endDate.diff(startDate,'days')+1;
						console.log('totalNumberOfDays: '+totalNumberOfDays);
						qualifyingDays=totalNumberOfDays-waitingDays;
						console.log('qualifyingDays: '+qualifyingDays);
						var requestStartDays=startDate.clone().add(waitingDays,'days');
						console.log('requestStartDays: '+requestStartDays.toISOString());
						var weekIndex=-1;
						for(var i=0;i<totalNumberOfDays;i++){

							var dt=requestStartDays.clone().add(i,'days');
							console.log('dt: '+dt.toISOString());
							var dayOfWeek=dt.day();//0=sunday , 6=saturday
							console.log('current week index '+weekIndex);
							console.log('dayOfWeek   '+dayOfWeek);
							if(weekIndex>0){
								console.log('weeks[weekIndex-1].length    '+ weeks[weekIndex-1].days.length);	
							}
							if(maxWeeks>0 && weekIndex>(maxWeeks-1)){
								break;
							}
							
							if(weekIndex<0 || (dayOfWeek===1 && (weekIndex<=0 || weeks[weekIndex-1].days.length>0))) {
								weekIndex+=1;
								console.log('weekIndex: '+weekIndex);
							}

							weeks[weekIndex]=weeks[weekIndex]||{'days':[],amount:0,weekMonthStartDate:null,weekNumber:-1,monthNumber:-1};

							if(dayOfWeek>0 && dayOfWeek<6){
								weeks[weekIndex].days.push(utils.getDateValue(dt.toDate()));
							}

							if(weeks[weekIndex].days.length===1){
								weeks[weekIndex].weekMonthStartDate=utils.getDateValue(moment(weeks[weekIndex].days[0]).day(1).toDate());
								console.log('week start date '+weeks[weekIndex].weekMonthStartDate.toISOString());
							}
							// var nextDayOfWeek=requestStartDays.add(i+1,'days').day();

							
						}
						console.log('week calculations done');
						console.log('total weeks ');
						console.log(weeks);
						console.log('weeks[0].weekMonthStartDate.toDate()   '+weeks[0].weekMonthStartDate );
						console.log('weeks[weeks.length-1].weekMonthStartDate.toDate()    '+weeks[weeks.length-1].weekMonthStartDate);
						return applyWeekMonthNumbers(user,weeks)
						.then(function(weeks){
							resolve({result:true,objects:weeks});
						});


					});
		})
		.then(null,function(err){
			console.log('error in the code is');
			console.log(err);
		});
	};

	function applyWeekMonthNumbers(user,weeks){
		var q=db.TaxTable.find().gte('startDate',weeks[0].weekMonthStartDate).lte('startDate',weeks[weeks.length-1].weekMonthStartDate);
		console.log('query formed');
		return Q.Promise(function(resolve,reject){
			return q.exec(function(err,taxTables){
				console.log('taxTables');
				console.log(taxTables.length);
				_.forEach(weeks,function(week,idx){
					var taxTable=_.first(_.filter(taxTables,function(tbl){
						console.log('comparing dates : ');
						console.log(week.weekMonthStartDate+ '  ,  '+tbl.startDate);
						// var tblMomenentDate=moment(tbl);
						var ret= utils.areDateEqual(week.weekMonthStartDate,tbl.startDate);
						console.log(ret);
						return ret;
					}));

					if(taxTable){
						console.log('taxTable found ');
						console.log(taxTable);
						week.weekNumber=taxTable.weekNumber;
						week.monthNumber=taxTable.monthNumber;
					}

					week.amount=perDayPay * week.days.length;
				});

				resolve(weeks);
			});
		});
		

	}

	service.validateSsp=function(id,validationParams){
		var validationResult=[];
		return Q.Promise(function(resolve,reject){
			candidateCommonService.getCandidate(id)
			.then(function(user){
				if(!user){
					validationResult.push('Worker not found.');
				}	
				else {
					if(moment(validationParams.dateSickDateTo).diff(validationParms.dateSickDateFrom)<4){
						validationResult.push('Sick Note From needs to be at least 4 days, this includes Saturday and Sunday if applicable.');
						return;
					}
					var timesheetRequest={filters:{}};
					timesheetRequest.filters.worker={operator:'equals',term:id};
					return timesheetService.getTimesheets(timesheetRequest)
						.then(function(timesheets){
							if(timesheets.length<=0){
								validationResult.push('Worker has no timesheet yet.');
							}
							else{
								var payrolledTimesheets=_.find(timesheets,function(timesheet){
									return timesheet.status===enums.timesheetStatuses.Payrolled;

								});
								var payrolledWeeks=0;
								
								var periodicTimesheets;
								periodicTimesheets[enums.payFrequency.Weekly]=[];
								periodicTimesheets[enums.payFrequency.TwoWeekly]=[];
								periodicTimesheets[enums.payFrequency.FourWeekly]=[];
								periodicTimesheets[enums.payFrequency.Monthly]=[];
								

								_.forEach(payrolledTimesheets,function(timesheet){
									periodicTimesheets[timesheet.payFrequency].push(timesheet);
									
								});
								var totalPeriods=0;
								var totalAmounts=0;
								var averateAmount=0;
								_.forEach(periodicTimesheets,function(periodicTimesheet,ky){
									if(periodicTimesheet.length>0){
										var aTotalAmount=0;
										_.forEach(periodicTimesheet,function(aTimesheet){
											aTotalAmount+=aTimesheet.totalPreDeductions;
										});
										if(aTotalAmount>0){
											totalPeriods+=1;
										}
										totalAmounts+=aTotalAmount;
									}
								});

								averageAmount=totalAmounts/totalPeriods;

								if(averageAmount<8){
									validationResult.push('Need to have received payslip for at least 8 weeks.');	
								}
								else{
									var informedDaysDff=moment(validationParams.dateInformed).diff(moment(validationParams.dateSickDateFrom));

									if(informedDaysDff>7){
										validationResult.push('Need to inform 7 days of the first day of Sick note');
									}
									else{

									}
								}



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


