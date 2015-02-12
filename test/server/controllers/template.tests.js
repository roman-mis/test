'use strict'

var sinon=require('sinon'),
	mockery=require('mockery'),
	// chai=require('chai'),
	// expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('template',function(){
	var requestMock, responseMock, templateController, templateServiceMock, postTemplateMock, getTemplateRequestMock;
	var jsonStub, sendFailureResponseStub;

	before(function(){
		mockery.enable({
			warnOnReplace:false,
			warnOnUnregistered:false,
			useCleanCache:true
		});

	responseMock={'json':function(){},'sendFailureResponse':function(){}};
	jsonStub=sinon.stub(responseMock, 'json');
	sendFailureResponseStub=sinon.stub(responseMock,'sendFailureResponse');

	templateServiceMock={'getAllTemplates':function(){}, 'postTemplate':function(){},'addTemplate':function(){},'getTemplate':function(){}};
	mockery.registerMock('../services/templateservice',templateServiceMock);
	templateController=require('../../../server/controllers/template')(null);
	getTemplateRequestMock={body:{},params:{"_id" : "54c8f8a73b417dfc00ae9c9b"}};
	postTemplateMock={body:{
    			"_id" : "54c8f8a73b417dfc00ae9c9b",
    			"title" : "Payslip Task template title",
    			"templateBody" : "Payslip for  the candidate template body",
    			"templateType" : "TASK",
    			"updatedDate" : "2015-01-28T14:56:39.407Z",
    			"createdDate" : "2015-01-28T14:56:39.407Z",
    			"__v" : 0
		}};

	requestMock={};

	});

	after(function(){
		mockery.disable();
	});
	//Before each function call, call first callback that this stub receives..
	beforeEach(function () {
        sinon.stub(process, 'nextTick').yields();
    });
    afterEach(function () {
        process.nextTick.restore();
    });

     describe('#getAllTemplates', function(){
        var template, getAllTemplatesStub;
     	before(function(){
		template={
    			"_id" : "54c8f8a73b417dfc00ae9c9b",
    			"title" : "Payslip Task template title",
    			"templateBody" : "Payslip for  the candidate template body",
    			"templateType" : "TASK",
    			"updatedDate" : "2015-01-28T14:56:39.407Z",
    			"createdDate" : "2015-01-28T14:56:39.407Z",
    			"__v" : 0
		};
		getAllTemplatesStub=sinon.stub(templateServiceMock, 'getAllTemplates');
	});
		
		beforeEach(function(){
			
			getAllTemplatesStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		//test case
		it('should return task details',function(done){
			var d=Q.defer();
			var p=d.promise;

			getAllTemplatesStub.returns(p);
			templateController.getAllTemplates(requestMock, responseMock);
			var temp = template[0];
			d.resolve(template);
			console.log("temp is....");
			console.log(temp);
			sinon.assert.calledOnce(jsonStub);

			//if everything went as planned res.json should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));

			sinon.assert.calledWith(jsonStub,sinon.match({object:temp}));
			//we are done with the test
			done();
		});

		it('should send failure response on error',function(done){

			var d=Q.defer();
			var p=d.promise;

			getAllTemplatesStub.returns(p);

			templateController.getAllTemplates(requestMock,responseMock);
			d.reject({result:false,name:'NOTFOUND'});
			
			sinon.assert.calledOnce(sendFailureResponseStub);

			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
			//we are done with the test
			done();


		});

});


	describe('#postTemplates', function(){
        var template, postTemplateStub;
     	before(function(){
		template={
    			"_id" : "54c8f8a73b417dfc00ae9c9b",
    			"title" : "Payslip Task template title",
    			"templateBody" : "Payslip for  the candidate template body",
    			"templateType" : "TASK",
    			"updatedDate" : "2015-01-28T14:56:39.407Z",
    			"createdDate" : "2015-01-28T14:56:39.407Z",
    			"__v" : 0
		};
		postTemplateStub=sinon.stub(templateServiceMock, 'postTemplate');

	});
		
		beforeEach(function(){
			
			postTemplateStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		//test case
		it('should return task details',function(done){
			var d=Q.defer();
			var p=d.promise;

			postTemplateStub.returns(p);
			templateController.postTemplate(postTemplateMock, responseMock);
			var temp = template[0];
			d.resolve(template);
			console.log("temp is....");
			console.log(temp);
			sinon.assert.calledOnce(jsonStub);

			//if everything went as planned res.json should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));

			sinon.assert.calledWith(jsonStub,sinon.match({object:temp}));
			//we are done with the test
			done();
		});

		it('should send failure response on error',function(done){

			var d=Q.defer();
			var p=d.promise;

			postTemplateStub.returns(p);

			templateController.postTemplate(postTemplateMock,responseMock);
			d.reject({result:false,name:'NOTFOUND'});
			
			sinon.assert.calledOnce(sendFailureResponseStub);

			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
			//we are done with the test
			done();


		});



});

	describe('#getTemplate', function(){
        var template, getTemplateStub;
     	before(function(){
		template={
    			"_id" : "54c8f8a73b417dfc00ae9c9b",
    			"title" : "Payslip Task template title",
    			"templateBody" : "Payslip for  the candidate template body",
    			"templateType" : "TASK"
    			//"updatedDate" : "2015-01-28T14:56:39.407Z",
    			//"createdDate" : "2015-01-28T14:56:39.407Z",
    			
		};
		getTemplateStub=sinon.stub(templateServiceMock, 'getTemplate');
	});
		
		beforeEach(function(){
			
			getTemplateStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		//test case
		it('should return task details',function(done){
			var d=Q.defer();
			var p=d.promise;

			getTemplateStub.returns(p);
			templateController.getTemplate(getTemplateRequestMock, responseMock);
			var temp = template[0];
			d.resolve(template);
			console.log("temp is....");
			console.log(temp);
			sinon.assert.calledOnce(jsonStub);

			//if everything went as planned res.json should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));

			sinon.assert.calledWith(jsonStub,sinon.match({object:template}));
			//we are done with the test
			done();
		});

		it('should send failure response on error',function(done){

			var d=Q.defer();
			var p=d.promise;

			getTemplateStub.returns(p);

			templateController.getTemplate(getTemplateRequestMock,responseMock);
			d.reject({result:false,name:'NOTFOUND'});
			
			sinon.assert.calledOnce(sendFailureResponseStub);

			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
			//we are done with the test
			done();


		});

});

});

