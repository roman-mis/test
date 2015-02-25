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
        
        log('Starting a payroll run!');
        
        var today = new Date();
        
        // Get the system
        return systemService.getSystem()
        .then(function(system) {
            
            log('Retrieved system record');
            
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
        
            console.log(employersNiThreshold);
            
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
                                                log('Cannot progress as Income Tax Additional Rate not set');
                                            }
                                        }
                                        else {
                                            log('Cannot progress as Income Tax Higher Rate not set');
                                        }
                                    }
                                    else {
                                        log('Cannot progress as Income Tax Basic Rate not set');
                                    }
                                }
                                else {
                                    log('Cannot progress as Income Tax Additional Rate Threshold not set');
                                }
                            }
                            else {
                                log('Cannot progress as Income Tax Higher Rate Threshold not set');
                            }
                        }
                        else {
                            log('Cannot progress as Employees High Earner NI Rate not set');
                        }
                    }
                    else {
                        log('Cannot progress as Employees NI Rate not set');
                    }
                }
                else {
                    log('Cannot progress as Employers NI Rate not set');
                }
            }
            else {
                log('Cannot progress as Employers NI Threshold not set');
            }
            
            if(statutoryValuesOK) {

                db.Payroll.findOne({ isCurrent: true, weekNo: req.body.weekNo },function(err,payroll) {

                    if(!err) {

                        log('Retrieved payroll record');

                        req.body.workers.forEach(function(worker){

                           log('On Worker: ' + worker);

                           // Get the worker
                           db.User.findById(worker._id,function(err,_worker) {
                               if(!err) {

                                   log('Retrieved worker record');

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
                                       log('No NMW found for this date and age so using a default');

                                       nmw = 6.50;
                                   }

                                   log('NMW: ' + nmw);

                                   //endregion                    

                                   //region Get the PayrollWorkerYTD record

                                   var payrollWorkerYTD;

                                   db.PayrollWorkerYTD.findOne({ worker: worker._id },function(err,_payrollWorkerYTD) {

                                       if(!err) {

                                           log('Retreived Payroll YTD record');

                                           payrollWorkerYTD = _payrollWorkerYTD;

                                           // TODO - Change status to receipted

                                           log('Looking up Worker ID: ' + worker._id);

                                           // status: 'submitted' , 

                                           // Get all the timesheets for this worker that are status of receipted
                                           db.Timesheet.find( { worker: worker._id.toString() , status: 'receipted' } )
                                           .exec(function(err,timesheets) {
                                               if(!err) {

                                                   log('Timesheet records retrieved: ' + timesheets.length);

                                                   if(timesheets) {

                                                       var totalHours = 0,
                                                           totalPay = 0,
                                                           totalEffectiveEarnings = 0,
                                                           totalHolidayPay = 0;

                                                       timesheets.forEach(function(timesheet) {

                                                           log('Found timesheet: ' + timesheet);

                                                           var _payrollProduct;
                                                           // Get the payroll product
                                                           _worker.worker.payrollProduct.forEach(function(payrollProduct) {
                                                               log('Payroll Product Agency: ' + payrollProduct.agency);
                                                               log('Timesheet Agency: ' + timesheet.agency);

                                                               if(payrollProduct.agency.toString()===timesheet.agency.toString()) {
                                                                   _payrollProduct=payrollProduct;
                                                               }
                                                           });

                                                           var timesheetElementIndex = 0;
                                                           timesheet.elements.forEach(function(element) {

                                                               var holidayPay = 0;

                                                               log('Found timesheet element: ' + element);

                                                               //region Daily or Hourly
                                                               if(element.paymentRate.rateType==='Daily' || element.paymentRate.rateType==='Hourly') {

                                                                   log('It is a ' + element.paymentRate.rateType + ' element');

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
                                                                   log('Effective earnings: ' + effectiveEarnings);

                                                                   pay = element.units*element.payRate;
                                                                   log('Adding ' + pay + ' of pay from this element');
                                                                   totalPay+=pay;

                                                                   log('Adding ' + hours + ' hours from this element');
                                                                   totalHours+=hours;

                                                                   log('Now the total hours for this worker are: ' + totalHours);

                                                                   //region Holiday pay

                                                                   // Rolled up or retained but on Total Pay
                                                                   if(_payrollProduct.holidayPayRule==='2' || _payrollProduct.holidayPayRule==='4') {
                                                                       log('Rolled up or retained but on Total Pay');

                                                                       holidayPay = (_payrollProduct.holidayPayDays/260)*pay;
                                                                       if(isNaN(holidayPay)) { holidayPay = 0; }
                                                                       log('Holiday pay: ' + holidayPay);

                                                                       timesheet.elements[timesheetElementIndex].holidayPay.onActual = holidayPay;
                                                                       totalHolidayPay+=holidayPay;
                                                                   }
                                                                   // Rolled up or retained on NMW
                                                                   if(_payrollProduct.holidayPayRule==='1' || _payrollProduct.holidayPayRule==='3') {
                                                                       log('Rolled up or retained on NMW');                                                                   

                                                                       holidayPay = (_payrollProduct.holidayPayDays/(260-_payrollProduct.holidayPayDays))*effectiveEarnings;
                                                                       if(isNaN(holidayPay)) { holidayPay = 0; }
                                                                       log('Holiday pay: ' + holidayPay);

                                                                       timesheet.elements[timesheetElementIndex].holidayPay.onNMW = holidayPay;
                                                                       totalHolidayPay+=holidayPay;
                                                                   }

                                                                   //endregion
                                                               }
                                                               //endregion

                                                               //region It's a Holiday timesheet entry
                                                               if(element.paymentRate.rateType==='Holiday') {
                                                                   log('It is a holiday element');

                                                                   holidayPay = element.units*element.payRate;
                                                                   if(isNaN(holidayPay)) { holidayPay = 0; }
                                                                   log('Holiday pay: ' + holidayPay);

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

                                                               log('After this element Total Effective Earnings are: ' + totalEffectiveEarnings);
                                                               log('After this element Total Pay is: ' + totalPay);
                                                               log('After this element Total Holiday Pay is: ' + totalHolidayPay);
                                                           });

                                                           timesheet.save(function(err,timesheet){
                                                               log('Error saving timesheet: ' + err);
                                                           });
                                                       });

                                                       //region Earnings

                                                       var employersNiOnNmw = 0;

                                                       if(totalEffectiveEarnings>=employersNiThreshold) {
                                                           employersNiOnNmw = ((totalEffectiveEarnings-employersNiThreshold)/100)*employersNiRate;
                                                           log('Employers NI on NMW: ' + employersNiOnNmw);
                                                       }

                                                       var actualNMW = totalEffectiveEarnings+employersNiOnNmw;
                                                       log('Actual NMW: ' + actualNMW);

                                                       //endregion

                                                       //region Holiday Pay Deducted (retained or rolled up)

                                                       var totalPayForNMW = totalPay-totalHolidayPay;
                                                       log('Total pay for NMW: ' + totalPayForNMW);

                                                       //endregion

                                                       //region TODO: Holiday Pay Taken

                                                       var totalHolidayPayTaken = 0;

                                                       if(totalHolidayPayTaken>_worker.worker.payrollValues.holidayPayRetained) {
                                                           log('SERIOUS PROBLEM: Holiday Pay requested to be taken is under the amount retained. Requested: ' + totalHolidayPayTaken + ' and only ' + _worker.worker.payrollValues.holidayPayRetained + ' retained');
                                                           totalHolidayPayTaken = _worker.worker.payrollValues.holidayPayRetained;
                                                       }

                                                       log('Holiday pay taken: ' + totalHolidayPayTaken);

                                                       //endregion

                                                       // NMW Verification
                                                       if(totalPay+totalHolidayPayTaken>actualNMW) {

                                                           //region Margin

                                                           var margin = 20;

                                                           log('Margin: ' + margin);

                                                           //endregion

                                                           var totalPayAfterHPandMargin = totalPay-margin;
                                                           log('Total pay after HP and Margin: ' + totalPayAfterHPandMargin);

                                                           //region Expenses

                                                           var capacityForExpenses = totalPayAfterHPandMargin-actualNMW;
                                                           log('Capacity for expenses: ' + capacityForExpenses);

                                                           var totalExpenses = 0;
                                                           log('Total expenses available to use: ' + _worker.worker.currentExpensesToUse);

                                                           if(_worker.worker.currentExpensesToUse>capacityForExpenses) {
                                                               totalExpenses = capacityForExpenses;
                                                               log('Plenty of expenses available so going for full capacity');
                                                           }
                                                           else { // Use it all
                                                               totalExpenses = _worker.worker.currentExpensesToUse;
                                                               log('Not enough expenses so using all there is');
                                                           }

                                                           log('Expenses used: ' + totalExpenses);

                                                           // Remove the amount we used off the worker
                                                           _worker.worker.currentExpensesToUse=_worker.worker.currentExpensesToUse-totalExpenses;

                                                           //endregion

                                                           //region Summary before taxes and NI

                                                           log('SUMMARY BEFORE TAXES AND NI');
                                                           log('Gross pay: ' + totalPay);
                                                           log('Holiday pay accrued: ' + totalHolidayPay);
                                                           log('Holiday pay taken: ' + totalHolidayPayTaken);
                                                           log('Margin: ' + margin);
                                                           log('Expenses allowed: ' + totalExpenses);

                                                           var payForTaxesAndNI = totalPay + totalHolidayPay + totalHolidayPayTaken + margin + totalExpenses;

                                                           log('Pay available for taxes and NI: ' + payForTaxesAndNI);

                                                           //endregion

                                                           //region Employers NI

                                                           var employersNI = 0;

                                                           if(payForTaxesAndNI>employersNiThreshold) {
                                                               employersNI = (payForTaxesAndNI-employersNI) * (employersNiRate/(1+employersNiRate));
                                                               log('Pay under Employers NI Threshold so none due');
                                                           }

                                                           log('Employers NI: ' + employersNI);

                                                           //endregion

                                                           //region Employees NI

                                                           var paySubjectToEmployeesNI = payForTaxesAndNI+employersNI;

                                                           log('Pay subject to Employees NI: ' + paySubjectToEmployeesNI);

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
                                                               log('Main NI: ' + mainNI);

                                                               // High earners NI (2% in Feb 2015)
                                                               var highEarnerNI = 0;
                                                               if(paySubjectToEmployeesNI>employeesHighEarnerNiRates.lowerThreshold) {
                                                                   highEarnerNI = ((paySubjectToEmployeesNI-employeesHighEarnerNiRates.lowerThreshold)/100)*employeesHighEarnerNiRates.amount;
                                                               }
                                                               log('High earner NI: ' + highEarnerNI);

                                                               employeesNI = mainNI + highEarnerNI;
                                                               log('Employees NI: ' + employeesNI);
                                                           }
                                                           else {
                                                               log('This worker does not have to pay Employees NI');
                                                           }

                                                           //endregion

                                                           //region Income Tax

                                                           var taxCode = '',
                                                               taxCodeUpper = '';

                                                           taxCodeUpper = _worker.worker.payrollTax.taxCode.toUpperCase();

                                                           //region Get Tax Code letter

                                                           log('Tax code upper case: ' + taxCodeUpper);

                                                           if(taxCodeUpper.indexOf('L')>-1) { taxCode = 'L'; }
                                                           else if(taxCodeUpper.indexOf('P')>-1) { taxCode = 'P'; }
                                                           else if(taxCodeUpper.indexOf('Y')>-1) { taxCode = 'Y'; }
                                                           else if(taxCodeUpper.indexOf('0T')>-1) { taxCode = '0T'; }
                                                           else if(taxCodeUpper.indexOf('T')>-1) { taxCode = 'T'; }
                                                           else if(taxCodeUpper.indexOf('BR')>-1) { taxCode = 'BR'; }
                                                           else if(taxCodeUpper.indexOf('D0')>-1) { taxCode = 'D0'; }
                                                           else if(taxCodeUpper.indexOf('D1')>-1) { taxCode = 'D1'; }
                                                           else if(taxCodeUpper.indexOf('NT')>-1) { taxCode = 'NT'; }

                                                           log('Tax code minus numbers: ' + taxCode);

                                                           //endregion

                                                           //region Get Tax Code number

                                                           var taxCodeNumber = parseInt(taxCodeUpper.substring(0,taxCodeUpper.indexOf(taxCode)));

                                                           log('Tax code number: ' + taxCodeNumber);

                                                           //endregion

                                                           //region Get YTD basic, higher and additional

                                                           var basicRateYTD = (incomeTaxHigherRateThreshold*payroll.weekNo)/52;
                                                           log('Basic rate YTD: ' + basicRateYTD);

                                                           var higherRateYTD = (incomeTaxAdditionalRateThreshold*payroll.weekNo)/52;
                                                           log('Higher rate YTD: ' + higherRateYTD);

                                                           var additionalRateYTD = higherRateYTD;
                                                           log('Additional rate YTD: ' + additionalRateYTD);

                                                           //endregion

                                                           var taxableEarningsYTD = payrollWorkerYTD.taxableEarnings+totalPay;
                                                           log('Taxable earnings YTD inc this week: ' + taxableEarningsYTD);

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

                                                                   log('Available tax free allowance inc this week: ' + availableTaxFreeAllowanceIncThisWeek);

                                                                   earningsYTDsubjectToTax = taxableEarningsYTD-availableTaxFreeAllowanceIncThisWeek;
                                                                   log('Earnings YTD subject to tax: ' + earningsYTDsubjectToTax);

                                                                   break;
                                                                case 'D0':

                                                                   var higherTax = earningsYTDsubjectToTax*incomeTaxHigherRate;
                                                                   log('Higher tax: ' + higherTax);

                                                                   taxInPeriod = higherTax-payrollWorkerYTD.taxPaid;

                                                                   break;
                                                                case 'D1':

                                                                   var additionalTax = earningsYTDsubjectToTax*incomeTaxAdditionalRate;
                                                                   log('Additional tax: ' + additionalTax);

                                                                   taxInPeriod = additionalTax-payrollWorkerYTD.taxPaid;

                                                                   break;

                                                                case 'K' :

                                                                   availableTaxFreeAllowanceIncThisWeek = -((taxCodeNumber*10)-9)*(payroll.weekNo/52);
                                                                   log('Available tax free allowance incl this week: ' + availableTaxFreeAllowanceIncThisWeek);

                                                                   earningsYTDsubjectToTax = taxableEarningsYTD-availableTaxFreeAllowanceIncThisWeek;
                                                                   log('Earnings YTD subject to tax: ' + earningsYTDsubjectToTax);

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
                                                                   log('Basic amount to tax: ' + basicAmountToTax);

                                                                   var basicTax = basicAmountToTax*incomeTaxBasicRate;
                                                                   log('Basic tax: ' + basicTax);

                                                                   var higherRateLowerLimit = (earningsYTDsubjectToTax>basicRateYTD ? basicRateYTD : 0);
                                                                   log('Higher rate lower limit: ' + higherRateLowerLimit);

                                                                   var higherRateUpperLimit = (earningsYTDsubjectToTax>higherRateYTD ? higherRateYTD : earningsYTDsubjectToTax);
                                                                   log('Higher rate upper limit: ' + higherRateUpperLimit);

                                                                   var higherTax = (higherRateLowerLimit>0 ? ((higherRateUpperLimit-higherRateLowerLimit)*incomeTaxHigherRate) : 0);
                                                                   log('Higher tax: ' + higherTax);

                                                                   var additionalAmountToTax = (earningsYTDsubjectToTax>additionalRateYTD ? earningsYTDsubjectToTax-additionalRateYTD : 0);
                                                                   log('Additional amount to tax: ' + additionalAmountToTax);

                                                                   var additionalTax = additionalAmountToTax*incomeTaxAdditionalRate;
                                                                   log('Additional tax: ' + additionalTax);

                                                                   var taxYTD = basicTax + higherTax + additionalTax;
                                                                   log('Tax YTD: ' + taxYTD);

                                                                   log('Tax already paid YTP: ' + payrollWorkerYTD.taxPaid);

                                                                   taxInPeriod = taxYTD-payrollWorkerYTD.taxPaid; 
                                                                   log('Tax in period: ' + taxInPeriod);

                                                                   break;

                                                           }

                                                           //endregion
                                                       }
                                                       else {
                                                           log('SERIOUS PROBLEM: Under NMW. It is ' + totalPay+totalHolidayPayTaken + ' which is not more than ' + actualNMW);
                                                       }

                                                   }
                                                   else {
                                                       log('No timesheets so stopping!');
                                                   }
                                               }
                                               else {
                                                   log('Error retrieving timesheet records: ' + err);
                                               }
                                           });
                                       }
                                       else {
                                           log('Error retrieving Payroll TYD record: ' + err);
                                       }
                                   });

                                   //endregion


                               }
                               else {
                                   log('Error retrieving worker record: ' + err);
                               }
                           });
                       });
                    }
                    else {
                        log('Error retrieving payroll record: ' + err);
                    }
                });

            }
            else {
                log('Statutory values not OK so bailing out');
            }
            
        });
    };
        
        function getStatutoryValue(name,system) {
            
            log('Looking for Statutory Value: ' + name);
            
            var currentDate = new Date();
            
            if(system.statutoryTables[name]){
               system.statutoryTables[name].forEach(function(_value){
                   console.log(_value);
                   
                   if(currentDate >= _value.validFrom && currentDate <= _value.validTo) {
                       log('Found it!');
                       return _value;
                   }
               });
            } 
            else {
                log('Cannot find this value!');
                return;
            }
        }
    
    function log(message) {
        console.log(message);
    }
    
	return service;
};