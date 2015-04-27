'use strict';

module.exports=function(dbs){
	var db = dbs,
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
        systemService=require('./systemservice')(db),
        userService =require('./userservice'),
        expenseService =require('./expenseservice')(db),
        agencyService =require('./agencyservice'),
        timesheetService =require('./timesheetservice')(db),
        utils=require('../utils/utils');
    var actionRequestService =require('./admin/adminActionRequestService')(db);

	var service={};

	service.getAllPayrolls = function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.Payroll.find().populate('agencies.agency');
			queryutils.applySearch(q,db.Payroll,request)
			.then(resolve,reject);
		});
	};

	service.savePayroll = function(payrollId, payroll){
		return Q.Promise(function(resolve,reject){
			if(payrollId === null){
				// Add
				var payrollModel = new db.Payroll(payroll);
				return Q.nfcall(payrollModel.save.bind(payrollModel))
				.then(function(){
						resolve(payrollModel);
					},reject);
			}else{
				// Edit
				console.log('edit');
				return service.getPayroll(payrollId)
					.then(function(payrollModel){
						utils.updateModel(payrollModel, payroll);
						return Q.nfcall(payrollModel.save.bind(payrollModel))
						.then(function(){
								resolve(payrollModel);
							},reject);
					});
			}
		});
	};

	service.getPayroll=function(id, populate){
		var q=db.Payroll.findById(id);
		if(populate){
			q.populate('agencies.agency');
		}

		return Q.nfcall(q.exec.bind(q));
	};
    
  function searchIntervals(values,target) {
    var chargedAmount =0;
    console.log(values);
    for (var i = 0; i < values.ranges.length; i++) {
      if(target>=values.ranges[i].from&&target<= values.ranges[i].to){
        chargedAmount = values.ranges[i].charged;
          if(values.minAmount > 0){
        if(chargedAmount<values.minAmount){
          chargedAmount = values.minAmount;
        }
        }
        if(values.maxAmount>0){
          if(chargedAmount>values.maxAmount){
            chargedAmount = values.maxAmount;
            console.log(chargedAmount);
          }
        }
      }
    }
    return chargedAmount;
  }

  service.runPayroll =function(payrollRequest){
    //*****expected data**** //
    //  payrollRequest = {
    //    agencyId:id,
    //    workers:[]
    // }
    //**************************//
    return Q.Promise(function(resolve,reject){
      Q.all([service.runPayrollMargin(payrollRequest),
            service.runPayrollActionRequest(payrollRequest),
            service.runPayrollExpenses(payrollRequest)]).then(function(res){
        for (var i = 0; i < payrollRequest.workers.length; i++) {
          payrollRequest.workers[i].margin = res[0].marginValue[i];
          payrollRequest.workers[i].holidayPay = res[1].holidayPay[i];
          payrollRequest.workers[i].statutoryAmount = res[1].statutoryAmount[i];
          payrollRequest.workers[i].statutoryAmountPaid = res[1].statutoryAmountPaid[i];
          payrollRequest.workers[i].expenses = res[2].tatalExpenses[i];
        }
        console.log(res);
        console.log(payrollRequest);
        service.runPayrollFinal(payrollRequest).then(function(finalRes){

          resolve(finalRes);
        },function(err){
          reject(err);
        });
      },function(err){
        reject(err);
      });      
    });
  };


  service.runPayrollMargin =function(payrollRequest){    
    //*****expected data**** //
    //  payrollRequest = {
    //    agencyId:id,
    //    workers:[]
    // }
    //**************************//
    return Q.Promise(function(resolve,reject){
      Q.all([userService.getMarginsByCandidateIds(payrollRequest.workers),
      agencyService.getAgency(payrollRequest.agencyId),
      timesheetService.getTimesheetsByCandidateId(payrollRequest.workers)])
      .then(function(res){
        var candidatesMargin = [];
        for(var m = 0; m < res[0].length; m++){
          candidatesMargin.push(res[0][m].worker.marginFee.margin);
        }
        var agencyMargin = res[1].marginFee;
        var allCandidatesTimesheets = res[2];
        var marginObject = {};
        var marginValue = [];
        var approvedTimesheets = {};
        var timesheetsUpdats = [];
        //loop for candidates
        for(var i = 0; i < candidatesMargin.length; i++){
          marginValue[i] = 0;
          approvedTimesheets = {
            totalHours:0,
            totals:0,
            count:0,
          };
          //get approved timesheets
          // loop fortimesheets
          for (var j = 0; j < allCandidatesTimesheets[i].length; j++) {
            if(allCandidatesTimesheets[i][j].status === 'approved'){
              timesheetsUpdats.push({_id:allCandidatesTimesheets[i][j]._id,status:'payrolled'});
              approvedTimesheets.count ++;
              approvedTimesheets.totals += allCandidatesTimesheets[i][j].total;
              //loop  for elements in timesheets
              for (var k = 0; k < allCandidatesTimesheets[i][j].elements.length; k++) {
                approvedTimesheets.totalHours += allCandidatesTimesheets[i][j].elements[k].units;
              }
            }
          }

          //**define the margin object will be from the candidate or the agency**//
          if(candidatesMargin[i].marginRule === 'candidate'){
            marginObject = candidatesMargin[i];
          }else{
            marginObject = agencyMargin;
          }
          //****////****////****////****////****////****////****////****////****////****//

          //**get the margin value**//
          if(marginObject.marginType === 'fixedFee'){
            marginValue[i] = marginObject.fixedFee;
          }else if(marginObject.marginType ==='percentageOfTimesheets'){
            marginValue[i] = searchIntervals(marginObject.percentageOfTimesheets,approvedTimesheets.totals);
          }else if (marginObject.marginType ==='totalHours'){
            marginValue[i] = searchIntervals(marginObject.totalHours,approvedTimesheets.totals);
          }else if(marginObject.marginType === 'fixedOnTimesheets'){
            marginValue[i] = approvedTimesheets.count * marginObject.fixedOnTimesheets;
          }
          //****////****////****////****////****////****////****////****////****////****//
        }
        console.log('%%%%%%%%%%%1');
        timesheetService.updateTimesheets(timesheetsUpdats).then(function(){
          console.log('%%%%%%%%%%%2');
          resolve({marginValue:marginValue});
        },function(err){
          console.log('%%%%%%%%%%%3');
          console.log(err);
        });
      },function(err){
        reject(err);
      });
    });
  };


  service.runPayrollActionRequest =function(payrollRequest){
    //*****expected data**** //
    //  payrollRequest = {
    //    agencyId:id,
    //    workers:[]
    // }
    //**************************//
    return Q.Promise(function(resolve,reject){
      if(payrollRequest.workers.length === 0){
        resolve(0);
      } 
      var holidayPay = [];
      var statutoryAmount = [];
      var statutoryAmountPaid = [];
      console.log('**start');
      Q.all([actionRequestService.getActionRequestByCandidatesIds(payrollRequest.workers)])
      .then(function(res){
        // var promisArray = [];
        for (var i = 0; i < res[0].length; i++) {
          holidayPay[i] = 0;
          statutoryAmount[i] = 0;
          statutoryAmountPaid[i] = 0;

          for (var j = 0; j < res[0][i].length; j++) {
            if(res[0][i][j].type === 'holidaypay' && res[0][i][j].status === 'approved'){
              holidayPay[i] += res[0][i][j].holidayPay.amount;
            }else{
              for(var k =0; k < res[0][i][j].days.length; k++){
                statutoryAmount[i] += res[0][i][j].days[k].amount;
                statutoryAmountPaid[i] += res[0][i][j].days[k].amountPaid;
              }
            }
          }
        }
        // console.log(holidayPay);
        resolve({holidayPay:holidayPay,statutoryAmount:statutoryAmount,statutoryAmountPaid:statutoryAmountPaid});
      },function(err){
        reject(err);
      });
    });
  };



  service.runPayrollExpenses =function(payrollRequest){
    //*****expected data**** //
    //  payrollRequest = {
    //    agencyId:id,
    //    workers:[]
    // }
    //**************************//
    return Q.Promise(function(resolve,reject){
      if(payrollRequest.workers.length === 0){
        resolve(0);
      }    
      Q.all([expenseService.getExpensesByCandidatesIds(payrollRequest.workers)])
      .then(function(res){
        var promisArray = [];
        console.log(res[0][0].length);
        var allUsersExpenses = res[0];
        var tatalExpenses = [];
        // users loop
        for(var i = 0; i < allUsersExpenses.length; i++){
          // claims loop
          tatalExpenses[i] = 0;
          for(var j = 0; j < allUsersExpenses[i].length; j++){
            // days loop
            for(var k = 0; k < allUsersExpenses[i][j].days.length; k++){
              // expenses loop
              for(var m = 0; m < allUsersExpenses[i][j].days[k].expenses.length; m++){
                console.log('***********'+allUsersExpenses[i][j].days[k].expenses.length);
                if(allUsersExpenses[i][j].days[k].expenses[m].status === 'ready to payroll'){
                  console.log('!!!!!!!!!!')
                  console.log(allUsersExpenses[i][j].days[k].expenses[m]);
                  tatalExpenses[i] += allUsersExpenses[i][j].days[k].expenses[m].total;
                  allUsersExpenses[i][j].days[k].expenses[m].status = 'payrolled';
                }
              }
            }
            promisArray.push(Q.nfcall(allUsersExpenses[i][j].save.bind(allUsersExpenses[i][j])));
          }
        }
        Q.all(promisArray).then(function(){
          console.log('##############')
          resolve({tatalExpenses:tatalExpenses});
        },function(err){
          reject(err);
        });
      },function(err){
        reject(err);
      });
    });
  };



    service.runPayrollFinal=function(payrollRequest) {
        var logs=[];    
        log('Starting a payroll run!',logs);
        console.log('*********************');
        console.log(payrollRequest);
        console.log('*********************');
        var today = new Date();
        
        return Q.Promise(function(resolve,reject){
            // Get the system
          return systemService.getSystem()
          .then(function(system) {
              
              log('Retrieved system record',logs);
              
              // Get the NI threshold
              var employersNiThreshold = getStatutoryValue('employersNiThreshold',system);
              var employersNiRate = getStatutoryValue('employersNiRate',system);
              var employeesNiRate = getStatutoryValue('employeesNiRate',system);
              var employeesHighEarnerNiRates = getStatutoryValue('employeesHighEarnerNiRate',system);
              var incomeTaxHigherRateThreshold = getStatutoryValue('incomeTaxHigherRateThreshold',system);
              var incomeTaxAdditionalRateThreshold = getStatutoryValue('incomeTaxAdditionalRateThreshold',system);
              var incomeTaxBasicRate = getStatutoryValue('incomeTaxBasicRate',system);
              var incomeTaxHigherRate = getStatutoryValue('incomeTaxHigherRate',system);
              var incomeTaxAdditionalRate = getStatutoryValue('incomeTaxAdditionalRate',system);
              
              var statutoryValuesOK = false;
                  
              if(employersNiThreshold) {
                  if(employersNiRate) {
                      if(employeesNiRate) {
                          if(employeesHighEarnerNiRates) {
                              if(incomeTaxHigherRateThreshold) {
                                  if(incomeTaxAdditionalRateThreshold) {
                                      if(incomeTaxBasicRate) {
                                          if(incomeTaxHigherRate) {
                                              if(incomeTaxAdditionalRate) {
                                                  statutoryValuesOK = true;
                                              }
                                              else {
                                                  log('Cannot progress as Income Tax Additional Rate not set',logs);
                                              }
                                          }
                                          else {
                                              log('Cannot progress as Income Tax Higher Rate not set',logs);
                                          }
                                      }
                                      else {
                                          log('Cannot progress as Income Tax Basic Rate not set',logs);
                                      }
                                  }
                                  else {
                                      log('Cannot progress as Income Tax Additional Rate Threshold not set',logs);
                                  }
                              }
                              else {
                                  log('Cannot progress as Income Tax Higher Rate Threshold not set',logs);
                              }
                          }
                          else {
                              log('Cannot progress as Employees High Earner NI Rate not set',logs);
                          }
                      }
                      else {
                          log('Cannot progress as Employees NI Rate not set',logs);
                      }
                  }
                  else {
                      log('Cannot progress as Employers NI Rate not set',logs);
                  }
              }
              else {
                  log('Cannot progress as Employers NI Threshold not set',logs);
              }
              
              if(statutoryValuesOK) {
                  console.log(payrollRequest.payFrequency);
                  console.log('------------------------------------------------------------');
                  console.log(payrollRequest);
                  // payrollRequest.payFrequency='weekly';
                  return db.Payroll.findOne({ isCurrent: true, periodType: payrollRequest.payFrequency }).exec()
                  .then(function(payroll) {

                      if(payroll) {

                          log('Retrieved payroll record',logs);
                          log('Payroll week number '+payroll.weekNumber,logs);
                          var promises= new Q(true);

                          payrollRequest.workers.forEach(function(worker){

                             
                             promises=promises.then(function(){
                                    log('On Worker: ' + worker._id,logs);
                                    return db.User.findById(worker._id).exec().then(function(_worker) {
                                       if(_worker){
                                          log('Retrieved worker record',logs);
                                          var workerPayrollTax=_worker.worker.payrollTax||{};

                                         // Get the worker's age
                                         var diff = today-worker.birthDate;
                                         var age = Math.floor(diff/31536000000);

                                         var nmw = 0;

                                         //region Get the NMW for this worker's age
                                         if(system.statutoryTables.nmw){
                                             var currentDate = new Date();//console.log(currentDate);
                                             system.statutoryTables.nmw.forEach(function(_value) {
                                                 //console.log(_value);
                                                 if(currentDate >= _value.validFrom && currentDate <= _value.validTo && _value.ageLower<age && _value.ageUpper>age) {
                                                     nmw = _value.amount;
                                                 }
                                             });
                                         }
                                         if(nmw===0) {
                                             // TODO take this out as it should always be set
                                             log('No NMW found for this date and age so using a default',logs);

                                             nmw = 6.50;
                                         }

                                         log('NMW: ' + nmw,logs);
                                         return db.PayrollWorkerYTD.findOne({ worker: worker._id }).exec()
                                            .then(function(payrollWorkerYTD) {
                                                    
                                                    

                                                              var timesheetPromises= new Q(true);

                                                              var totalHours = 0;
                                                              var totalPay = 0;
                                                              var totalEffectiveEarnings = 0;
                                                              var totalHolidayPay = worker.holidayPay;
                                                    log('Retreived Payroll YTD record',logs);

                                                     payrollWorkerYTD = payrollWorkerYTD||new db.PayrollWorkerYTD( {
                                                         taxableEarnings: 0,
                                                         taxPaid: 0
                                                     });
                                                  
                                                     // TODO - Change status to receipted

                                                     log('Looking up Worker ID: ' + worker._id,logs);

                                                     // status: 'submitted' , 
                                                     // Get all the timesheets for this worker that are status of receipted
                                                     return db.Timesheet.find( { worker: worker._id.toString() , status: 'receipted' } )
                                                      .exec().then(function(timesheets) {
                                                          if(timesheets) {

                                                               

                                                               timesheets.forEach(function(timesheet) {
                                                                    timesheetPromises=timesheetPromises.then(function(){
                                                                        log('Found timesheet: ' + timesheet,logs);

                                                                         var _payrollProduct;
                                                                         // Get the payroll product
                                                                         _worker.worker.payrollProduct.forEach(function(payrollProduct) {
                                                                             log('Payroll Product Agency: ' + payrollProduct.agency,logs);
                                                                             log('Timesheet Agency: ' + timesheet.agency,logs);

                                                                             if(payrollProduct.agency.toString()===timesheet.agency.toString()) {
                                                                                 _payrollProduct=payrollProduct;
                                                                             }
                                                                         });

                                                                         var timesheetElementIndex = 0;
                                                                         timesheet.elements.forEach(function(element) {

                                                                             var holidayPay = 0;

                                                                             log('Found timesheet element: ' + element,logs);

                                                                             //region Daily or Hourly
                                                                             if(element.paymentRate.rateType==='Daily' || element.paymentRate.rateType==='Hourly') {

                                                                                 log('It is a ' + element.paymentRate.rateType + ' element',logs);

                                                                                 var hours = 0,
                                                                                     pay = 0;

                                                                                 if(element.paymentRate.rateType==='Daily') {
                                                                                     hours = element.units*element.paymentRate.hours;
                                                                                 }
                                                                                 else {
                                                                                     hours = element.units;
                                                                                 }

                                                                                 // Work out the effective earnings based on hours * NMW
                                                                                 var effectiveEarnings = hours*nmw;
                                                                                 timesheet.elements[timesheetElementIndex].effectiveEarnings = effectiveEarnings;
                                                                                 totalEffectiveEarnings+=effectiveEarnings;
                                                                                 log('Effective earnings: ' + effectiveEarnings,logs);

                                                                                 pay = element.units*element.payRate;
                                                                                 log('Adding ' + pay + ' of pay from this element',logs);
                                                                                 totalPay+=pay;

                                                                                 log('Adding ' + hours + ' hours from this element',logs);
                                                                                 totalHours+=hours;

                                                                                 log('Now the total hours for this worker are: ' + totalHours,logs);

                                                                                 //region Holiday pay

                                                                                 // Rolled up or retained but on Total Pay
                                                                                 if(_payrollProduct.holidayPayRule==='2' || _payrollProduct.holidayPayRule==='4') {
                                                                                     log('Rolled up or retained but on Total Pay',logs);

                                                                                     holidayPay = (_payrollProduct.holidayPayDays/260)*pay;
                                                                                     if(isNaN(holidayPay)) { holidayPay = 0; }
                                                                                     log('Holiday pay: ' + holidayPay,logs);

                                                                                     timesheet.elements[timesheetElementIndex].holidayPay.onActual = holidayPay;
                                                                                     totalHolidayPay+=holidayPay;
                                                                                 }
                                                                                 // Rolled up or retained on NMW
                                                                                 if(_payrollProduct.holidayPayRule==='1' || _payrollProduct.holidayPayRule==='3') {
                                                                                     log('Rolled up or retained on NMW',logs);                                                                   

                                                                                     holidayPay = (_payrollProduct.holidayPayDays/(260-_payrollProduct.holidayPayDays))*effectiveEarnings;
                                                                                     if(isNaN(holidayPay)) { holidayPay = 0; }
                                                                                     log('Holiday pay: ' + holidayPay,logs);

                                                                                     timesheet.elements[timesheetElementIndex].holidayPay.onNMW = holidayPay;
                                                                                     totalHolidayPay+=holidayPay;
                                                                                 }

                                                                                 //endregion
                                                                             }
                                                                             //endregion

                                                                             //region It's a Holiday timesheet entry
                                                                             if(element.paymentRate.rateType==='Holiday') {
                                                                                 log('It is a holiday element',logs);

                                                                                 holidayPay = element.units*element.payRate;
                                                                                 if(isNaN(holidayPay)) { holidayPay = 0; }
                                                                                 log('Holiday pay: ' + holidayPay,logs);

                                                                                 totalHolidayPay+=holidayPay;

                                                                                 totalPay+=holidayPay;

                                                                                 // Rolled up or retained but on Total Pay
                                                                                 if(_payrollProduct.holidayPayRule==='2' || _payrollProduct.holidayPayRule==='4') {
                                                                                     timesheet.elements[timesheetElementIndex].holidayPay.onActual = holidayPay;
                                                                                 }
                                                                                 // Rolled up or retained on NMW
                                                                                 if(_payrollProduct.holidayPayRule==='1' || _payrollProduct.holidayPayRule==='3') {
                                                                                     timesheet.elements[timesheetElementIndex].holidayPay.onNMW = holidayPay;
                                                                                 }
                                                                             }
                                                                             //endregion

                                                                             log('After this element Total Effective Earnings are: ' + totalEffectiveEarnings,logs);
                                                                             log('After this element Total Pay is: ' + totalPay,logs);
                                                                             log('After this element Total Holiday Pay is: ' + totalHolidayPay,logs);
                                                                           });

                                                                          log('saving timesheet',logs);
                                                                          // throw {message:'just a test'};
                                                                          // return true;
                                                                          return Q.nfcall(timesheet.save.bind(timesheet));
                                                                    });

                                                                   //region Earnings

                                                                   

                                                                    
//region Earnings
                                                                }, reject);

                                                              return timesheetPromises;
                                                          }
                                                          else {
                                                             log('No timesheets so stopping!', logs);
                                                             
                                                          }

                                                      }).then(function(){
                                                          log('saving payrollworkerYTD');
                                                          timesheetPromises = timesheetPromises.then(function () {
                                                              var employersNiOnNmw = 0;

                                                              if (totalEffectiveEarnings >= employersNiThreshold.amount) {
                                                                  employersNiOnNmw = ((totalEffectiveEarnings - employersNiThreshold.amount) / 100) * employersNiRate.amount;
                                                                  log('Employers NI on NMW: ' + employersNiOnNmw, logs);
                                                              }

                                                              var actualNMW = totalEffectiveEarnings + employersNiOnNmw;
                                                              log('Actual NMW: ' + actualNMW, logs);

                                                              //endregion

                                                              //region Holiday Pay Deducted (retained or rolled up)

                                                              var totalPayForNMW = totalPay - totalHolidayPay;
                                                              log('Total pay for NMW: ' + totalPayForNMW, logs);

                                                              //endregion

                                                              //region TODO: Holiday Pay Taken
                                                              console.log('%%%%%%%%%%%%%%$$$$$$$$$$$$##################@@@@@@@@@@@@@')
                                                              var totalHolidayPayTaken = 0;

                                                              if (totalHolidayPayTaken > _worker.worker.payrollValues.holidayPayRetained) {
                                                                  log('SERIOUS PROBLEM: Holiday Pay requested to be taken is under the amount retained. Requested: ' + totalHolidayPayTaken + ' and only ' + _worker.worker.payrollValues.holidayPayRetained + ' retained', logs);
                                                                  totalHolidayPayTaken = _worker.worker.payrollValues.holidayPayRetained;
                                                              }

                                                              log('Holiday pay taken: ' + totalHolidayPayTaken, logs);

                                                              //endregion

                                                              // NMW Verification
                                                              if (totalPay + totalHolidayPayTaken > actualNMW) {

                                                                  //region Margin

                                                                  var margin = worker.margin;

                                                                  log('Margin: ' + margin, logs);

                                                                  //endregion

                                                                  var totalPayAfterHPandMargin = totalPay - margin;
                                                                  log('Total pay after HP and Margin: ' + totalPayAfterHPandMargin, logs);

                                                                  //region Expenses

                                                                  var capacityForExpenses = totalPayAfterHPandMargin - actualNMW;
                                                                  log('Capacity for expenses: ' + capacityForExpenses, logs);

                                                                  var totalExpenses = 0;
                                                                  log('Total expenses available to use: ' + _worker.worker.currentExpensesToUse, logs);

                                                                  if (_worker.worker.currentExpensesToUse > capacityForExpenses) {
                                                                      totalExpenses = capacityForExpenses;
                                                                      log('Plenty of expenses available so going for full capacity', logs);
                                                                  }
                                                                  else { // Use it all
                                                                      totalExpenses = _worker.worker.currentExpensesToUse;
                                                                      log('Not enough expenses so using all there is', logs);
                                                                  }

                                                                  log('Expenses used: ' + totalExpenses, logs);

                                                                  // Remove the amount we used off the worker
                                                                  _worker.worker.currentExpensesToUse = _worker.worker.currentExpensesToUse - totalExpenses;

                                                                  //endregion

                                                                  //region Summary before taxes and NI

                                                                  log('SUMMARY BEFORE TAXES AND NI', logs);
                                                                  log('Gross pay: ' + totalPay, logs);
                                                                  log('Holiday pay accrued: ' + totalHolidayPay, logs);
                                                                  log('Holiday pay taken: ' + totalHolidayPayTaken, logs);
                                                                  log('Margin: ' + margin, logs);
                                                                  log('Expenses allowed: ' + totalExpenses, logs);

                                                                  var payForTaxesAndNI = totalPay - totalHolidayPay + totalHolidayPayTaken - margin - totalExpenses;

                                                                  log('Pay available for taxes and NI: ' + payForTaxesAndNI, logs);

                                                                  //endregion

                                                                  //region Employers NI

                                                                  var employersNI = 0;


                                                                  if (payForTaxesAndNI > employersNiThreshold.amount) {
                                                                      employersNI = (payForTaxesAndNI - employersNiThreshold.amount) * (employersNiRate.amount / (100 + employersNiRate.amount));
                                                                      log('Pay under Employers NI Threshold so none due', logs);
                                                                  }

                                                                  log('Employers NI: ' + employersNI, logs);

                                                                  //endregion

                                                                  //region Employees NI

                                                                  var paySubjectToEmployeesNIandTax = payForTaxesAndNI - employersNI;

                                                                  log('Pay subject to Employees NI: ' + paySubjectToEmployeesNIandTax, logs);

                                                                  var employeesNI = 0;

                                                                  if (_worker.worker.taxDetail.employeesNIpaid) {
                                                                      // Main NI (12% in Feb 2015)
                                                                      var mainNI = 0;
                                                                      if (paySubjectToEmployeesNIandTax > employeesNiRate.lowerThreshold) {
                                                                          if (paySubjectToEmployeesNIandTax > employeesNiRate.upperThreshold) {
                                                                              mainNI = employeesNiRate.upperThreshold - employeesNiRate.lowerThreshold;
                                                                          }
                                                                          else {
                                                                              mainNI = paySubjectToEmployeesNIandTax - employeesNiRate.lowerThreshold;
                                                                          }

                                                                          mainNI = (mainNI / 100) * employeesNiRate.amount;
                                                                      }
                                                                      log('Main NI: ' + mainNI, logs);

                                                                      // High earners NI (2% in Feb 2015)
                                                                      var highEarnerNI = 0;
                                                                      if (paySubjectToEmployeesNIandTax > employeesHighEarnerNiRates.lowerThreshold) {
                                                                          highEarnerNI = ((paySubjectToEmployeesNIandTax - employeesHighEarnerNiRates.lowerThreshold) / 100) * employeesHighEarnerNiRates.amount;
                                                                      }
                                                                      log('High earner NI: ' + highEarnerNI, logs);

                                                                      employeesNI = mainNI + highEarnerNI;
                                                                      log('Employees NI: ' + employeesNI, logs);
                                                                  }
                                                                  else {
                                                                      log('This worker does not have to pay Employees NI', logs);
                                                                  }

                                                                  //endregion

                                                                  //region Income Tax

                                                                  var taxCode = '',
                                                                      taxCodeUpper = '';

                                                                  taxCodeUpper = _worker.worker.payrollTax.taxCode.toUpperCase();

                                                                  //region Get Tax Code letter

                                                                  log('Tax code upper case: ' + taxCodeUpper, logs);

                                                                  if (taxCodeUpper.indexOf('L') > -1) { taxCode = 'L'; }
                                                                  else if (taxCodeUpper.indexOf('P') > -1) { taxCode = 'P'; }
                                                                  else if (taxCodeUpper.indexOf('Y') > -1) { taxCode = 'Y'; }
                                                                  else if (taxCodeUpper.indexOf('0T') > -1) { taxCode = '0T'; }
                                                                  else if (taxCodeUpper.indexOf('T') > -1) { taxCode = 'T'; }
                                                                  else if (taxCodeUpper.indexOf('BR') > -1) { taxCode = 'BR'; }
                                                                  else if (taxCodeUpper.indexOf('D0') > -1) { taxCode = 'D0'; }
                                                                  else if (taxCodeUpper.indexOf('D1') > -1) { taxCode = 'D1'; }
                                                                  else if (taxCodeUpper.indexOf('NT') > -1) { taxCode = 'NT'; }

                                                                  log('Tax code minus numbers: ' + taxCode, logs);

                                                                  //endregion

                                                                  //region Get Tax Code number

                                                                  var taxCodeNumber = parseInt(taxCodeUpper.substring(0, taxCodeUpper.indexOf(taxCode)));

                                                                  log('Tax code number: ' + taxCodeNumber, logs);

                                                                  //endregion

                                                                  //region Get YTD basic, higher and additional

                                                                  var basicRateYTD = (incomeTaxHigherRateThreshold.amount * payroll.weekNumber) / 52;
                                                                  log('Basic rate YTD: ' + basicRateYTD, logs);

                                                                  var higherRateYTD = (incomeTaxAdditionalRateThreshold.amount * payroll.weekNumber) / 52;
                                                                  log('Higher rate YTD: ' + higherRateYTD, logs);

                                                                  var additionalRateYTD = higherRateYTD;
                                                                  log('Additional rate YTD: ' + additionalRateYTD, logs);

                                                                  //endregion

                                                                  var taxableEarningsYTD = workerPayrollTax.p45GrossTax + payrollWorkerYTD.taxableEarnings + paySubjectToEmployeesNIandTax;
                                                                  log('Taxable earnings YTD inc this week: ' + taxableEarningsYTD, logs);
                                                                  log('Taxable earnings YTD P45: ' + workerPayrollTax.p45GrossTax, logs);

                                                                  var taxInPeriod = 0,
                                                                      availableTaxFreeAllowanceIncThisWeek = 0,
                                                                      earningsYTDsubjectToTax = 0,
                                                                      higherTax = 0,
                                                                      additionalTax = 0;

                                                                  switch (taxCode) {
                                                                      case 'L':
                                                                      case 'P':
                                                                      case 'T':
                                                                      case 'Y':
                                                                      case 'V':

                                                                          availableTaxFreeAllowanceIncThisWeek = ((taxCodeNumber * 10) + 9) * (payroll.weekNumber / 52);

                                                                          log('Available tax free allowance inc this week: ' + availableTaxFreeAllowanceIncThisWeek, logs);

                                                                          earningsYTDsubjectToTax = taxableEarningsYTD - availableTaxFreeAllowanceIncThisWeek;
                                                                          log('Earnings YTD subject to tax: ' + earningsYTDsubjectToTax, logs);

                                                                          break;
                                                                      case 'D0':

                                                                          higherTax = earningsYTDsubjectToTax * incomeTaxHigherRate.amount;
                                                                          log('Higher tax: ' + higherTax, logs);

                                                                          taxInPeriod = higherTax - payrollWorkerYTD.taxPaid;

                                                                          break;
                                                                      case 'D1':

                                                                          additionalTax = earningsYTDsubjectToTax * incomeTaxAdditionalRate.amount;
                                                                          log('Additional tax: ' + additionalTax, logs);

                                                                          taxInPeriod = additionalTax - payrollWorkerYTD.taxPaid;

                                                                          break;

                                                                      case 'K':

                                                                          availableTaxFreeAllowanceIncThisWeek = -((taxCodeNumber * 10) - 9) * (payroll.weekNumber / 52);
                                                                          log('Available tax free allowance incl this week: ' + availableTaxFreeAllowanceIncThisWeek, logs);

                                                                          earningsYTDsubjectToTax = taxableEarningsYTD - availableTaxFreeAllowanceIncThisWeek;
                                                                          log('Earnings YTD subject to tax: ' + earningsYTDsubjectToTax, logs);

                                                                          break;

                                                                      case 'BR':

                                                                          break;
                                                                  }

                                                                  switch (taxCode) {
                                                                      case 'L':
                                                                      case 'P':
                                                                      case 'T':
                                                                      case 'Y':
                                                                      case 'V':
                                                                      case 'K':

                                                                          var basicAmountToTax = (earningsYTDsubjectToTax > basicRateYTD ? basicRateYTD : earningsYTDsubjectToTax);
                                                                          log('Basic amount to tax: ' + basicAmountToTax, logs);

                                                                          var basicTax = (basicAmountToTax * incomeTaxBasicRate.amount) / 100;
                                                                          log('Basic tax: ' + basicTax, logs);

                                                                          var higherRateLowerLimit = (earningsYTDsubjectToTax > basicRateYTD ? basicRateYTD : 0);
                                                                          log('Higher rate lower limit: ' + higherRateLowerLimit, logs);

                                                                          var higherRateUpperLimit = (earningsYTDsubjectToTax > higherRateYTD ? higherRateYTD : earningsYTDsubjectToTax);
                                                                          log('Higher rate upper limit: ' + higherRateUpperLimit, logs);

                                                                          higherTax = (higherRateLowerLimit > 0 ? ((higherRateUpperLimit - higherRateLowerLimit) * incomeTaxHigherRate.amount) / 100 : 0);
                                                                          log('Higher tax: ' + higherTax, logs);

                                                                          var additionalAmountToTax = (earningsYTDsubjectToTax > additionalRateYTD ? earningsYTDsubjectToTax - additionalRateYTD : 0);
                                                                          log('Additional amount to tax: ' + additionalAmountToTax, logs);

                                                                          additionalTax = (additionalAmountToTax * incomeTaxAdditionalRate.amount) / 100;
                                                                          log('Additional tax: ' + additionalTax, logs);

                                                                          var taxYTD = basicTax + higherTax + additionalTax;
                                                                          log('Tax YTD: ' + taxYTD, logs);

                                                                          log('Tax already paid YTP: ' + payrollWorkerYTD.taxPaid, logs);

                                                                          taxInPeriod = taxYTD - payrollWorkerYTD.taxPaid;
                                                                          log('Tax in period: ' + taxInPeriod, logs);

                                                                          break;

                                                                  }

                                                                  //endregion
                                                              }
                                                              else {
                                                                  log('SERIOUS PROBLEM: Under NMW. It is ' + totalPay + totalHolidayPayTaken + ' which is not more than ' + actualNMW, logs);

                                                              }


                                                          });
                                                           // return true;
                                                           return Q.nfcall(payrollWorkerYTD.save.bind(payrollWorkerYTD));
                                                          
                                                      });
                                                
                                            });
                                       }
                                       else{
                                          // log('Worker not found');
                                          throw {name:'InvalidData',message:'Worker not found ' + worker._id};
                                       }
                                   
                                   });
                             });
                             
                         });
                          return promises;

                      }
                      else {
                          // log('Payroll record not found');
                          throw {name:'InvalidData',message:'Payroll record not found'};
                      }
                  });

              }
              else {
                  // log('Statutory values not OK so bailing out',logs);
                  throw {name:'InvalidData',message:'Statutory values not OK so bailing out'};
              }
              
          })
          .then(function(){
            logs.push('Success.......');
              resolve({result:true,logs:logs});
          },function(err){
            
              logs.push(err.message);
            
              resolve({result:false,logs:logs,error:err});
            
          });
        });
    };
        
        function getStatutoryValue(name,system) {
            
        //    log('Looking for Statutory Value: ' + name);
            
            var currentDate = new Date();
            var returnValue;
            if(system.statutoryTables[name]){
               system.statutoryTables[name].forEach(function(_value){
              //     console.log(_value);
                   
                   if(currentDate >= _value.validFrom && currentDate <= _value.validTo) {
                //       log('Found it!');
                       returnValue = _value;
                       return false;
                   }
               });
               return returnValue;
            } 
            else {
                //log('Cannot find this value!');
                return;
            }
        }
    
    function log(message,logs) {
        console.log(message);
        if(logs){
          logs.push(message);
        }
    }
    
	return service;
};