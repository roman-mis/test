'use strict';

module.exports=function(){
	var db = require('../models'),
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
        systemService=require('./systemservice')(db),
		utils=require('../utils/utils');

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
    
    service.runPayroll=function(req) {
        var logs=[];    
        log('Starting a payroll run!',logs);
        
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
                  console.log(req.body.payFrequency);
                  console.log('------------------------------------------------------------');
                  console.log(req.body);
                  req.body.payFrequency='weekly';
                  return db.Payroll.findOne({ isCurrent: true, periodType: req.body.payFrequency }).exec()
                  .then(function(payroll) {

                      if(payroll) {

                          log('Retrieved payroll record',logs);
                          var promises=Q(true);

                          req.body.workers.forEach(function(worker){

                             
                             promises=promises.then(function(){
                                    log('On Worker: ' + worker._id,logs);
                                    return db.User.findById(worker._id).exec().then(function(_worker) {
                                       if(_worker){
                                          log('Retrieved worker record',logs);

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

                                                               

                                                              var timesheetPromises=Q(true);

                                                                var totalHours = 0;
                                                               var totalPay = 0;
                                                               var totalEffectiveEarnings = 0;
                                                               var totalHolidayPay = 0;

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
                                                                          // return true;
                                                                          return Q.nfcall(timesheet.save.bind(timesheet));
                                                                    });

                                                                   //region Earnings

                                                                   timesheetPromises=timesheetPromises.then(function(){
                                                                        var employersNiOnNmw = 0;

                                                                       if(totalEffectiveEarnings>=employersNiThreshold) {
                                                                           employersNiOnNmw = ((totalEffectiveEarnings-employersNiThreshold)/100)*employersNiRate;
                                                                           log('Employers NI on NMW: ' + employersNiOnNmw,logs);
                                                                       }

                                                                       var actualNMW = totalEffectiveEarnings+employersNiOnNmw;
                                                                       log('Actual NMW: ' + actualNMW,logs);

                                                                       //endregion

                                                                       //region Holiday Pay Deducted (retained or rolled up)

                                                                       var totalPayForNMW = totalPay-totalHolidayPay;
                                                                       log('Total pay for NMW: ' + totalPayForNMW,logs);

                                                                       //endregion

                                                                       //region TODO: Holiday Pay Taken

                                                                       var totalHolidayPayTaken = 0;

                                                                       if(totalHolidayPayTaken>_worker.worker.payrollValues.holidayPayRetained) {
                                                                           log('SERIOUS PROBLEM: Holiday Pay requested to be taken is under the amount retained. Requested: ' + totalHolidayPayTaken + ' and only ' + _worker.worker.payrollValues.holidayPayRetained + ' retained', logs);
                                                                           totalHolidayPayTaken = _worker.worker.payrollValues.holidayPayRetained;
                                                                       }

                                                                       log('Holiday pay taken: ' + totalHolidayPayTaken, logs);

                                                                       //endregion

                                                                       // NMW Verification
                                                                       if(totalPay+totalHolidayPayTaken>actualNMW) {

                                                                           //region Margin

                                                                           var margin = 20;

                                                                           log('Margin: ' + margin, logs);

                                                                           //endregion

                                                                           var totalPayAfterHPandMargin = totalPay-margin;
                                                                           log('Total pay after HP and Margin: ' + totalPayAfterHPandMargin, logs);

                                                                           //region Expenses

                                                                           var capacityForExpenses = totalPayAfterHPandMargin-actualNMW;
                                                                           log('Capacity for expenses: ' + capacityForExpenses, logs);

                                                                           var totalExpenses = 0;
                                                                           log('Total expenses available to use: ' + _worker.worker.currentExpensesToUse, logs);

                                                                           if(_worker.worker.currentExpensesToUse>capacityForExpenses) {
                                                                               totalExpenses = capacityForExpenses;
                                                                               log('Plenty of expenses available so going for full capacity', logs);
                                                                           }
                                                                           else { // Use it all
                                                                               totalExpenses = _worker.worker.currentExpensesToUse;
                                                                               log('Not enough expenses so using all there is', logs);
                                                                           }

                                                                           log('Expenses used: ' + totalExpenses, logs);

                                                                           // Remove the amount we used off the worker
                                                                           _worker.worker.currentExpensesToUse=_worker.worker.currentExpensesToUse-totalExpenses;

                                                                           //endregion

                                                                           //region Summary before taxes and NI

                                                                           log('SUMMARY BEFORE TAXES AND NI', logs);
                                                                           log('Gross pay: ' + totalPay, logs);
                                                                           log('Holiday pay accrued: ' + totalHolidayPay, logs);
                                                                           log('Holiday pay taken: ' + totalHolidayPayTaken, logs);
                                                                           log('Margin: ' + margin, logs);
                                                                           log('Expenses allowed: ' + totalExpenses, logs);

                                                                           var payForTaxesAndNI = totalPay + totalHolidayPay + totalHolidayPayTaken + margin + totalExpenses;

                                                                           log('Pay available for taxes and NI: ' + payForTaxesAndNI, logs);

                                                                           //endregion

                                                                           //region Employers NI

                                                                           var employersNI = 0;

                                                                           if(payForTaxesAndNI>employersNiThreshold) {
                                                                               employersNI = (payForTaxesAndNI-employersNI) * (employersNiRate/(1+employersNiRate));
                                                                               log('Pay under Employers NI Threshold so none due', logs);
                                                                           }

                                                                           log('Employers NI: ' + employersNI, logs);

                                                                           //endregion

                                                                           //region Employees NI

                                                                           var paySubjectToEmployeesNI = payForTaxesAndNI+employersNI;

                                                                           log('Pay subject to Employees NI: ' + paySubjectToEmployeesNI, logs);

                                                                           var employeesNI = 0;

                                                                           if(_worker.worker.taxDetail.employeesNIpaid) {
                                                                               // Main NI (12% in Feb 2015)
                                                                               var mainNI = 0;
                                                                               if(paySubjectToEmployeesNI>employeesNiRate.lowerThreshold) {
                                                                                   if(paySubjectToEmployeesNI>employeesNiRate.upperThreshold) {
                                                                                       mainNI = employeesNiRate.upperThreshold-employeesNiRate.lowerThreshold;
                                                                                   }
                                                                                   else {
                                                                                       mainNI = paySubjectToEmployeesNI-employeesNiRate.lowerThreshold;
                                                                                   }

                                                                                   mainNI = (mainNI/100)*employeesNiRate.amount;
                                                                               }
                                                                               log('Main NI: ' + mainNI, logs);

                                                                               // High earners NI (2% in Feb 2015)
                                                                               var highEarnerNI = 0;
                                                                               if(paySubjectToEmployeesNI>employeesHighEarnerNiRates.lowerThreshold) {
                                                                                   highEarnerNI = ((paySubjectToEmployeesNI-employeesHighEarnerNiRates.lowerThreshold)/100)*employeesHighEarnerNiRates.amount;
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

                                                                           if(taxCodeUpper.indexOf('L')>-1) { taxCode = 'L'; }
                                                                           else if(taxCodeUpper.indexOf('P')>-1) { taxCode = 'P'; }
                                                                           else if(taxCodeUpper.indexOf('Y')>-1) { taxCode = 'Y'; }
                                                                           else if(taxCodeUpper.indexOf('0T')>-1) { taxCode = '0T'; }
                                                                           else if(taxCodeUpper.indexOf('T')>-1) { taxCode = 'T'; }
                                                                           else if(taxCodeUpper.indexOf('BR')>-1) { taxCode = 'BR'; }
                                                                           else if(taxCodeUpper.indexOf('D0')>-1) { taxCode = 'D0'; }
                                                                           else if(taxCodeUpper.indexOf('D1')>-1) { taxCode = 'D1'; }
                                                                           else if(taxCodeUpper.indexOf('NT')>-1) { taxCode = 'NT'; }

                                                                           log('Tax code minus numbers: ' + taxCode, logs);

                                                                           //endregion

                                                                           //region Get Tax Code number

                                                                           var taxCodeNumber = parseInt(taxCodeUpper.substring(0,taxCodeUpper.indexOf(taxCode)));

                                                                           log('Tax code number: ' + taxCodeNumber, logs);

                                                                           //endregion

                                                                           //region Get YTD basic, higher and additional

                                                                           var basicRateYTD = (incomeTaxHigherRateThreshold*payroll.weekNo)/52;
                                                                           log('Basic rate YTD: ' + basicRateYTD, logs);

                                                                           var higherRateYTD = (incomeTaxAdditionalRateThreshold*payroll.weekNo)/52;
                                                                           log('Higher rate YTD: ' + higherRateYTD, logs);

                                                                           var additionalRateYTD = higherRateYTD;
                                                                           log('Additional rate YTD: ' + additionalRateYTD, logs);

                                                                           //endregion

                                                                           var taxableEarningsYTD = payrollWorkerYTD.taxableEarnings+totalPay;
                                                                           log('Taxable earnings YTD inc this week: ' + taxableEarningsYTD, logs);

                                                                           var taxInPeriod = 0,
                                                                               availableTaxFreeAllowanceIncThisWeek = 0,
                                                                               earningsYTDsubjectToTax = 0;

                                                                           switch(taxCode) {
                                                                                   case 'L':
                                                                                   case 'P':
                                                                                   case 'T':
                                                                                   case 'Y':
                                                                                   case 'V':

                                                                                   availableTaxFreeAllowanceIncThisWeek = ((taxCodeNumber*10)+9)*(payroll.weekNo/52);

                                                                                   log('Available tax free allowance inc this week: ' + availableTaxFreeAllowanceIncThisWeek, logs);

                                                                                   earningsYTDsubjectToTax = taxableEarningsYTD-availableTaxFreeAllowanceIncThisWeek;
                                                                                   log('Earnings YTD subject to tax: ' + earningsYTDsubjectToTax, logs);

                                                                                   break;
                                                                                case 'D0':

                                                                                   var higherTax = earningsYTDsubjectToTax*incomeTaxHigherRate;
                                                                                   log('Higher tax: ' + higherTax, logs);

                                                                                   taxInPeriod = higherTax-payrollWorkerYTD.taxPaid;

                                                                                   break;
                                                                                case 'D1':

                                                                                   var additionalTax = earningsYTDsubjectToTax*incomeTaxAdditionalRate;
                                                                                   log('Additional tax: ' + additionalTax, logs);

                                                                                   taxInPeriod = additionalTax-payrollWorkerYTD.taxPaid;

                                                                                   break;

                                                                                case 'K' :

                                                                                   availableTaxFreeAllowanceIncThisWeek = -((taxCodeNumber*10)-9)*(payroll.weekNo/52);
                                                                                   log('Available tax free allowance incl this week: ' + availableTaxFreeAllowanceIncThisWeek, logs);

                                                                                   earningsYTDsubjectToTax = taxableEarningsYTD-availableTaxFreeAllowanceIncThisWeek;
                                                                                   log('Earnings YTD subject to tax: ' + earningsYTDsubjectToTax, logs);

                                                                                   break;

                                                                                case 'BR':

                                                                                   break;
                                                                           }

                                                                           switch(taxCode) {
                                                                                   case 'L':
                                                                                   case 'P':
                                                                                   case 'T':
                                                                                   case 'Y':
                                                                                   case 'V':
                                                                                   case 'K':

                                                                                   var basicAmountToTax = (earningsYTDsubjectToTax>basicRateYTD ? basicRateYTD : earningsYTDsubjectToTax);
                                                                                   log('Basic amount to tax: ' + basicAmountToTax, logs);

                                                                                   var basicTax = basicAmountToTax*incomeTaxBasicRate;
                                                                                   log('Basic tax: ' + basicTax, logs);

                                                                                   var higherRateLowerLimit = (earningsYTDsubjectToTax>basicRateYTD ? basicRateYTD : 0);
                                                                                   log('Higher rate lower limit: ' + higherRateLowerLimit, logs);

                                                                                   var higherRateUpperLimit = (earningsYTDsubjectToTax>higherRateYTD ? higherRateYTD : earningsYTDsubjectToTax);
                                                                                   log('Higher rate upper limit: ' + higherRateUpperLimit, logs);

                                                                                   var higherTax = (higherRateLowerLimit>0 ? ((higherRateUpperLimit-higherRateLowerLimit)*incomeTaxHigherRate) : 0);
                                                                                   log('Higher tax: ' + higherTax, logs);

                                                                                   var additionalAmountToTax = (earningsYTDsubjectToTax>additionalRateYTD ? earningsYTDsubjectToTax-additionalRateYTD : 0);
                                                                                   log('Additional amount to tax: ' + additionalAmountToTax, logs);

                                                                                   var additionalTax = additionalAmountToTax*incomeTaxAdditionalRate;
                                                                                   log('Additional tax: ' + additionalTax, logs);

                                                                                   var taxYTD = basicTax + higherTax + additionalTax;
                                                                                   log('Tax YTD: ' + taxYTD, logs);

                                                                                   log('Tax already paid YTP: ' + payrollWorkerYTD.taxPaid, logs);

                                                                                   taxInPeriod = taxYTD-payrollWorkerYTD.taxPaid; 
                                                                                   log('Tax in period: ' + taxInPeriod, logs);

                                                                                   break;

                                                                           }

                                                                           //endregion
                                                                       }
                                                                       else {
                                                                           log('SERIOUS PROBLEM: Under NMW. It is ' + totalPay+totalHolidayPayTaken + ' which is not more than ' + actualNMW, logs);
                                                                          
                                                                       }

                                                                       
                                                                   });

                                                                    
//region Earnings
                                                                });

                                                              return timesheetPromises;
                                                          }
                                                          else {
                                                             log('No timesheets so stopping!', logs);
                                                             
                                                          }

                                                      }).then(function(){
                                                           log('saving payrollworkerYTD');
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