'use strict';

module.exports=function(dbs){
	var db=dbs;
	var Q=require('q');
	// var candidateService=require('../candidateservice')(db);
	var candidateCommonService=require('../candidatecommonservice')(db);
	var timesheetService=require('../timesheetservice')(db);
	var payrollService=require('../payrollservice')(db);
	var systemService=require('../systemservice')(db);
	var enums=require('../../utils/enums');
	var _=require('lodash');
	var service={};
	var utils=require('../../utils/utils');

	var moment=require('moment');

	service.saveActionRequest=function(userId,details){

		return Q.Promise(function(resolve,reject){
			return candidateCommonService.getUser(userId)
					.then(function(user){
						if(user){
							var actionRequestModel=new db.ActionRequest(details);
							return Q.nfcall(actionRequestModel.save.bind(actionRequestModel))
								.then(function(){
									resolve({result:true,object:{'actionRequestModel':actionRequestModel,'user':user}});
								});

						}
						else{
							reject({result:false,name:'NOTFOUND',message:'User not found'});
						}
					});
		});
	};

	service.updateActionRequest=function(id,details,status){
		return Q.Promise(function(resolve,reject){
			return service.getActionRequest(id)
				.then(function(actionRequest){
					if(actionRequest){
						actionRequest=utils.updateSubModel(actionRequest,details);
						actionRequest['status']=status?status.toLowerCase():actionRequest['status'];

						return Q.nfcall(actionRequest.save.bind(actionRequest));
					}
					else{
						reject({result:false,name:'NOTFOUND',message:'Previous Action request not found'});
					}
				});
		});
	}

	service.getActionRequest=function(id){
		return db.ActionRequest.findById(id).exec();
	};

	service.getActionRequestPayments=function(id,request,payType){
		console.log('request is ');
		console.log(request);

		return Q.Promise(function(resolve,reject){
			return Q.all([candidateCommonService.getUser(id),systemService.getSystem()])
					.spread(function(user,system){

						if(!user){
							reject({result:false,message:'User is not found.'});
							return;
						}



						var options={periodicPay:0};
						var currentRate;

						if(payType==='ssp'){

              				console.log('here');
							var currentRate=utils.getStatutoryValue('sspRate',system,new Date());

							options.periodicPay=currentRate?currentRate.amount:0;
						}
						else if(payType==='smp'){
							console.log(payType);
							console.log('smp');

							currentRate=utils.getStatutoryValue('smpRate',system,new Date());
							options.periodicPay=currentRate?currentRate.amount:0;
						}
						else if(payType==='spp'){


							currentRate=utils.getStatutoryValue('sppRate',system,new Date());
							options.periodicPay=currentRate?currentRate.amount:0;
						}

					/*	console.log('----currentRate----');
						console.log(currentRate);*/

						return calculatePayPeriods(user,request,options)
							.then(function(response){
								console.log('week calculations done');
								if(!response.result){
									reject(response);
									return false;
								}
								var records=response.objects;

							/*	console.log('total records ');
								console.log(records);
								console.log('records[0].periodStartDate.toDate()   '+records[0].periodStartDate );
								console.log('records[records.length-1].periodStartDate.toDate()    '+records[records.length-1].periodStartDate); */
								return applyPeriodNumbers(user,records,response.options)
								.then(function(){
									resolve({result:true,objects:records});
								});
							})
							;


					})
					;
		});
	};

	function calculatePayPeriods(user,request,options){

		var maxPeriods=request.maxPeriods||0;
		console.log('max periods.... '+maxPeriods);

		// var dateInformed=request.dateInformed;

		var startDate=moment(request.startDate);
		console.log('startDate:  '+request.startDate);
		var endDate=request.endDate?moment(request.endDate):null;

		console.log('endDate:  '+request.endDate);
		var periodicPay=options.periodicPay//options.periodicPay=88.45;
		var perDayPay=periodicPay/7;
		// var workingDaysPerWeek=5;

		// var payFrequency=user.payrollTax.payFrequency||enums.payFrequency.Weekly;
		return Q.Promise(function(resolve,reject){
			var payFrequency=user.worker.payrollTax.payFrequency;
			var waitingDays=0;
			waitingDays=0;//TODO: work out waiting days
			var weeks=[];
			// totalNumberOfDays=endDate.diff(startDate,'days')+1;
			// console.log('totalNumberOfDays: '+totalNumberOfDays);

			var requestStartDays=startDate.clone().add(waitingDays,'days');
			console.log('requestStartDays: '+requestStartDays.toISOString());
			// var weekIndex=-1;
			var nextStartDate=requestStartDays.clone();
			console.log('nextStartDate '+nextStartDate.toISOString());
			var i=0;
			var totalWeeks=i;
			var maxPeriodLastDate=null;
			if(maxPeriods>0){
				maxPeriodLastDate=nextStartDate.clone().add(maxPeriods,'weeks');
			}

			while(true){
				console.log('current nextStartDate is '+nextStartDate.toISOString());
				if(maxPeriodLastDate && maxPeriodLastDate.diff(nextStartDate)<0){
					console.log('max Period '+maxPeriods  + ' exceeded');
					break;
				}
				// if(maxPeriods>0 && maxPeriods<(i+1)){
				// 	console.log('max periods '+ maxPeriods + ' Exceeded');
				// 	break;
				// }
				if(endDate && nextStartDate>endDate){
					console.log('nextStartDate '+ nextStartDate.toISOString() + ' Exceeded from endDate '+endDate.toISOString());
					break;
				}

				var thisPeriodLastDate;
				if(payFrequency===enums.payFrequency.Weekly){
					thisPeriodLastDate=nextStartDate.clone().day(5);
				}
				else{
					thisPeriodLastDate=nextStartDate.clone().endOf('month');
				}

				var thisPeriodEndDate=endDate && thisPeriodLastDate.diff(endDate,'days')>0?endDate.clone():
						maxPeriodLastDate && thisPeriodLastDate.diff(maxPeriodLastDate,'days')>0?maxPeriodLastDate.clone() 
						:thisPeriodLastDate.clone();
				var noOfDays=thisPeriodEndDate.diff(nextStartDate,'days')+1;
				console.log('noOfDays '+noOfDays);
				weeks[i]={'days':[],amount:0,periodStartDate:null,weekNumber:-1,monthNumber:-1};
				weeks[i].noOfDays=noOfDays;

				weeks[i].periodStartDate=utils.getDateValue(nextStartDate.clone().day(1).toDate());
				if(payFrequency===enums.payFrequency.Weekly){
					nextStartDate=nextStartDate.clone().add(7,'days').day(1);
				}
				else{
					nextStartDate=nextStartDate.add(1,'months').startOf('month');
				}

				
				i++;

				if(payFrequency===enums.payFrequency.Weekly){
					totalWeeks=i;
				}

			}


			_.forEach(weeks,function(week,idx){

				week.amount=perDayPay * week.noOfDays;
			});

			resolve({result:true,objects:weeks,options:{perDayPay:perDayPay}});
		});
	}


	function applyPeriodNumbers(user,records,options){
		var perDayPay=options.perDayPay;

		var q=db.TaxTable.find().gte('startDate',records[0].periodStartDate).lte('startDate',records[records.length-1].periodStartDate);
		console.log('query formed');
		return Q.Promise(function(resolve,reject){
			return q.exec(function(err,taxTables){
				console.log('taxTables');
				console.log(taxTables.length);
				_.forEach(records,function(week,idx){
					var taxTable=_.first(_.filter(taxTables,function(tbl){
						//console.log('comparing dates : ');
						//console.log(week.periodStartDate+ '  ,  '+tbl.startDate);
						// var tblMomenentDate=moment(tbl);
						var ret= utils.areDateEqual(week.periodStartDate,tbl.startDate);
						//console.log(ret);
						return ret;
					}));

					if(taxTable){
						// console.log('taxTable found ');
						// console.log(taxTable);
						week.weekNumber=taxTable.weekNumber;
						week.monthNumber=taxTable.monthNumber;
					}

					// week.amount=perDayPay * week.days.length;
				});

				resolve(records);
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

	service.getActionRequestData = function(){
		console.log('testing');
		var q=db.ActionRequest.find().populate('worker').populate('user');
	return Q.nfcall(q.exec.bind(q));
	};

	return service;
};


