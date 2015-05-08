'use strict';

module.exports=function(dbs){
	var db=dbs;
	var Q=require('q');
	// var candidateService=require('../candidateservice')(db);
	var candidateCommonService=require('../candidatecommonservice')(db);
	var timesheetService=require('../timesheetservice')(db);
	// var payrollService=require('../payrollservice')(db);
	var systemService=require('../systemservice')(db);
	var enums=require('../../utils/enums');
	var _=require('lodash');
	var service={};
	var utils=require('../../utils/utils');
	var queryutils=require('../../utils/queryutils')(db);

	var moment=require('moment');

	service.saveActionRequest=function(userId,details){
						console.log('******####11')
		return Q.Promise(function(resolve,reject){
						console.log('******####12')
			return candidateCommonService.getUser(userId)
					.then(function(user){
						console.log('******####1')

						if(user){
						console.log('******####2')

							var actionRequestModel=new db.ActionRequest(details);
							console.log('******####2')
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
		 service.getActionRequestDataById(id)
				.then(function(actionRequest){
					if(actionRequest){
						// console.log('days before update submodel ');
						// console.log(actionRequest.days);
						utils.updateSubModel(actionRequest, details,true);
						if(status!==''){
							actionRequest.status=status;
						}


						console.log('days after update submodel  ....');
						console.log(actionRequest.days);
						actionRequest.days=details.days;
						Q.nfcall(actionRequest.save.bind(actionRequest))
						.then(function(){
							console.log('after save');
							console.log(actionRequest.days);
							resolve({result:true, object:actionRequest});
						},reject);
					}
					else{
						reject({result:false,name:'NOTFOUND',message:'Previous Action request not found'});
					}
				});
		});
	}

	
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

                            console.log('ssp');
                            console.log(JSON.stringify(system));
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
						console.log('user pay frequency is ');
						console.log(user.worker.payrollTax.payFrequency);
						return calculatePayPeriods(user,request,options)
						.then(function(records){
							console.log('week calculations done');
							resolve({result:true,objects:records});
						});
					});
		});
	};

	function calculatePayPeriods(user,request,options){

		var maxPeriods=request.maxPeriods||0;
		console.log('max periods.... '+maxPeriods);
		var payFrequency = user.worker.payrollTax.payFrequency;
		console.log(payFrequency);
		// var dateInformed=request.dateInformed;
		console.log('request.startDate$$$$$$$$$$^^^^^^^^^&&&&&&&&&&');
		console.log('request.startDate');
		console.log(request);
		var startDate=moment(request.startDate);
		console.log('startDate');
		console.log(startDate);
		
		var endDate = request.endDate?moment(request.endDate):startDate.clone().add(Number(request.maxPeriods),'weeks').add(-1,'days');
		// console.log(startDate.clone().add(Number(request.maxPeriods),'weeks').add(-1,'days'));
		console.log('endDate');
		console.log(endDate);
		var periodicPay=options.periodicPay//options.periodicPay=88.45;
		var perDayPay=periodicPay/7;
		var q=db.TaxTable.find({periodType: (payFrequency === 'monthly')? 'monthly': 'weekly'}).and([{'endDate':{$gte:startDate.toDate()}},{'startDate':{$lte:endDate.toDate()}}]);
		return Q.Promise(function(resolve,reject){
			q.exec(function(err,taxTables){
				if(err){
					reject(err);
				}
				console.log(taxTables);
				var weeks = [];
				_.forEach(taxTables,function(taxTable){
					//outside the range
					var week = {};
					if(taxTable.startDate > endDate.toDate() || taxTable.endDate < startDate.toDate()){
						return;
					}
					week.year = taxTable.year;
					week.weekNumber = taxTable.weekNumber;
					week.monthNumber = taxTable.monthNumber;
					week.periodType = taxTable.periodType;
					week.amount = 0;

					var startPoint = Math.max(Date.parse(taxTable.startDate), Date.parse(startDate.toDate()));
					var endPoint = Math.min(Date.parse(taxTable.endDate), Date.parse(endDate.toDate()))	;
					// console.log('startPoint');
					// console.log(moment(startPoint).toDate());
					// console.log('endPoint');
					// console.log(moment(endPoint).toDate());
					var index = 0;
					for(var day = moment(startPoint).clone(); moment(endPoint).startOf('day').diff(day.clone().startOf('day'),'days')>=0; day.add(1,'days')){
						// continue when sunday or saturday
						if(day.day() === 0 || day.day() === 6){
							console.log(day.toDate());
							continue;
						}
						index++;
						week.amount += perDayPay;
					}
					console.log(index);
					weeks.push(week);
				});
				weeks.sort(function(a, b){return Math.max(a.weekNumber,a.monthNumber)-Math.max(b.weekNumber,b.monthNumber);});
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
								var averageAmount=0;
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

	service.getActionRequestData = function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.ActionRequest.find().populate('worker').populate('createdBy');
			queryutils.applySearch(q,db.ActionRequest,request)
				.then(resolve,reject);
		});
		
	// return Q.nfcall(q.exec.bind(q));
	};

	service.getActionRequestDataById = function(id){
		var q=db.ActionRequest.findById(id).populate('worker').populate('createdBy');
	return Q.nfcall(q.exec.bind(q));
	};


    service.getActionRequestByCandidatesIds = function(ids){
        //expected [id1,id2,...]
        var q;
        var promisArray = [];
        console.log(ids);
        ids.forEach(function(id){
          q = db.ActionRequest.find({'worker':id});
          console.log('88888888888888888');
          promisArray.push(Q.nfcall(q.exec.bind(q)));
        });
        return Q.all(promisArray);
    };

	return service;
};


