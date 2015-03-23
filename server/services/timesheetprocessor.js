'use strict';

module.exports=function(db){
	var Q=require('q'),
		_=require('lodash'),
		utils=require('../utils/utils'),
		systemservice=require('./systemservice')(db),
		candidatecommonservice=require('./candidatecommonservice')(db);

	var processor={};

	processor.getCSVFile = function(code, file){
		console.log('here');
		switch(code){
			case '1':
				return getStandardTemplate(file);
			case '2':
				return getFormat1Template(file);
		}
	};

	function findPaymentRate(paymentRates, search){
		var paymentRate = {};
		_.forEach(paymentRates, function(_paymentRate){
			if(_paymentRate.name.toString().trim().toLowerCase() === search.trim().toLowerCase() || (_paymentRate.importAliases.indexOf(search) > 0)){
				paymentRate = _paymentRate;
				return false;
			}
		});
		return paymentRate;
	}

	function getFormat1Template(file){
		return Q.Promise(function(resolve,reject){
			return utils.readCsvFromFile(file.path).then(function(data){
				console.log(data);
				return systemservice.getSystem()
			  	.then(function(system){
			  		var paymentRates = system.paymentRates;
		  			var finishData = [];
			  		var validationFailError = false;
			  		
			  		_.forEach(data, function(row){
			  			var dataRow = {
			  				contractorReferenceNumber: row.contractorReferenceNumber,
							contractorForename: row.contractor,
							contractorSurname: row.contractor1,
							periodEndDate: null,
						};

		  				// Get Candidate/Worker by Reference Number
		  				return candidatecommonservice.getUserByRef(row.contractorReferenceNumber)
		  				.then(function(candidate){
		  					// Check for previous timesheet for worker
		  					var worker = (candidate?candidate._id:null);
		  					var weekEndingDate = row.periodEndDate || null;
		  					
		  					return db.Timesheet.findOne({ worker: worker, weekEndingDate: weekEndingDate }).exec()
              				.then(function(prevTimesheet) {
								
								dataRow.failMessages = [];
			  					dataRow.warningMessages = [];
					  			
					  			if(prevTimesheet){
	  								dataRow.warningMessages.push('Duplicate Entry.');
				  				}

					  			// Set payment Rates
					  			dataRow.elements = [{
					  				rateDescription: 'Standard Hourly Rate',
									noOfUnits: row.hrs,
									unitRate: row.basic
					  			},{
					  				rateDescription: 'Overtime One Rate',
									noOfUnits: row.hrs1,
									unitRate: row.ot1
					  			},{
					  				rateDescription: 'Overtime Two Rate',
									noOfUnits: row.hrs11,
									unitRate: row.ot2
					  			},{
					  				rateDescription: 'Overtime Three Rate',
									noOfUnits: row.hrs11,
									unitRate: row.ot3
					  			}];
					  			
					  			var total = 0;
					  			_.forEach(dataRow.elements, function(element){
					  				var paymentRate = findPaymentRate(paymentRates, element.rateDescription);
					  				element.elementType = paymentRate._id || null;
					  				element.paymentRate = paymentRate;
					  				// Add No Matching Payrment Rate validation if not matching
					  				if(!element.elementType){
		  								dataRow.failMessages.push('No Matching Payment Rate Found.');
					  				}else{
					  					if(paymentRate.rateType === 'Hourly' && element.noOfUnits > 100){
					  						dataRow.warningMessages.push('Hours > 100');
					  					}
					  					if(paymentRate.rateType === 'Day' && element.noOfUnits > 10){
					  						dataRow.warningMessages.push('Day > 10');
					  					}
					  				}
					  				total += element.noOfUnits * element.unitRate;
					  			});

					  			// Add No Matching Candidate validation if not matching
					  			if(!candidate){
					  				dataRow.failMessages.push('No Matching Contractor Found.');
					  			}else{
					  				if(candidate.firstName !== row.contractorForename){
					  					dataRow.failMessages.push('Contractor First Name Mismatch.');
					  				}
					  				if(candidate.lastName !== row.contractorSurname){
					  					dataRow.failMessages.push('Contractor Last Name Mismatch.');
					  				}
					  			}

					  			var contractor = candidate || {};
					  			dataRow.contractor = {_id: contractor._id, firstName: contractor.firstName, lastName: contractor.lastName};
					  			dataRow.worker = contractor._id;
					  			dataRow.total = total;
					  			if(parseFloat(row.total) <= 0){
					  				dataRow.failMessages.push('Timesheet Value is less than or equal to 0.');
					  			}
					  			finishData.push(dataRow);

		                		// Add Overall Validation Result
		                		if(Object.keys(dataRow.failMessages).length > 0 || dataRow.warningMessages.length > 0){
		                			validationFailError = true;
		                		}
              				}, reject);
		  				}, reject).then(function(){
		  					console.log(Object.keys(data).length);
		  					console.log(Object.keys(finishData).length);
		  					console.log('here');
		  					if(Object.keys(data).length === Object.keys(finishData).length){
		  						finishData.validationFailError = validationFailError;
		  						resolve(finishData);
		  					}
		  				});
					});
			  	}, reject);
			}, function(err){
				resolve({result:false, error: err});
			});
		});
	}

	function getStandardTemplate(file){
		return Q.Promise(function(resolve,reject){
			return utils.readCsvFromFile(file.path).then(function(data){
				return systemservice.getSystem()
			  	.then(function(system){
			  		var paymentRates = system.paymentRates;
		  			var finishData = [];
			  		var validationFailError = false;
			  		
			  		_.forEach(data, function(row){
		  				// Get Candidate/Worker by Reference Number
		  				return candidatecommonservice.getUserByRef(row.contractorReferenceNumber)
		  				.then(function(candidate){
		  					// Check for previous timesheet for worker
		  					var worker = (candidate?candidate._id:null);
		  					var weekEndingDate = row.periodEndDate || null;
		  					
		  					return db.Timesheet.findOne({ worker: worker, weekEndingDate: weekEndingDate }).exec()
              				.then(function(prevTimesheet) {
								
								row.failMessages = [];
			  					row.warningMessages = [];
					  			
					  			if(prevTimesheet){
	  								row.warningMessages.push('Duplicate Entry.');
				  				}

					  			if(row.rateDescription){
					  				var paymentRate = findPaymentRate(paymentRates, row.rateDescription);
					  				row.elementType = paymentRate._id || null;
					  				row.paymentRate = paymentRate;
					  				// Add No Matching Payrment Rate validation if not matching
					  				if(!row.elementType){
		  								row.failMessages.push('No Matching Payment Rate Found.');
					  				}else{
					  					if(paymentRate.rateType === 'Hourly' && row.noOfUnits > 100){
					  						row.warningMessages.push('Hours > 100');
					  					}
					  					if(paymentRate.rateType === 'Day' && row.noOfUnits > 10){
					  						row.warningMessages.push('Day > 10');
					  					}
					  				}
					  			}
					  			
					  			// Add No Matching Candidate validation if not matching
					  			if(!candidate){
					  				row.failMessages.push('No Matching Contractor Found.');
					  			}else{
					  				if(candidate.firstName !== row.contractorForename){
					  					row.failMessages.push('Contractor First Name Mismatch.');
					  				}
					  				if(candidate.lastName !== row.contractorSurname){
					  					row.failMessages.push('Contractor Last Name Mismatch.');
					  				}
					  			}

					  			var contractor = candidate || {};
					  			row.contractor = {_id: contractor._id, firstName: contractor.firstName, lastName: contractor.lastName};
					  			row.worker = contractor._id;
					  			row.total = row['total(gross)'];
					  			if(parseFloat(row.total) <= 0){
					  				row.failMessages.push('Timesheet Value is less than or equal to 0.');
					  			}
					  			row.net = row['total(net)'];
					  			row.units = row.noOfUnits;
					  			row.payRate = row.unitRate;
					  			row.holidayPayIncluded = row.holidayPayRule;
					  			row.holidayPayDays = row.holidayPayRate;
		                		finishData.push(row);

		                		if(Object.keys(row.failMessages).length > 0 || row.warningMessages.length > 0){
		                			validationFailError=true;
		                		}

              				}, reject);
		  				}, reject).then(function(){
		  					if(Object.keys(data).length === Object.keys(finishData).length){
		  						finishData.validationFailError = validationFailError;
		  						resolve(finishData);
		  					}
		  				});
					});
			  	}, reject);
			}, function(err){
				resolve({result:false, error: err});
			});
		});
	}

	return processor;
};