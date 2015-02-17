'use strict';

module.exports=function(){
	var db = require('../models'),
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
        systemService=require('./systemservice')(),
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
            var employersNiThreshold = getStatutoryValue('employersNiThreshold',system)
            var employersNiRate = getStatutoryValue('employersNiRate',system);
            
           req.body.workers.forEach(function(worker){
                           
               // Am I being passed the whole user/worker?
               db.User.findById(worker._id,function(err,_worker) {
                   if(!err) {
                              
                       // Get the worker's age
                       var diff = today-worker.birthDate;
                       var age = Math.floor(diff/31536000000);

                       var nmw = 0;

                       // Get the NMW for this worker's age
                       if(system.statutoryTables.nmw){
                           var currentDate = new Date();console.log(currentDate);
                           _.forEach(system.statutoryTables.nmw, function(_value){
                               console.log(_value);
                               if(currentDate >= _value.validFrom && currentDate <= _value.validTo 
                                  && _value.ageLower<age && _value.ageUpper>age) {
                                   nmw = _value.amount;
                               }
                           });
                       }

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

                                           log.push('Found timesheet element: ' + element);

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
                                               
                                               var pay = element.units*element.payRate;
                                               log.push('Adding ' + pay + ' of pay from this element');
                                               totalPay+=pay;

                                               log.push('Adding ' + hours + ' hours from this element');
                                               totalHours+=hours;

                                               log.push('Now the total hours for this worker are: ' + totalHours);
                                               
                                               //region Holiday pay
                                               
                                               // Rolled up or retained but on Total Pay
                                               var holidayPay = 0;
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
                                           
                                           if(element.paymentRate.rateType==='Holiday') {
                                               var holidayPay = units*payRate;
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
                                           
                                           timesheetElementIndex++;
                                       });
                                       
                                       timesheet[timesheetIndex].save(function(err,user){
                                           log.push('Error saving timesheet: ' + err);
                                       });
                                       
                                       timesheetIndex++;
                                   });

                                   //region Earnings
                                   
                                   var employersNiOnNmw = 0;

                                   if(effectiveEarnings>=employersNiThreshold) {
                                       employersNiOnNmw = ((effectiveEarnings-employersNiThreshold)/100)*employersNiRate;
                                       log.push('Employers NI on NMW: ' + employersNiOnNmw);
                                   }

                                   var actualNMW = effectiveEarnings+employersNiOnNmw;
                                   log.push('Actual NMW: ' + actualNMW);
                                   
                                   //endregion
                                   
                               }
                               else {

                               }
                           }
                           else {
                           }
                       });
                   }
                   else {
                       
                   }
               });
           });
        });
    };
        
        function getStatutoryValue(name,system) {
            var today = new Date();
            
            if(system.statutoryTables[name]){
               _.forEach(system.statutoryTables[name], function(_value){
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