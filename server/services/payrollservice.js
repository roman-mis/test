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
        var log = [];
        
        var today = new Date();
        
        // Get the system
        systemService.getSystem()
        .then(function(system) {
            
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
            
            db.Payroll.findOne({ isCurrent: true, weekNo: req.body.weekNo },function(err,payroll) {
                
                if(!err) {
                
                   req.body.workers.forEach(function(worker){

                       // Get the worker
                       db.User.findById(worker._id,function(err,_worker) {
                           if(!err) {

                               // Get the worker's age
                               var diff = today-worker.birthDate;
                               var age = Math.floor(diff/31536000000);

                               var nmw = 0;

                               //region Get the NMW for this worker's age
                               if(system.statutoryTables.nmw){
                                   var currentDate = new Date();console.log(currentDate);
                                   system.statutoryTables.nmw.forEach(function(_value) {
                                       console.log(_value);
                                       if(currentDate >= _value.validFrom && currentDate <= _value.validTo && _value.ageLower<age && _value.ageUpper>age) {
                                           nmw = _value.amount;
                                       }
                                   });
                               }
                               //endregion                    

                               //region Get the PayrollWorkerYTD record

                               var payrollWorkerYTD;

                               db.PayrollWorkerYTD.findOne({ worker: worker._id },function(err,_payrollWorkerYTD) {
                                   payrollWorkerYTD = _payrollWorkerYTD;
                                   
                                   // Get all the timesheets for this worker that are status of receipted
                                   db.Timesheet.find( { $and: [ { status: 'receipted' } , { worker: worker._id } ] })
                                   .exec(function(timesheets,err) {
                                       if(!err) {
                                           if(timesheets.count>0) {

                                               var totalHours = 0,
                                                   totalPay = 0,
                                                   totalEffectiveEarnings = 0,
                                                   totalHolidayPay = 0;

                                               var timesheetIndex = 0;
                                               timesheets.forEach(function(timesheet) {

                                                   var _payrollProduct;
                                                   // Get the payroll product
                                                   _worker.payrollProduct.forEach(function(payrollProduct) {
                                                       if(payrollProduct.agency===timesheet.agency) {
                                                           _payrollProduct=payrollProduct;
                                                       }
                                                   });

                                                   log.push('Found timesheet: ' + timesheet);

                                                   var timesheetElementIndex = 0;
                                                   timesheet.elements.forEach(function(element) {

                                                       var holidayPay = 0;

                                                       log.push('Found timesheet element: ' + element);

                                                       //region Daily or Hourly
                                                       if(element.paymentRate.rateType==='Daily' || element.paymentRate.rateType==='Hourly') {

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
                                                           log.push('Effective earnings: ' + effectiveEarnings);

                                                           pay = element.units*element.payRate;
                                                           log.push('Adding ' + pay + ' of pay from this element');
                                                           totalPay+=pay;

                                                           log.push('Adding ' + hours + ' hours from this element');
                                                           totalHours+=hours;

                                                           log.push('Now the total hours for this worker are: ' + totalHours);

                                                           //region Holiday pay

                                                           // Rolled up or retained but on Total Pay
                                                           if(_payrollProduct.holidayPayRule==='2' || _payrollProduct.holidayPayRule==='4') {
                                                               holidayPay = (_payrollProduct.holidayPayDays/260)*pay;
                                                               timesheet.elements[timesheetElementIndex].holidayPay.onActual = holidayPay;
                                                               totalHolidayPay+=holidayPay;
                                                           }
                                                           // Rolled up or retained on NMW
                                                           if(_payrollProduct.holidayPayRule==='1' || _payrollProduct.holidayPayRule==='3') {
                                                               holidayPay = (_payrollProduct.holidayPayDays/(260-_payrollProduct.holidayPayDays))*effectiveEarnings;
                                                               timesheet.elements[timesheetElementIndex].holidayPay.onNMW = holidayPay;
                                                               totalHolidayPay+=holidayPay;
                                                           }

                                                           //endregion
                                                       }
                                                       //endregion

                                                       //region It's a Holiday timesheet entry
                                                       if(element.paymentRate.rateType==='Holiday') {
                                                           holidayPay = element.units*element.payRate;
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
                                                       timesheetElementIndex++;
                                                   });

                                                   timesheet[timesheetIndex].save(function(err){
                                                       log.push('Error saving timesheet: ' + err);
                                                   });

                                                   timesheetIndex++;
                                               });

                                               //region Earnings

                                               var employersNiOnNmw = 0;

                                               if(totalEffectiveEarnings>=employersNiThreshold) {
                                                   employersNiOnNmw = ((totalEffectiveEarnings-employersNiThreshold)/100)*employersNiRate;
                                                   log.push('Employers NI on NMW: ' + employersNiOnNmw);
                                               }

                                               var actualNMW = totalEffectiveEarnings+employersNiOnNmw;
                                               log.push('Actual NMW: ' + actualNMW);

                                               //endregion

                                               //region Holiday Pay Deducted (retained or rolled up)

                                               var totalPayForNMW = totalPay-totalHolidayPay;
                                               log.push('Total pay for NMW: ' + totalPayForNMW);

                                               //endregion

                                               //region TODO: Holiday Pay Taken

                                               var totalHolidayPayTaken = 0;

                                               if(totalHolidayPayTaken>_worker.worker.payrollValues.holidayPayRetained) {
                                                   log.push('SERIOUS PROBLEM: Holiday Pay requested to be taken is under the amount retained. Requested: ' + totalHolidayPayTaken + ' and only ' + _worker.worker.payrollValues.holidayPayRetained + ' retained');
                                                   totalHolidayPayTaken = _worker.worker.payrollValues.holidayPayRetained;
                                               }

                                               log.push('Holiday pay taken: ' + totalHolidayPayTaken);

                                               //endregion

                                               // NMW Verification
                                               if(totalPay+totalHolidayPayTaken>actualNMW) {

                                                   //region Margin

                                                   var margin = 20;

                                                   log.push('Margin: ' + margin);

                                                   //endregion

                                                   var totalPayAfterHPandMargin = totalPay-margin;
                                                   log.push('Total pay after HP and Margin: ' + totalPayAfterHPandMargin);

                                                   //region Expenses

                                                   var capacityForExpenses = totalPayAfterHPandMargin-actualNMW;
                                                   log.push('Capacity for expenses: ' + capacityForExpenses);

                                                   var totalExpenses = 0;
                                                   log.push('Total expenses available to use: ' + _worker.worker.currentExpensesToUse);

                                                   if(_worker.worker.currentExpensesToUse>capacityForExpenses) {
                                                       totalExpenses = capacityForExpenses;
                                                       log.push('Plenty of expenses available so going for full capacity');
                                                   }
                                                   else { // Use it all
                                                       totalExpenses = _worker.worker.currentExpensesToUse;
                                                       log.push('Not enough expenses so using all there is');
                                                   }

                                                   log.push('Expenses used: ' + totalExpenses);

                                                   // Remove the amount we used off the worker
                                                   _worker.worker.currentExpensesToUse=_worker.worker.currentExpensesToUse-totalExpenses;

                                                   //endregion

                                                   //region Summary before taxes and NI

                                                   log.push('SUMMARY BEFORE TAXES AND NI');
                                                   log.push('Gross pay: ' + totalPay);
                                                   log.push('Holiday pay accrued: ' + totalHolidayPay);
                                                   log.push('Holiday pay taken: ' + totalHolidayPayTaken);
                                                   log.push('Margin: ' + margin);
                                                   log.push('Expenses allowed: ' + totalExpenses);

                                                   var payForTaxesAndNI = totalPay + totalHolidayPay + totalHolidayPayTaken + margin + totalExpenses;

                                                   log.push('Pay available for taxes and NI: ' + payForTaxesAndNI);

                                                   //endregion

                                                   //region Employers NI

                                                   var employersNI = 0;

                                                   if(payForTaxesAndNI>employersNiThreshold) {
                                                       employersNI = (payForTaxesAndNI-employersNI) * (employersNiRate/(1+employersNiRate));
                                                       log.push('Pay under Employers NI Threshold so none due');
                                                   }

                                                   log.push('Employers NI: ' + employersNI);

                                                   //endregion

                                                   //region Employees NI

                                                   var paySubjectToEmployeesNI = payForTaxesAndNI+employersNI;

                                                   log.push('Pay subject to Employees NI: ' + paySubjectToEmployeesNI);

                                                   var employeesNI = 0;

                                                   if(_worker.taxDetail.employeesNIpaid) {
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
                                                       log.push('Main NI: ' + mainNI);

                                                       // High earners NI (2% in Feb 2015)
                                                       var highEarnerNI = 0;
                                                       if(paySubjectToEmployeesNI>employeesHighEarnerNiRates.lowerThreshold) {
                                                           highEarnerNI = ((paySubjectToEmployeesNI-employeesHighEarnerNiRates.lowerThreshold)/100)*employeesHighEarnerNiRates.amount;
                                                       }
                                                       log.push('High earner NI: ' + highEarnerNI);

                                                       employeesNI = mainNI + highEarnerNI;
                                                       log.push('Employees NI: ' + employeesNI);
                                                   }
                                                   else {
                                                       log.push('This worker does not have to pay Employees NI');
                                                   }

                                                   //endregion

                                                   //region Income Tax

                                                   var taxCode = '',
                                                       taxCodeUpper = '';

                                                   taxCodeUpper = _worker.worker.payrollTax.taxCode.toUpperCase();

                                                   //region Get Tax Code letter

                                                   log.push('Tax code upper case: ' + taxCodeUpper);

                                                   if(taxCodeUpper.indexOf('L')>-1) { taxCode = 'L'; }
                                                   else if(taxCodeUpper.indexOf('P')>-1) { taxCode = 'P'; }
                                                   else if(taxCodeUpper.indexOf('Y')>-1) { taxCode = 'Y'; }
                                                   else if(taxCodeUpper.indexOf('0T')>-1) { taxCode = '0T'; }
                                                   else if(taxCodeUpper.indexOf('T')>-1) { taxCode = 'T'; }
                                                   else if(taxCodeUpper.indexOf('BR')>-1) { taxCode = 'BR'; }
                                                   else if(taxCodeUpper.indexOf('D0')>-1) { taxCode = 'D0'; }
                                                   else if(taxCodeUpper.indexOf('D1')>-1) { taxCode = 'D1'; }
                                                   else if(taxCodeUpper.indexOf('NT')>-1) { taxCode = 'NT'; }

                                                   log.push('Tax code minus numbers: ' + taxCode);

                                                   //endregion

                                                   //region Get Tax Code number

                                                   var taxCodeNumber = parseInt(taxCodeUpper.substring(0,taxCodeUpper.indexOf(taxCode)));

                                                   log.push('Tax code number: ' + taxCodeNumber);

                                                   //endregion
                                                   
                                                   //region Get YTD basic, higher and additional
                                                   
                                                   var basicRateYTD = (incomeTaxHigherRateThreshold*payroll.weekNo)/52;
                                                   log.push('Basic rate YTD: ' + basicRateYTD);

                                                   var higherRateYTD = (incomeTaxAdditionalRateThreshold*payroll.weekNo)/52;
                                                   log.push('Higher rate YTD: ' + higherRateYTD);

                                                   var additionalRateYTD = higherRateYTD;
                                                   log.push('Additional rate YTD: ' + additionalRateYTD);
                                                   
                                                   //endregion

                                                   var taxableEarningsYTD = payrollWorkerYTD.taxableEarnings+totalPay;
                                                   log.push('Taxable earnings YTD inc this week: ' + taxableEarningsYTD);
                                                   
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

                                                           log.push('Available tax free allowance inc this week: ' + availableTaxFreeAllowanceIncThisWeek);

                                                           earningsYTDsubjectToTax = taxableEarningsYTD-availableTaxFreeAllowanceIncThisWeek;
                                                           log.push('Earnings YTD subject to tax: ' + earningsYTDsubjectToTax);
                                                           
                                                           break;
                                                        case 'D0':
                                                           
                                                           var higherTax = earningsYTDsubjectToTax*incomeTaxHigherRate;
                                                           log.push('Higher tax: ' + higherTax);
                                                           
                                                           taxInPeriod = higherTax-payrollWorkerYTD.taxPaid;
                                                           
                                                           break;
                                                        case 'D1':
                                                           
                                                           var additionalTax = earningsYTDsubjectToTax*incomeTaxAdditionalRate;
                                                           log.push('Additional tax: ' + additionalTax);
                                                           
                                                           taxInPeriod = additionalTax-payrollWorkerYTD.taxPaid;
                                                           
                                                           break;
                                                           
                                                        case 'K' :
                                                           
                                                           availableTaxFreeAllowanceIncThisWeek = -((taxCodeNumber*10)-9)*(payroll.weekNo/52);
                                                           log.push('Available tax free allowance incl this week: ' + availableTaxFreeAllowanceIncThisWeek);
                                                           
                                                           earningsYTDsubjectToTax = taxableEarningsYTD-availableTaxFreeAllowanceIncThisWeek;
                                                           log.push('Earnings YTD subject to tax: ' + earningsYTDsubjectToTax);
                                                           
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
                                                           log.push('Basic amount to tax: ' + basicAmountToTax);

                                                           var basicTax = basicAmountToTax*incomeTaxBasicRate;
                                                           log.push('Basic tax: ' + basicTax);

                                                           var higherRateLowerLimit = (earningsYTDsubjectToTax>basicRateYTD ? basicRateYTD : 0);
                                                           log.push('Higher rate lower limit: ' + higherRateLowerLimit);

                                                           var higherRateUpperLimit = (earningsYTDsubjectToTax>higherRateYTD ? higherRateYTD : earningsYTDsubjectToTax);
                                                           log.push('Higher rate upper limit: ' + higherRateUpperLimit);

                                                           var higherTax = (higherRateLowerLimit>0 ? ((higherRateUpperLimit-higherRateLowerLimit)*incomeTaxHigherRate) : 0);
                                                           log.push('Higher tax: ' + higherTax);

                                                           var additionalAmountToTax = (earningsYTDsubjectToTax>additionalRateYTD ? earningsYTDsubjectToTax-additionalRateYTD : 0);
                                                           log.push('Additional amount to tax: ' + additionalAmountToTax);

                                                           var additionalTax = additionalAmountToTax*incomeTaxAdditionalRate;
                                                           log.push('Additional tax: ' + additionalTax);

                                                           var taxYTD = basicTax + higherTax + additionalTax;
                                                           log.push('Tax YTD: ' + taxYTD);

                                                           log.push('Tax already paid YTP: ' + payrollWorkerYTD.taxPaid);

                                                           taxInPeriod = taxYTD-payrollWorkerYTD.taxPaid; 
                                                           log.push('Tax in period: ' + taxInPeriod);
                                                           
                                                           break;
                                                           
                                                   }
                                                   
                                                   //endregion
                                               }
                                               else {
                                                   log.push('SERIOUS PROBLEM: Under NMW. It is ' + totalPay+totalHolidayPayTaken + ' which is not more than ' + actualNMW);
                                               }

                                           }
                                           else {

                                           }
                                       }
                                       else {
                                       }
                                   });
                               });

                               //endregion

                               
                           }
                           else {

                           }
                       });
                   });
                }
                else {
                    
                }
            });
            
            
        });
    };
        
        function getStatutoryValue(name,system) {
            var currentDate = new Date();
            
            if(system.statutoryTables[name]){
               system.statutoryTables[name].forEach(function(_value){
                   console.log(_value);
                   if(currentDate >= _value.validFrom && currentDate <= _value.validTo) {
                       return _value.amount;
                   }
               });
            }
            
            return;
        }
    
	return service;
};