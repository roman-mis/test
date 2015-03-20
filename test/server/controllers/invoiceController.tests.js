'use strict';

var sinon=require('sinon'),
	mockery=require('mockery'),
	chai=require('chai'),
	expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('invoiceController',function(){
		var responseMock, responseObj, reqObj, jsonStub, sendFailureResponseStub;
		var invoiceServiceMock, invoiceController, fakes, dbMock, sandbox;
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
		invoiceServiceMock={'getAllInvoices':function(){},'saveInvoice':function(){},'getInvoice':function(){}};
		mockery.registerMock('../services/invoiceservice', function(){ return invoiceServiceMock});
		invoiceController=require('../../../server/controllers/invoiceController')(null);

		//reqObj={params:{'id':'54c91c2c56a277d41709d346'}};

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
    			//fakes.restore();
        		process.nextTick.restore();
			fakes.restore();
    		});
	
	describe('getAllInvoices tests', function(){
		var getAllInvoicesStub;
		before(function(){
				getAllInvoicesStub=sinon.stub(invoiceServiceMock, 'getAllInvoices');
			
		});
		beforeEach(function(){
	
			getAllInvoicesStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var vm={
    				"_id" : "54ef4e8a27df3cfc191b3779",
    				"invoiceNumber" : 44,
    				"agency" : "54c8bb4b27df08b003488587",
    				"branch" : "54cf4bb692f35e88183b639a",
    				"timesheetBatch" : "54ef2199a8ca4c5c1649a2e3",
    				"dueDate" : "2015-01-02T00:00:00.000Z",
    				"net" : 0,
    				"vatRate" : 0,
    				"vat" : 0,
    				"total" : 0,
    				"updatedDate" : "2015-02-26T16:49:14.200Z",
    				"createdDate" : "2015-02-26T16:49:14.200Z",
    				"companyDefaults" : {
        			"holidayPayIncluded" : true,
        			"vatCharged" : true,
        			"invoiceDesign" : "54d39d472d823bb02d3a4826",
        			"marginAmount" : 123,
        			"invoiceEmailPrimary" : "test@gmail.com",
				"invoiceEmailSecondary" : "test@gmail.com",
        			"paymentTerms" : "1",
        			"marginChargedToAgency" : true
    				},
    				"lines" : [
        				{
            				"worker" : "54c6699cb50b1f740f5a7d30",
            				"lineType" : "timesheet",
           				 "_id" : "54ef4e8a27df3cfc191b377a",
            				"elements" : [
                				{
                    				"text" : "Standard Hourly Rate",
                    				"units" : 400,
                    				"rate" : null,
                    				"total" : 480,
                   			 	"_id" : "54ef4e8a27df3cfc191b377b"
                				}
            				]
				}
   				 ],
   					 "date" : "2015-01-02T00:00:00.000Z",
  					  "__v" : 0
			};

				
   			var req={_restOptions: {}};
			var retObj={};
			var arr=[];
			arr.push(vm);
			//var req={_restOptions:{}};
			var d=Q.defer();
			var p=d.promise;

			getAllInvoicesStub.returns(p);
			//d.resolve();
			invoiceController.getAllInvoices(req, responseMock);
			d.resolve({});
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));
			sinon.assert.calledWith(jsonStub,sinon.match({objects:[]}));
			done();
		});

		it('should return json failure response', function(done){
			var retObj={};
			var req={_restOptions: []};
			
   			var vm={
    				"_id" : "54ef4e8a27df3cfc191b3779",
    				"invoiceNumber" : 44,
    				"agency" : "54c8bb4b27df08b003488587",
    				"branch" : "54cf4bb692f35e88183b639a",
    				"timesheetBatch" : "54ef2199a8ca4c5c1649a2e3",
    				"dueDate" : "2015-01-02T00:00:00.000Z",
    				"net" : 0,
    				"vatRate" : 0,
    				"vat" : 0,
    				"total" : 0,
    				"updatedDate" : "2015-02-26T16:49:14.200Z",
    				"createdDate" : "2015-02-26T16:49:14.200Z",
    				"companyDefaults" : {
        			"holidayPayIncluded" : true,
        			"vatCharged" : true,
        			"invoiceDesign" : "54d39d472d823bb02d3a4826",
        			"marginAmount" : 123,
        			"invoiceEmailPrimary" : "test@gmail.com",
				"invoiceEmailSecondary" : "test@gmail.com",
        			"paymentTerms" : "1",
        			"marginChargedToAgency" : true
    				},
    				"lines" : [
        				{
            				"worker" : "54c6699cb50b1f740f5a7d30",
            				"lineType" : "timesheet",
           				 "_id" : "54ef4e8a27df3cfc191b377a",
            				"elements" : [
                				{
                    				"text" : "Standard Hourly Rate",
                    				"units" : 400,
                    				"rate" : null,
                    				"total" : 480,
                   			 	"_id" : "54ef4e8a27df3cfc191b377b"
                				}
            				]
				}
   				 ],
   					 "date" : "2015-01-02T00:00:00.000Z",
  					  "__v" : 0
			};

	 
			var d=Q.defer();
			var p=d.promise;

			getAllInvoicesStub.returns(p);
		
			invoiceController.getAllInvoices(req, responseMock);
			d.reject({result:false, name:'NOTFOUND'});	
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();
		});
	});

	describe('postInvoice tests', function(){
		var saveInvoiceStub;
		before(function(){
			saveInvoiceStub=sinon.stub(invoiceServiceMock, 'saveInvoice');
		});
		beforeEach(function(){
			saveInvoiceStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true with invoice object', function(done){
			var retObj={result: true, object:{
   			 "_id" : "54c91c2c56a277d41709d346",
   			 "name" : "Invoice Design1",
    			 "content" : "This is the invoice design 1 content",
   			 "updatedDate" : "2015-01-28T17:28:12.508Z",
   			 "createdDate" : "2015-01-28T17:28:12.508Z"
			}};
			var req={params:{
   			 "id" : "54c91c2c56a277d41709d346"},
			 body:	{"_id" : "54ef4e8a27df3cfc191b3779",
    				"invoiceNumber" : 44,
    				"agency" : "54c8bb4b27df08b003488587",
    				"branch" : "54cf4bb692f35e88183b639a",
    				"timesheetBatch" : "54ef2199a8ca4c5c1649a2e3",
    				"dueDate" : "2015-01-02T00:00:00.000Z",
    				"net" : 0,
    				"vatRate" : 0,
    				"vat" : 0,
    				"total" : 0,
    				"updatedDate" : "2015-02-26T16:49:14.200Z",
    				"createdDate" : "2015-02-26T16:49:14.200Z",
    				"companyDefaults" : {
        			"holidayPayIncluded" : true,
        			"vatCharged" : true,
        			"invoiceDesign" : "54d39d472d823bb02d3a4826",
        			"marginAmount" : 123,
        			"invoiceEmailPrimary" : "test@gmail.com",
				"invoiceEmailSecondary" : "test@gmail.com",
        			"paymentTerms" : "1",
        			"marginChargedToAgency" : true
    				},
    				"lines" : [
        				{
            				"worker" : "54c6699cb50b1f740f5a7d30",
            				"lineType" : "timesheet",
           				 "_id" : "54ef4e8a27df3cfc191b377a",
            				"elements" : [
                				{
                    				"text" : "Standard Hourly Rate",
                    				"units" : 400,
                    				"rate" : null,
                    				"total" : 480,
                   			 	"_id" : "54ef4e8a27df3cfc191b377b"
                				}
            				]
				}
   				 ],
   					 "date" : "2015-01-02T00:00:00.000Z",
  					  "__v" : 0
			}};

			var vm={
    				"_id" : "54ef4e8a27df3cfc191b3779",
    				"invoiceNumber" : 44,
    				"agency" : "54c8bb4b27df08b003488587",
    				"branch" : "54cf4bb692f35e88183b639a",
    				"timesheetBatch" : "54ef2199a8ca4c5c1649a2e3",
    				"dueDate" : "2015-01-02T00:00:00.000Z",
    				"net" : 0,
    				"vatRate" : 0,
    				"vat" : 0,
    				"total" : 0,
    				"updatedDate" : "2015-02-26T16:49:14.200Z",
    				"createdDate" : "2015-02-26T16:49:14.200Z",
    				"companyDefaults" : {
        			"holidayPayIncluded" : true,
        			"vatCharged" : true,
        			"invoiceDesign" : "54d39d472d823bb02d3a4826",
        			"marginAmount" : 123,
        			"invoiceEmailPrimary" : "test@gmail.com",
				"invoiceEmailSecondary" : "test@gmail.com",
        			"paymentTerms" : "1",
        			"marginChargedToAgency" : true
    				},
    				"lines" : [
        				{
            				"worker" : "54c6699cb50b1f740f5a7d30",
            				"lineType" : "timesheet",
           				 "_id" : "54ef4e8a27df3cfc191b377a",
            				"elements" : [
                				{
                    				"text" : "Standard Hourly Rate",
                    				"units" : 400,
                    				"rate" : null,
                    				"total" : 480,
                   			 	"_id" : "54ef4e8a27df3cfc191b377b"
                				}
            				]
				}
   				 ],
   					 "date" : "2015-01-02T00:00:00.000Z",
  					  "__v" : 0
			};

	
			//var x; 
			var d=Q.defer();
			var p=d.promise;

			saveInvoiceStub.returns(p);
			invoiceController.postInvoice(req, responseMock);
			d.resolve([vm]);
			//x.then(function(returned){
			//	expect(returned).to.be.ok();
			//	expect(returned).to.have.property('name');
			//});
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));
			sinon.assert.calledWith(jsonStub,sinon.match({object:[vm]}));
			done();
		});

		it('should return json result true with invoice object', function(done){
			var req={}; 
			var d=Q.defer();
			var p=d.promise;

			saveInvoiceStub.returns(p);
			invoiceController.postInvoice(req, responseMock);
			d.reject({result:false, name:'NOTFOUND'});			
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();
		});

	
	});

	describe('getInvoice tests', function(){
		var getInvoiceStub;
		before(function(){
			getInvoiceStub=sinon.stub(invoiceServiceMock, 'getInvoice');
			//getInvoiceVmStub=fakes.stub(invoiceServiceMock, 'getInvoiceVm');
		});
		beforeEach(function(){
			getInvoiceStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});

		it('should return json result true with invoice object', function(done){
				var vm={
    				"_id" : "54ef4e8a27df3cfc191b3779",
    				"invoiceNumber" : 44,
    				"agency" : "54c8bb4b27df08b003488587",
    				"branch" : "54cf4bb692f35e88183b639a",
    				"timesheetBatch" : "54ef2199a8ca4c5c1649a2e3",
    				"dueDate" : "2015-01-02T00:00:00.000Z",
    				"net" : 0,
    				"vatRate" : 0,
    				"vat" : 0,
    				"total" : 0,
    				"updatedDate" : "2015-02-26T16:49:14.200Z",
    				"createdDate" : "2015-02-26T16:49:14.200Z",
    				"companyDefaults" : {
        			"holidayPayIncluded" : true,
        			"vatCharged" : true,
        			"invoiceDesign" : "54d39d472d823bb02d3a4826",
        			"marginAmount" : 123,
        			"invoiceEmailPrimary" : "test@gmail.com",
				"invoiceEmailSecondary" : "test@gmail.com",
        			"paymentTerms" : "1",
        			"marginChargedToAgency" : true
    				},
    				"lines" : [
        				{
            				"worker" : "54c6699cb50b1f740f5a7d30",
            				"lineType" : "timesheet",
           				 "_id" : "54ef4e8a27df3cfc191b377a",
            				"elements" : [
                				{
                    				"text" : "Standard Hourly Rate",
                    				"units" : 400,
                    				"rate" : null,
                    				"total" : 480,
                   			 	"_id" : "54ef4e8a27df3cfc191b377b"
                				}
            				]
				}
   				 ],
   					 "date" : "2015-01-02T00:00:00.000Z",
  					  "__v" : 0
			};

	
			var req={params:{'id':'54ef4e8a27df3cfc191b3779'}}; 
			var d=Q.defer();
			var p=d.promise;
			
	
			getInvoiceStub.returns(p);
			invoiceController.getInvoice(req, responseMock);
			d.resolve([vm]);
			
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));
			sinon.assert.calledWith(jsonStub,sinon.match({object:{}}));	
			done();
		});

		it('should return json result true with invoice object', function(done){
				var vm={
    				"_id" : "54ef4e8a27df3cfc191b3779",
    				"invoiceNumber" : 44,
    				"agency" : "54c8bb4b27df08b003488587",
    				"branch" : "54cf4bb692f35e88183b639a",
    				"timesheetBatch" : "54ef2199a8ca4c5c1649a2e3",
    				"dueDate" : "2015-01-02T00:00:00.000Z",
    				"net" : 0,
    				"vatRate" : 0,
    				"vat" : 0,
    				"total" : 0,
    				"updatedDate" : "2015-02-26T16:49:14.200Z",
    				"createdDate" : "2015-02-26T16:49:14.200Z",
    				"companyDefaults" : {
        			"holidayPayIncluded" : true,
        			"vatCharged" : true,
        			"invoiceDesign" : "54d39d472d823bb02d3a4826",
        			"marginAmount" : 123,
        			"invoiceEmailPrimary" : "test@gmail.com",
				"invoiceEmailSecondary" : "test@gmail.com",
        			"paymentTerms" : "1",
        			"marginChargedToAgency" : true
    				},
    				"lines" : [
        				{
            				"worker" : "54c6699cb50b1f740f5a7d30",
            				"lineType" : "timesheet",
           				 "_id" : "54ef4e8a27df3cfc191b377a",
            				"elements" : [
                				{
                    				"text" : "Standard Hourly Rate",
                    				"units" : 400,
                    				"rate" : null,
                    				"total" : 480,
                   			 	"_id" : "54ef4e8a27df3cfc191b377b"
                				}
            				]
				}
   				 ],
   					 "date" : "2015-01-02T00:00:00.000Z",
  					  "__v" : 0
			};

	
			var req={params:{'id':'54ef4e8a27df3cfc191b3779'}}; 
			var d=Q.defer();
			var p=d.promise;
			
	
			getInvoiceStub.returns(p);
			invoiceController.getInvoice(req, responseMock);
			d.reject({result:false, name:'NOTFOUND'});			
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();
		});
	
	});


});
	
