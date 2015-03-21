'use strict';

var sinon=require('sinon'),
	mockery=require('mockery'),
	chai=require('chai'),
	expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('invoiceContrller',function(){
		var responseMock, jsonStub, sendFailureResponseStub,systemController, systemServiceMock;
		var getSystemStub, savePaymentRatesStub, saveVatStub, sandbox, dbMock, getSystemStub, fakes, systemVm;
		before(function(){
		
		//mockery configuration
		mockery.enable({
			warnOnReplace:false,
			warnOnUnregistered:false,
			useCleanCache:true
		});

		responseMock={'json':function(){},'sendFailureResponse':function(){}};
		jsonStub=sinon.stub(responseMock,'json');
		sendFailureResponseStub=sinon.stub(responseMock,'sendFailureResponse');
		systemServiceMock={'getSystem':function(){},'saveSystem':function(){},'savePaymentRates':function(){},
		'addExpensesRate':function(){},'updateExpensesRate':function(){},'saveVat':function(){}};
		dbMock={};
		mockery.registerMock('../services/systemservice', function(){ return systemServiceMock;});
		systemController=require('../../../server/controllers/systemController')(dbMock);
		
		systemVm={
   			 "_id" : "54e4de1467837fec03109414",
   			 "updatedDate" : "2015-02-18T18:46:44.619Z",
   			 "createdDate" : "2015-02-18T18:46:44.619Z",
   			 "paymentRates" : [ 
   			      
   			     {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
   			     }
   			 ],
   			 "statutoryTables" : {
   			     "workPatterns" : [],
   			     "incomeTaxAdditionalRate" : [ 
   			         {
   			             "amount" : 20,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7372"
   			         }
   			     ],
   			     "incomeTaxHigherRate" : [ 
   			         {
   			             "amount" : 40,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7373"
   			         }
   			     ],
   			     "incomeTaxBasicRate" : [ 
   			         {
   			             "amount" : 20,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7372"
   			         }
   			     ],
   			     "incomeTaxAdditionalRateThreshold" : [ 
   			         {
   			             "amount" : 150000,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7371"
   			         }
   			     ],
   			     "incomeTaxHigherRateThreshold" : [ 
   			         {
   			             "amount" : 31865,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7370"
   			         }
   			     ],
   			     "employeesHighEarnerNiRate" : [ 
   			         {
   			             "amount" : 2,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7369",
   			             "lowerThreshold" : 805.01
   			         }
   			     ],
   			     "employersNiRate" : [ 
   			         {
   			             "amount" : 13.8,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7369"
   			         }
   			     ],
   			     "employersNiThreshold" : [ 
   			         {
   			             "amount" : 153,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7369"
   			         }
   			     ],
   			     "employeesNiRate" : [ 
   			         {
   			             "amount" : 12,
   			             "validFron": "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7368",
   			             "lowerThreshold" : 153.01,
   			             "upperThreshold" : 805
   			         }
   			     ],
   			     "nmw" : [ 
   			         {
   			             "amount" : 8,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2017-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7367",
   			             "ageLower" : 10,
   			             "ageUpper" : 100
   			         }
   			     ],
   			     "vat" : [ 
   			         {
   			             "amount" : 8,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2011-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7366"
   			         }
   			  ]
   			 },
   			 "__v" : 34,
   			 "expensesRate" : [ 
   			     {
   			         "name" : "Breakfast",
   			         "amount" : 5,
   			         "taxApplicable" : false,
   			         "expensesRateType" : "1",
   			         "vat" : true,
   			         "dispensation" : true,
   			         "receipted" : true,
   			         "status" : true,
   			         "_id" : "54e5dee54da13c101f6ad698"
   			     }, 
   			     {
   			         "name" : "One Meal Rate",
   			         "amount" : 5,
   			         "taxApplicable" : false,
   			         "expensesRateType" : "1",
   			         "vat" : true,
   			         "dispensation" : true,
   			         "receipted" : true,
   			         "status" : true,
   			         "_id" : "54e5df2c31782b181b78c7f9"
   			     }, 
   			     {
   			         "name" : "Two Meal Rate",
   			         "amount" : 5,
   			         "taxApplicable" : false,
   			         "expensesRateType" : "1",
   			         "vat" : true,
   			         "dispensation" : true,
   			         "receipted" : true,
   			         "status" : true,
   			         "_id" : "54e5df3431782b181b78c7fa"
   			     }, 
   			  ],
   			 "companyProfile" : {
   			     "contact" : {
   			         "address2" : "",
   			         "address1" : "",
   			         "companyName" : ""
   			     },
   			     "accounts" : {
   			         "accountsOfficeRef" : "",
   			         "taxDistrictNo" : "",
   			         "utrNumber" : null
   			     },
   			     "bankDetails" : {
   			         "country" : "",
   			         "town" : "",
   			         "address2" : "",
   			         "address1" : ""
   			     },
   			     "defaults" : {
   			         "taxCodeContractors" : "",
   			         "derogationSpreadWeeks" : null,
   			         "contractorStatus" : "3",
   			         "communicationMethod" : "1",
   			         "derogationContract" : "3",
   			         "adminFee" : "1",
   			         "paymentMethod" : "2",
   			         "holidayPayRule" : "1",
   			         "payFrequency" : "weekly"
   			     }
   			 },
   			 "mileageRates" : [ 
   			     {
   			         "type" : "test",
   			         "restriction" : "test restriction",
   			         "amount" : "5"
   			     }, 
   			   
   			     "[object Object]"
   			 ]
		  };
		});

		after(function(){
			mockery.disable();
			//fakes.restore();
		});
	
		beforeEach(function () {
			//fakes=sinon.collection;
        		sinon.stub(process, 'nextTick').yields();
			fakes = sinon.collection;	
    		});
    		afterEach(function () {
    			fakes.restore();
        		process.nextTick.restore();
			//fakes.restore();
    		});
	
	describe('getPayrollTax tests', function(){
		//var getSystemStub;
		before(function(){
			getSystemStub=sinon.stub(systemServiceMock, 'getSystem');
		});
		beforeEach(function(){
			getSystemStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};

			getSystemStub.returns(p);
			systemController.getSystem(req, responseMock);
			d.resolve(systemVm);
			
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:systemVm}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};

			getSystemStub.returns(p);
			systemController.getSystem(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('patchSystem tests', function(){
		var saveSystemStub;
		before(function(){
			saveSystemStub=sinon.stub(systemServiceMock, 'saveSystem');
		});
		beforeEach(function(){
			saveSystemStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={body:systemVm};

			saveSystemStub.returns(p);
			systemController.patchSystem(req, responseMock);
			d.resolve(systemVm);
			
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:systemVm}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={body:systemVm};

			saveSystemStub.returns(p);
			systemController.patchSystem(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('getPaymentRates tests', function(){
		beforeEach(function(){
			getSystemStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};
			var retArr=[{
  				"_id": "54e4e01967837fec0310941a",
  				"hours": 0,
  				"importAliases": ["Bonus"],
 			 	"name": "Bonus",
  				"rateType": "Other"
			}];
			getSystemStub.returns(p);
			systemController.getPaymentRates(req, responseMock);
			d.resolve(systemVm);
			
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,objects:retArr}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};

			getSystemStub.returns(p);
			systemController.getPaymentRates(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('patchPaymentRates tests', function(){
		before(function(){
			savePaymentRatesStub=sinon.stub(systemServiceMock, 'savePaymentRates');
		});
		beforeEach(function(){
			savePaymentRatesStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body: {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};
			var retObj= {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			};

			savePaymentRatesStub.returns(p);
			systemController.patchPaymentRates(req, responseMock);
			d.resolve(retObj);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:retObj}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body: {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};


			savePaymentRatesStub.returns(p);
			systemController.patchPaymentRates(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});
	
	describe('patchPaymentRates tests', function(){
		beforeEach(function(){
			savePaymentRatesStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body: {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};
			var retObj= {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			};

			savePaymentRatesStub.returns(p);
			systemController.postPaymentRates(req, responseMock);
			d.resolve(retObj);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:retObj}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body: {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};


			savePaymentRatesStub.returns(p);
			systemController.postPaymentRates(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('getVat tests', function(){
		before(function(){
			getSystemStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};

			getSystemStub.returns(p);
			systemController.getVat(req, responseMock);
			d.resolve(systemVm);
			
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,objects:systemVm.statutoryTables.vat}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};

			getSystemStub.returns(p);
			systemController.getVat(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});
	
	describe('getCurrentVat tests', function(){
		before(function(){
			getSystemStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={}, x;
			var vat=[ 
   			         {
   			             "amount" : 8,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2011-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7366"
   			         }
   			  ]
	
			getSystemStub.returns(p);
			x = systemController.getCurrentVat(req, responseMock);
			d.resolve(systemVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			//sinon.assert.calledWith(jsonStub, sinon.match({object:{}}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};

			getSystemStub.returns(p);
			systemController.getCurrentVat(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('patchVat tests', function(){
		before(function(){
			saveVatStub=sinon.stub(systemServiceMock, 'saveVat');
		});
		beforeEach(function(){
			saveVatStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body:{
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};
			var vat={
   			             "amount" : 8,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2011-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7366"
   			};

			saveVatStub.returns(p);
			systemController.patchVat(req, responseMock);
			d.resolve(vat);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:vat}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body:{
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};


			saveVatStub.returns(p);
			systemController.patchVat(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});
	describe('postVat tests', function(){
		beforeEach(function(){
			saveVatStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body:{
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};
			var vat={
   			             "amount" : 8,
   			             "validFrom" : "2011-01-01T00:00:00.000Z",
   			             "validTo" : "2011-12-31T00:00:00.000Z",
   			             "_id" : "54e5dd0453a9d2a8031e7366"
   			};

			saveVatStub.returns(p);
			systemController.postVat(req, responseMock);
			d.resolve(vat);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:vat}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body:{
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};


			saveVatStub.returns(p);
			systemController.postVat(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('postExpenseRate tests', function(){
		var addExpenseRateStub;
		before(function(){
			addExpenseRateStub=sinon.stub(systemServiceMock, 'addExpensesRate');
		});
		beforeEach(function(){
			addExpenseRateStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body: {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};
			var retObj= {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			};
			var expenseRates=[ 
   			     {
   			         "name" : "Breakfast",
   			         "amount" : 5,
   			         "taxApplicable" : false,
   			         "expensesRateType" : "1",
   			         "vat" : true,
   			         "dispensation" : true,
   			         "receipted" : true,
   			         "status" : true,
   			         "_id" : "54e5dee54da13c101f6ad698"
   			     }];
			addExpenseRateStub.returns(p);
			systemController.postExpensesRate(req, responseMock);
			d.resolve({result:true, object:{system:systemVm, expenseRate:expenseRates}});

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:systemVm.expenseRate}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body: {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};


			addExpenseRateStub.returns(p);
			systemController.postExpensesRate(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('patchExpensesRate tests', function(){
		var updateExpenseRateStub;
		before(function(){
			updateExpenseRateStub=sinon.stub(systemServiceMock, 'updateExpensesRate');
		});
		beforeEach(function(){
			updateExpenseRateStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body: {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};
			var retObj= {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			};
			var expenseRates=[ 
   			     {
   			         "name" : "Breakfast",
   			         "amount" : 5,
   			         "taxApplicable" : false,
   			         "expensesRateType" : "1",
   			         "vat" : true,
   			         "dispensation" : true,
   			         "receipted" : true,
   			         "status" : true,
   			         "_id" : "54e5dee54da13c101f6ad698"
   			     }];
			updateExpenseRateStub.returns(p);
			systemController.patchExpensesRate(req, responseMock);
			d.resolve({result:true, object:{system:systemVm, expenseRate:expenseRates}});

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:systemVm.expenseRate}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body: {
   			         "name" : "Bonus",
   			         "rateType" : "Other",
   			         "hours" : 0,
   			         "_id" : "54e4e01967837fec0310941a",
   			         "importAliases" : [ 
   			             "Bonus"
   			         ]
			}};


			updateExpenseRateStub.returns(p);
			systemController.patchExpensesRate(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('getAllExpensesRates tests', function(){
		before(function(){
			getSystemStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};
			var expenses_rate=[ 
   			     {
   			         "name" : "Breakfast",
   			         "amount" : 5,
   			         "taxApplicable" : false,
   			         "expensesRateType" : "1",
   			         "vat" : true,
   			         "dispensation" : true,
   			         "receipted" : true,
   			         "status" : true,
   			         "_id" : "54e5dee54da13c101f6ad698"
   			}];
			getSystemStub.returns(p);
			systemController.getAllExpensesRates(req, responseMock);
			d.resolve([systemVm]);
			
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			//sinon.assert.calledWith(jsonStub, sinon.match({objects:expenses_rate}));

			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={};

			getSystemStub.returns(p);
			systemController.getAllExpensesRates(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('getExpensesRates tests', function(){
		before(function(){
			getSystemStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54e5dee54da13c101f6ad698"}};
		
			var system={"expensesRate" : [ 
   			     {
   			         "name" : "Breakfast",
   			         "amount" : 5,
   			         "taxApplicable" : false,
   			         "expensesRateType" : "1",
   			         "vat" : true,
   			         "dispensation" : true,
   			         "receipted" : true,
   			         "status" : true,
   			         "_id" : "54e5dee54da13c101f6ad698"
   			     }]};
			getSystemStub.returns(p);
			systemController.getExpensesRates(req, responseMock);
			d.resolve(system);
			
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:system.expenseRate}));
			done();
		});
		it('should return json failure', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54e5dee54da13c101f6ad698"}};	
			var system={"expensesRate" : [ 
   			     {
   			         "name" : "Breakfast",
   			         "amount" : 5,
   			         "taxApplicable" : false,
   			         "expensesRateType" : "1",
   			         "vat" : true,
   			         "dispensation" : true,
   			         "receipted" : true,
   			         "status" : true,
   			         "_id" : "54e5dee54da13c101f6ad698"
   			     }]};
	
			getSystemStub.returns(p);
			systemController.getAllExpensesRates(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

});
			


