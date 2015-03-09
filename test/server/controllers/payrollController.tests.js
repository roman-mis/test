'use strict';

var sinon=require('sinon'),
	mockery=require('mockery'),
	chai=require('chai'),
	expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('invoiceContrller',function(){
	       var responseMock, payrollServiceMock, payrollController,jsonStub, sendFailureResponseStub,buildTimesheetVmStub;
	       var savePayroll, getTimesheetVmStub, saveTimesheetStub,fakes, savePayrollStub, getPayrollVmMock, getPayrollStub;
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
		payrollServiceMock={'getAllPayrolls':function(){},'getPayrollVm':function(){},'savePayroll': function(){},'buildPayrollVm':function(){},'getPayroll':function(){},'runPayroll':function(){}};
		mockery.registerMock('../services/payrollservice', function(){ return payrollServiceMock; });
		payrollController=require('../../../server/controllers/payrollController')(null);
		//getPayrollVmMock={'getPayrollVm':function(){}};
		//getTimesheetVmStub=sinon.stub(timesheetServiceMock, 'getTimesheetVm');
		});

		after(function(){
			mockery.disable();
			//fakes.restore();
		});
	
		beforeEach(function () {
			//getTimesheetVmStub=sinon.stub(timesheetServiceMock, 'getTimesheetVm');	
        		sinon.stub(process, 'nextTick').yields();
			//fakes = sinon.collection;	
    		});
    		afterEach(function () {
    			//fakes.restore();
        		process.nextTick.restore();
			//getTimesheetVmStub.restore();
			//fakes.restore();
    		});
	
	describe('getAllPayrolls tests', function(){
		var getAllPayrollsStub, getPayrollVmStub;
		before(function(){
			getAllPayrollsStub=sinon.stub(payrollServiceMock, 'getAllPayrolls');
		
		});
		beforeEach(function(){
			getAllPayrollsStub.reset();
			//getPayrollVmStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json with true result', function(done){
			var d=Q.defer();
			var p=d.promise;
			//var req={_restOptions: []};
			var req={_restOptions: []};
	
			var retObj={
    				"_id" : "54eb41964ce75de02435332b",
    				"weekNumber" : 1,
    				"monthNumber" : 3,
    				"periodType" : "weekly",
   				 "isCurrent" : true,
   				 "date" : "2015-02-23T15:04:53.840Z",
    				"createdBy" : "54cfcdfe79c0668e752fc45b",
    				"updatedDate" : "2015-02-23T15:04:54.846Z",
    				"agencies" : [ 
        				{
           					 "agency" : "54c8bb4b27df08b003488587",
            					"scheduleReceived" : true,
					}
				]
			};
			var arr=[];
			arr.push(retObj);
			getAllPayrollsStub.returns(p);

			//=function(){
			//	return(retObj);
			//};
			payrollController.getAllPayrolls(req, responseMock);
			d.resolve(arr);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({objects:[],result:true}));
			done();

		});
		it('should return json false object', function(done){
				var retObj={result:true};
				var d=Q.defer();
				var p=d.promise;
				var req={_restOptions: []};
				var retObj={
    				"_id" : "54eb41964ce75de02435332b",
    				"weekNumber" : 1,
    				"monthNumber" : 3,
    				"periodType" : "weekly",
   				 "isCurrent" : true,
   				 "date" : "2015-02-23T15:04:53.840Z",
    				"createdBy" : "54cfcdfe79c0668e752fc45b",
    				"updatedDate" : "2015-02-23T15:04:54.846Z",
    				"agencies" : [ 
        				{
           					 "agency" : {"id": "54c8bb4b27df08b003488587"},
            					"scheduleReceived" : true,
					}
					]
				};

				getAllPayrollsStub.returns(p);
				payrollController.getAllPayrolls(req, responseMock);
				d.reject();
			
				sinon.assert.calledOnce(sendFailureResponseStub);
				//sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
				//we are done with the test
				done();
		});

	});

	describe('getPayroll tests', function(){
		before(function(){
			getPayrollStub=sinon.stub(payrollServiceMock, 'getPayroll');
			//getPayrollVmStub=sinon.stub(payrollController, 'getPayrollVm');
		});
		beforeEach(function(){
			getPayrollStub.reset();
			//getPayrollVmStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json with true result', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{'id':'54ef2199a8ca4c5c1649a2e4'}};

			var retObjz={
    				"_id" : "54eb41964ce75de02435332b",
    				"weekNumber" : 1,
    				"monthNumber" : 3,
    				"periodType" : "weekly",
   				 "isCurrent" : true,
   				 "date" : "2015-02-23T15:04:53.840Z",
    				"createdBy" : "54cfcdfe79c0668e752fc45b",
    				"updatedDate" : "2015-02-23T15:04:54.846Z",
    				"agencies" : [ 
        				{
           					 "agency" : "54c8bb4b27df08b003488587",
            					"scheduleReceived" : true,
					}
				]
			};
			var retObj={}
			getPayrollStub.returns(p);
			//getPayrollVmMock=function(){
			//	return(retObj);
			//};
			payrollController.getPayroll(req, responseMock);
			d.resolve(retObj);

			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true, object:{}}));
			done();

		});
		it('should return json false object', function(done){
				var retObj={result:true};
				var d=Q.defer();
				var p=d.promise;
				var req={params:{'id':'54ef2199a8ca4c5c1649a2e4'}};	

				getPayrollStub.returns(p);
				//getPayrollVmStub=function(){
				//	return(retObj);
				//};
				payrollController.getPayroll(req, responseMock);
				d.reject({result:false,name:'NOTFOUND'});
			
				sinon.assert.calledOnce(sendFailureResponseStub);
				sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
				//we are done with the test
				done();
		});

	});

	describe('postPayroll tests', function(){
		//var savePayrollStub;
		before(function(){
			savePayrollStub=sinon.stub(payrollServiceMock, 'savePayroll');
			//getPayrollAgainStub=fakes.stub(payrollServiceMock, 'getPayroll');

		});
		beforeEach(function(){
			savePayrollStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should call savePayroll which should return json true result', function(done){
			var d=Q.defer();
			var p=d.promise;
			var x=Q.defer();
			var y=x.promise;

			var reqObj={params:{'id':'54ef2199a8ca4c5c1649a2e4'},
    				"_id" : "54eb41964ce75de02435332b",
    				"weekNumber" : 1,
    				"monthNumber" : 3,
    				"periodType" : "weekly",
   				 "isCurrent" : true,
   				 "date" : "2015-02-23T15:04:53.840Z",
    				"createdBy" : "54cfcdfe79c0668e752fc45b",
    				"updatedDate" : "2015-02-23T15:04:54.846Z",
    				"agencies" : [ 
        				{
           					 "agency" : "54c8bb4b27df08b003488587",
            					"scheduleReceived" : true,
					}
				]
			};

			savePayrollStub.returns(p);
			getPayrollStub.returns(y);
			payrollController.postPayroll(reqObj, responseMock);
			d.resolve({result:true, object:reqObj});
			x.resolve({result:true, object:reqObj});
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true, object:{}}));
			done();

		});
	});	
	
	describe('patchPayroll tests', function(){
		//var savePayrollChubStub;
		//before(function(){
			//savePayrollChubStub=fakes.stub(payrollServiceMock, 'savePayroll');
			//getPayrollAgainsStub=fakes.stub(payrollServiceMock, 'getPayroll');
	
		//});
		beforeEach(function(){
			//savePayrollChubStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should call savePayroll which should return json true result', function(done){
			var d=Q.defer();
			var p=d.promise;
			var x=Q.defer();
			var y=x.promise;

			var reqObj={params:{'id':'54ef2199a8ca4c5c1649a2e4'},
    				"_id" : "54eb41964ce75de02435332b",
    				"weekNumber" : 1,
    				"monthNumber" : 3,
    				"periodType" : "weekly",
   				 "isCurrent" : true,
   				 "date" : "2015-02-23T15:04:53.840Z",
    				"createdBy" : "54cfcdfe79c0668e752fc45b",
    				"updatedDate" : "2015-02-23T15:04:54.846Z",
    				"agencies" : [ 
        				{
           					 "agency" : "54c8bb4b27df08b003488587",
            					"scheduleReceived" : true,
					}
				]
			};

			savePayrollStub.returns(p);
			getPayrollStub.returns(y);
			payrollController.patchPayroll(reqObj, responseMock);
			d.resolve({result:true, object:reqObj});
			x.resolve({result:true, object:reqObj});
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true, object:{}}));
			done();

		});
	});	
	describe('runPayroll tests', function(){
		var runPayrollStub;
		before(function(){
			runPayrollStub=sinon.stub(payrollServiceMock, 'runPayroll');
		});
		beforeEach(function(){
			runPayrollStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('Should return json object containing result', function(done){
			var d=Q.defer();
			var p=d.promise;
			var reqMock={};

			runPayrollStub.returns(p);
			payrollController.runPayroll(reqMock, responseMock);
			d.resolve({});
			done();
		});
	});



});




	

