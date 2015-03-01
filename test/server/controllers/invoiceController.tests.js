'use strict';

var sinon=require('sinon'),
	mockery=require('mockery'),
	chai=require('chai'),
	expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('invoiceContrller',function(){
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
		invoiceServiceMock={'getInvoiceVm':function(){},'getAllInvoices':function(){},'saveInvoice':function(){},'getInvoice':function(){}};
		mockery.registerMock('../services/invoiceservice', function(){ return invoiceServiceMock});
		invoiceController=require('../../../server/controllers/invoiceController')(null);
		responseObj={};
		reqObj={params:{'id':'54c91c2c56a277d41709d346'}};
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
		var getAllInvoicesStub, getInvoiceVmStub;
		before(function(){
				getAllInvoicesStub=sinon.stub(invoiceServiceMock, 'getAllInvoices');
				getInvoiceVmStub=fakes.stub(invoiceServiceMock, 'getInvoiceVm');
		});
		beforeEach(function(){
			getInvoiceVmStub.reset();
			getAllInvoicesStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var vm={
   			 "_id" : "54c91c2c56a277d41709d346",
   			 "name" : "Invoice Design1",
    			 "content" : "This is the invoice design 1 content",
   			 "updatedDate" : "2015-01-28T17:28:12.508Z",
   			 "createdDate" : "2015-01-28T17:28:12.508Z"
			};
			var req={_restOptions: []};
			var retObj={};
			//var req={_restOptions:{}};
			var d=Q.defer();
			var p=d.promise;

			getAllInvoicesStub.returns(p);
			getInvoiceVmStub.returns(vm);
			invoiceController.getAllInvoices(req, responseMock);
			d.resolve(retObj);
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true, objects:{}}));
			done();
		});

		it('should return json failure response', function(done){
			var retObj={};
			var req={_restOptions: []};
			var vm={
   			 "_id" : "54c91c2c56a277d41709d346",
   			 "name" : "Invoice Design1",
    			 "content" : "This is the invoice design 1 content",
   			 "updatedDate" : "2015-01-28T17:28:12.508Z",
   			 "createdDate" : "2015-01-28T17:28:12.508Z"
			};

			var d=Q.defer();
			var p=d.promise;

			getAllInvoicesStub.returns(p);
			getInvoiceVmStub.returns(vm);
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
			var req={
   			 "_id" : "54c91c2c56a277d41709d346",
   			 "name" : "Invoice Design1",
    			 "content" : "This is the invoice design 1 content",
   			 "updatedDate" : "2015-01-28T17:28:12.508Z",
   			 "createdDate" : "2015-01-28T17:28:12.508Z"
			};
	
			var x; 
			var d=Q.defer();
			var p=d.promise;

			saveInvoiceStub.returns(p);
			invoiceController.postInvoice(req, responseObj);
			d.resolve(retObj);
			//x.then(function(returned){
			//	expect(returned).to.be.ok();
			//	expect(returned).to.have.property('name');
			//});
			//sinon.assert.calledOnce(jsonStub);
			//sinon.assert.calledWith(jsonStub,sinon.match({result:true, object:{}}));
			done();
		});

		it('should return json result true with invoice object', function(done){
			var req={}; 
			var d=Q.defer();
			var p=d.promise;

			saveInvoiceStub.returns(p);
			invoiceController.postInvoice(req, responseObj);
			d.reject({result:false, name:'NOTFOUND'});			
			//sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();
		});

	
	});

	describe('getInvoice tests', function(){
		var getInvoiceStub, getInvoiceVmStub;
		before(function(){
			getInvoiceStub=sinon.stub(invoiceServiceMock, 'getInvoice');
			getInvoiceVmStub=fakes.stub(invoiceServiceMock, 'getInvoiceVm');
		});
		beforeEach(function(){
			getInvoiceStub.reset();
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
			var vm={
   			 "_id" : "54c91c2c56a277d41709d346",
   			 "name" : "Invoice Design1",
    			 "content" : "This is the invoice design 1 content",
   			 "updatedDate" : "2015-01-28T17:28:12.508Z",
   			 "createdDate" : "2015-01-28T17:28:12.508Z"
			};

			var req={}; 
			var d=Q.defer();
			var p=d.promise;
			
			getInvoiceVmStub.returns(vm);
			getInvoiceStub.returns(p);
			invoiceController.getInvoice(reqObj, responseObj);
			d.resolve(vm);
			
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true, object:vm}));
			done();
		});
	});


});
	
