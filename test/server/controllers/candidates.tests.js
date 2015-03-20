'use strict';

var sinon=require('sinon'),
	mockery=require('mockery'),
	chai=require('chai'),
	expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('candidatesController',function(){
		var responseMock, jsonStub, sendFailureResponseStub,candidatesController, awsServiceMock;
		var getUserStub, sandbox, getStub,dbMock, reqMock,userVm, candidateCommonMock,candidateServiceMock, fakes;
		before(function(){
		
		//mockery configuration
		mockery.enable({
			warnOnReplace:false,
			warnOnUnregistered:false,
			useCleanCache:true
		});
		reqMock={'get':function(){}};
		responseMock={'json':function(){},'sendFailureResponse':function(){}};
		jsonStub=sinon.stub(responseMock,'json');
		getStub=sinon.stub(reqMock,'get');
		sendFailureResponseStub=sinon.stub(responseMock,'sendFailureResponse');
		candidateCommonMock={'getDocumentViewModel':function(){},'getUserByEmail':function(){}};
		awsServiceMock={'getS3Object':function(){}};
		
		candidateServiceMock={'getUserAgencies':function(){},'uploadDocuments':function(){},'uploadAvatar':function(){},
			'getUser':function(){},'getAllCandidates':function(){},'updateContactDetail':function(){},
			'getUserByEmail':function(){},'updateBankDetails':function(){},'signup':function(){},
			'updateVehicleInformation':function(){}};
		dbMock={};
		mockery.registerMock('../services/candidateservice', function(){ return candidateServiceMock;});
		mockery.registerMock('../services/candidatecommonservice', function(){ return candidateCommonMock;});
		candidatesController=require('../../../server/controllers/candidates')(dbMock);
		userVm={
    			"_id" : "54c6699cb50b1f740f5a7d30",
    			"candidate_no" : 1,
  			  "activationCode" : "6d9a2f70-a577-11e4-a74f-8553e93f833e",
  			  "title" : "Mr",
  			  "firstName" : "ishwor",
  			  "lastName" : "m",
  			  "emailAddress" : "ishwor@makeitsimple.info",
  			  "userType" : "WK",
  			  "updated_date" : "2015-01-26T16:21:48.604Z",
  			  "created_date" : "2015-01-26T16:21:48.604Z",
  			  "dpaUpdatedDate" : "2015-01-29T12:03:10.642Z",
  			  "documents" : [ 
  			      {
  			          "documentName" : "wnmrge",
  			          "documentType" : "3",
  			          "agency" : "54c8bb4b27df08b003488587",
  			          "generatedName" : "1422462334949_winmerge.2.14.0.nupkg",
  			          "mimeType" : "text/plain",
  			          "uploadedBy" : "54c6699cb50b1f740f5a7d30",
  			          "uploadedDate" : "2015-01-28T16:30:47.316Z",
  			          "_id" : "54c90eb756a277d41709d345"
  			      }
  			  ],
  			  "worker" : {
  			      "contactNumber" : "9999999",
  			      "town" : "Sheffield",
  			      "county" : "Sheffield",
  			      "postCode" : "GU16 7HF",
  			      "arrivalDate" : null,
  			      "recentDepDate" : null,
  			      "agencyName" : "some agency",
  			      "jobTitle" : "Developer",
  			      "bankDetail" : {
  			          "bankName" : "Sheffield Bank",
  			          "accountName" : "ac/name",
  			          "sortCode" : "9989",
  			          "accountNo" : "45454",
  			          "bankRollNo" : "5555"
  			      },
  			      "taxDetail" : {
  			          "p45Uploaded" : true,
  			          "niNumber" : "AA 22 33 55 B"
  			      },
  			      "address_1" : "address 1",
  			      "address_2" : "address 2",
  			      "address_3" : "address 3",
  			      "nationality" : "1",
  			      "payrollTax" : {
  			          "declaration" : "0",
  			          "p45GrossTax" : 20,
  			          "p45TaxDeducted" : 30,
  			          "payFrequency" : "2",
  			          "taxBasis" : "2",
  			          "taxCode" : "32"
  			      },
  			      "startDate" : "2014-12-31T18:15:00.000Z",
  			      "payrollProduct" : [ 
  			          {
  			              "agency" : "54c8bb4b27df08b003488587",
  			              "agencyRef" : "a",
  			              "margin" : "3",
  			              "marginFixed" : 1,
  			              "holidayPayRule" : "2",
  			              "derogationContract" : "2",
  			              "derogationSpread" : "2",
  			              "serviceUsed" : "2",
  			              "paymentTerms" : "2",
  			              "paymentMethod" : "3",
  			              "jobDescription" : "j",
  			              "createdDate" : "2015-01-29T12:30:03.951Z",
  			              "_id" : "54ca27cb9c851ab013e9661a",
  			              "marginException" : [ 
  			                  {
  			                      "marginType" : "1",
  			                      "reason" : "2",
  			                      "deductionType" : "2",
  			                      "deductionNumberOfPayroll" : null,
  			                      "createdBy" : "54c6699cb50b1f740f5a7d30",
  			                      "createdDate" : "2015-01-29T12:36:39.782Z",
  			                      "_id" : "54ca29589c851ab013e9661c",
  			                      "deductionDate" : null,
  			                      "deductionPeriod" : "2"
  			                  }, 
  			                  ],
  			              "branch" : null,
  			              "consultant" : null,
  			              "updatedDate" : "2015-01-29T12:33:28.550Z"
  			          }, 
  			          {
  			              "agency" : "54c8bb4b27df08b003488587",
  			              "agencyRef" : "ar",
  			              "margin" : "1",
  			              "marginFixed" : 4,
  			              "holidayPayRule" : "3",
  			              "derogationContract" : "3",
  			              "derogationSpread" : "5",
  			              "serviceUsed" : "5",
  			              "paymentTerms" : "1",
  			              "paymentMethod" : "2",
  			              "jobDescription" : "jd",
  			              "createdDate" : "2015-01-29T12:33:53.634Z",
  			              "_id" : "54ca28b19c851ab013e9661b",
  			              "marginException" : []
  			          }, 
  			                  ],
  			      "birthDate" : "Wed Jan 28 2015 20:27:03 GMT+0545 (Nepal Standard Time)",
  			      "payrollproducts" : []
  			  },
  			  "avatarFileName" : "",
  			  "lockedUnlockedOn" : "2015-01-26T16:21:48.602Z",
  			  "locked" : false,
  			  "isActive" : true,
  			  "__v" : 25,
  			  "activatedDate" : "2015-01-26T16:22:34.763Z",
  			  "password" : "$2a$10$9Tf6bDcOz3jziMHrJPc07uqeIsf/alwWab8RhTFKihN.AMJOWR3kK",
  			  "candidateNo" : 7,
  			  "contactDetail" : {
  			      "google": "ishwor@makeitsimple.info",
  			      "altEmail" : "ishwor+alternate@makeitsimple.info",
  			      "facebook" : "fb.com/ishwor",
  			      "linkedin" : "linkedin.com/ishwor",
  			      "mobile" : "888888",
  			      "phone" : "999999"
  			  },
  			  "dpaUpdatedBy" : "54c6699cb50b1f740f5a7d30"
		};			

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
    			fakes.restore();
        		process.nextTick.restore();
			//fakes.restore();
    		});
	
	describe('getAgencies tests', function(){
		var getUserAgenciesStub;
		before(function(){
			getUserAgenciesStub=sinon.stub(candidateServiceMock, 'getUserAgencies');
		});
		beforeEach(function(){
			getUserAgenciesStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var req={params:{"id" : "54c6699cb50b1f740f5a7d30"}};
			var retObj={
                		"agency" : "54c8bb4b27df08b003488587",
                		"agencyRef" : "ar",
                		"margin" : "1",
                		"marginFixed" : 4,
                		"holidayPayRule" : "3",
               			 "derogationContract" : "3",
               			 "derogationSpread" : "5",
               			 "serviceUsed" : "5",
               			 "paymentTerms" : "1",
               			 "paymentMethod" : "2",
               			 "jobDescription" : "jd",
               			 "createdDate" : "2015-01-29T12:33:53.634Z",
               			 "_id" : "54ca28b19c851ab013e9661b",
               			 "marginException" : []
            		};
			var d=Q.defer();
			var p=d.promise;
			var arr=["54c8bb4b27df08b003488587","54c8bb4b27df08b003488587"];
			//arr.push(retObj);
			getUserAgenciesStub.returns(p);
			candidatesController.getAgencies(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			sinon.assert.calledWith(jsonStub, sinon.match({objects:arr}));

			done();
		});
		it('should return json failure', function(done){
			var req={params:{"id" : "54c6699cb50b1f740f5a7d30"}};
			var retObj={
                		"agency" : "54c8bb4b27df08b003488587",
                		"agencyRef" : "ar",
                		"margin" : "1",
                		"marginFixed" : 4,
                		"holidayPayRule" : "3",
               			 "derogationContract" : "3",
               			 "derogationSpread" : "5",
               			 "serviceUsed" : "5",
               			 "paymentTerms" : "1",
               			 "paymentMethod" : "2",
               			 "jobDescription" : "jd",
               			 "createdDate" : "2015-01-29T12:33:53.634Z",
               			 "_id" : "54ca28b19c851ab013e9661b",
               			 "marginException" : []
            		};
			var d=Q.defer();
			var p=d.promise;

			getUserAgenciesStub.returns(p);
			candidatesController.getAgencies(req, responseMock);
			d.reject();
			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('uploadDocuments tests', function(){
		var uploadDocsStub, getDocViewModelStub;
		before(function(){
			uploadDocsStub=sinon.stub(candidateServiceMock,'uploadDocuments');
			getDocViewModelStub=sinon.stub(candidateCommonMock,'getDocumentViewModel');
		});
		beforeEach(function(){
			uploadDocsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var arr=[];

			var req={user:{"id":"54c6699cb50b1f740f5a7d30"},
				 params:{"id":"54c6699cb50b1f740f5a7d30"},
				body:{"documents":{
        			"documentName" : "wnmrge",
            			"documentType" : "3",
            			"agency" : "54c8bb4b27df08b003488587",
            			"generatedName" : "1422462334949_winmerge.2.14.0.nupkg",
            			"mimeType" : "text/plain",
            			"uploadedBy" : "54c6699cb50b1f740f5a7d30",
            			"uploadedDate" : "2015-01-28T16:30:47.316Z",
            			"_id" : "54c90eb756a277d41709d345"
        		}}};
			var retObj={"documents":{
        			"documentName" : "wnmrge",
            			"documentType" : "3",
            			"agency" : "54c8bb4b27df08b003488587",
            			"generatedName" : "1422462334949_winmerge.2.14.0.nupkg",
            			"mimeType" : "text/plain",
            			"uploadedBy" : "54c6699cb50b1f740f5a7d30",
            			"uploadedDate" : "2015-01-28T16:30:47.316Z",
            			"_id" : "54c90eb756a277d41709d345"
        		}};
			var docs={"documents":[{
        			"documentName" : "wnmrge",
            			"documentType" : "3",
            			"agency" : "54c8bb4b27df08b003488587",
            			"generatedName" : "1422462334949_winmerge.2.14.0.nupkg",
            			"mimeType" : "text/plain",
            			"uploadedBy" : "54c6699cb50b1f740f5a7d30",
            			"uploadedDate" : "2015-01-28T16:30:47.316Z",
            			"_id" : "54c90eb756a277d41709d345"
        		}]};
			arr.push(docs);
			uploadDocsStub.returns(p);
			getDocViewModelStub.returns(docs);
			candidatesController.uploadDocuments(req, responseMock);
			d.resolve({result:true,object:{user:userVm,documents:docs}});
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,objects:arr}));
			done();
		});
		it('should return json failure object', function(done){
				var d=Q.defer();
				var p=d.promise;

				var req={user:{"id":"54c6699cb50b1f740f5a7d30"},
					params:{"id":"54c6699cb50b1f740f5a7d30"},
					body:{"documents":{
        				"documentName" : "wnmrge",
            				"documentType" : "3",
            				"agency" : "54c8bb4b27df08b003488587",
            				"generatedName" : "1422462334949_winmerge.2.14.0.nupkg",
            				"mimeType" : "text/plain",
            				"uploadedBy" : "54c6699cb50b1f740f5a7d30",
            				"uploadedDate" : "2015-01-28T16:30:47.316Z",
            				"_id" : "54c90eb756a277d41709d345"
        			}}};
				var retObj={"documents":[{
        				"documentName" : "wnmrge",
            				"documentType" : "3",
            				"agency" : "54c8bb4b27df08b003488587",
            				"generatedName" : "1422462334949_winmerge.2.14.0.nupkg",
            				"mimeType" : "text/plain",
            				"uploadedBy" : "54c6699cb50b1f740f5a7d30",
            				"uploadedDate" : "2015-01-28T16:30:47.316Z",
            				"_id" : "54c90eb756a277d41709d345"
        			}]};

				uploadDocsStub.returns(p);
				//getDocViewModelStub.returns(null);
				candidatesController.uploadDocuments(req, responseMock);
				d.reject({result:false,name:'NotFound',message:'User not found'});
				
				sinon.assert.calledOnce(sendFailureResponseStub);
				//sinon.assert.calledOnce(jsonStub);
				sinon.assert.calledWith(sendFailureResponseStub,sinon.match({ message: "User not found", name: "NotFound", result: false }));
//endFailureResponse({ message: "User not found", name: "NotFound", result: false })
//				sinon.assert.calledWith(sendFailureResponseStub,sinon.match());
				done();
		});




	});

	describe('getCandidate tests', function(){
		before(function(){
			getUserStub=sinon.stub(candidateServiceMock, 'getUser');
		});
		beforeEach(function(){
			getUserStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 "_restOptions":{}};

			getUserStub.returns(p);
			candidatesController.getCandidate(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			done();
		});

		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 "_restOptions":{}};

			getUserStub.returns(p);
			candidatesController.getCandidate(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done()
		});

	});

	describe('getAllCandidate tests', function(){
		var getAllCandidatesStub;
		before(function(){
			 getAllCandidatesStub=sinon.stub(candidateServiceMock, 'getAllCandidates');
		});
		beforeEach(function(){
		 	getAllCandidatesStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json with response object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={"_restOptions":{}};

			getAllCandidatesStub.returns(p);
			candidatesController.getAllCandidate(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			sinon.assert.calledWith(jsonStub, sinon.match({objects:[],meta:{limit:undefined,offset:undefined,totalCount:undefined}}));
			done();
		});

		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 "_restOptions":{}};

			getAllCandidatesStub.returns(p);
			candidatesController.getCandidate(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done()
		});

	});

	describe('updateContactDetail tests', function(){
		var updateContactDetailStub, getUserByEmailStub;
		before(function(){
			updateContactDetailStub=sinon.stub(candidateServiceMock,'updateContactDetail');
			getUserByEmailStub=sinon.stub(candidateCommonMock, 'getUserByEmail');
		});
		beforeEach(function(){
			updateContactDetailStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json with response object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var x=Q.defer();
			var y=x.promise;
			var req={ params:{"id":"54c6699cb50b1f740f5a7d30"},
				  body:userVm};

		        updateContactDetailStub.returns(p);
			getUserByEmailStub.returns(y);
			candidatesController.updateContactDetail(req, responseMock);
			d.resolve([userVm]);
			x.resolve({result:true, object:[userVm]});

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			done();
		});

		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var x=Q.defer();
			var y=x.promise;

			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 "_restOptions":{}};

			updateContactDetailStub.returns(p);
			getUserByEmailStub.returns(y);
			candidatesController.getCandidate(req, responseMock);
			d.reject();
			x.reject()

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done()
		});

	});
	describe('updateBankDetails tests', function(){
		var updateBankDetailsStub;
		before(function(){
			 updateBankDetailsStub=sinon.stub(candidateServiceMock, 'updateBankDetails');
		});
		beforeEach(function(){
			updateBankDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json with response object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body:{
            				"bankName" : "Sheffield Bank",
            				"accountName" : "ac/name",
            				"sortCode" : "9989",
            				"accountNo" : "45454",
            				"bankRollNo" : "5555"
        		}};
			var retObj={
            				"bankName" : "Sheffield Bank",
            				"accountName" : "ac/name",
            				"sortCode" : "9989",
            				"accountNo" : "45454",
            				"bankRollNo" : "5555"
			};

			updateBankDetailsStub.returns(p);
			candidatesController.updateBankDetails(req, responseMock);
			d.resolve({result:true, object:userVm});

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:retObj}));
			done();
		});
		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;

			var req={params:{"id":"54c6699cb50b1f740f5a7d30"},
				 body:{
            				"bankName" : "Sheffield Bank",
            				"accountName" : "ac/name",
            				"sortCode" : "9989",
            				"accountNo" : "45454",
            				"bankRollNo" : "5555"
				}};

			updateBankDetailsStub.returns(p);
			candidatesController.getCandidate(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done()
		});

	});

	describe('getContactDetail tests', function(){
		beforeEach(function(){
				getUserStub.reset();
				jsonStub.reset();
				sendFailureResponseStub.reset();
		});

		it('should return json with response object', function(done){
			
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"}};
			var retObj= {
				"_id":"54c6699cb50b1f740f5a7d30",
        			"google": "ishwor@makeitsimple.info",
        			"altEmail" : "ishwor+alternate@makeitsimple.info",
       				"facebook" : "fb.com/ishwor",
       				"linkedin" : "linkedin.com/ishwor",
       				"mobile" : "888888",
        			"phone" : "999999",
				"contactNumber" : "9999999",
       				"town" : "Sheffield",
        			"county" : "Sheffield",
        			"postCode" : "GU16 7HF",
				"emailAddress" : "ishwor@makeitsimple.info",
				"address1":"address1",
				"address2":"address2",
				"address3":"address3",
				"nationality":"GB"
    			};

			getUserStub.returns(p);
			candidatesController.getContactDetail(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			done();
		});
		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"}};

			getUserStub.returns(p);
			candidatesController.getContactDetail(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done()
		});

	});

	describe('getBankDetail tests', function(){
		beforeEach(function(){
				getUserStub.reset();
				jsonStub.reset();
				sendFailureResponseStub.reset();
		});

		it('should return json with bank details', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"}};
			var retObj={
  			          "bankName" : "Sheffield Bank",
  			          "accountName" : "ac/name",
  			          "sortCode" : "9989",
  			          "accountNo" : "45454",
  			          "bankRollNo" : "5555"
  			 };
			getUserStub.returns(p);
			candidatesController.getBankDetail(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:retObj}));
			done();
		});
		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30"}};

			getUserStub.returns(p);
			candidatesController.getContactDetail(req, responseMock)	
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done()
		});

	});

	describe('postCandidate tests', function(){
		var signupStub;
		before(function(){
			signupStub=sinon.stub(candidateServiceMock, 'signup');
		});
		beforeEach(function(){
			signupStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});

		it('should return json with bank details', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={get:function(x){if(x==='host')return 'www.ishwor.com';},protocol:"http",body:{"_id":"54c6699cb50b1f740f5a7d30",
        			"google": "ishwor@makeitsimple.info",
        			"altEmail" : "ishwor+alternate@makeitsimple.info",
       				"facebook" : "fb.com/ishwor",
       				"linkedin" : "linkedin.com/ishwor",
       				"mobile" : "888888",
        			"phone" : "999999",
				"bankName" : "Sheffield Bank",
  			        "accountName" : "ac/name",
  			        "sortCode" : "9989",
  			        "accountNo" : "45454",
  			        "bankRollNo" : "5555",
				"contactNumber" : "9999999",
       				"town" : "Sheffield",
        			"county" : "Sheffield",
        			"postCode" : "GU16 7HF",
				"emailAddress" : "ishwor@makeitsimple.info",
				"address1":"address1",
				"address2":"address2",
				"address3":"address3",
				"nationality":"GB",
				"gender":"M",
				"birthDate":"2014-12-17T00:00:00.000Z",
				"declaration" : "0",
  			        "p45GrossTax" : 20,
  			        "p45TaxDeducted" : 30,
  			        "payFrequency" : "2",
  			        "taxBasis" : "2",
  			        "taxCode" : "32",
				"currentP45":true,
				"p45Uploaded" : true,
  			        "niNumber" : "AA 22 33 55 B",
				"p46Uploaded":true,
				"p45DocumentUrl":"1418383593079Lion-013-2048x2048.jpg",
				"employeesNIpaid":true,
				"jobTitle" : "Developer",
				"startDate" : "2014-12-31T18:15:00.000Z",
				"title" : "Mr",
  			  	"firstName" : "ishwor",
  			  	"lastName" : "m",
  			  	"userType" : "WK",
				"sector":"dev-team",
				"agency_name" : "wq",
        			"emp_last_visit" : false,
        			"recent_dep_date" : null,
        			"arrival_date" : null,
				"empLastVisit":false,
			}};
			var retObj={"_id":"54c6699cb50b1f740f5a7d30",
        			"google": "ishwor@makeitsimple.info",
        			"altEmail" : "ishwor+alternate@makeitsimple.info",
       				"facebook" : "fb.com/ishwor",
       				"linkedin" : "linkedin.com/ishwor",
       				"mobile" : "888888",
        			"phone" : "999999",
				"bankName" : "Sheffield Bank",
  			        "accountName" : "ac/name",
  			        "sortCode" : "9989",
  			        "accountNo" : "45454",
  			        "bankRollNo" : "5555",
				"contactNumber" : "9999999",
       				"town" : "Sheffield",
        			"county" : "Sheffield",
        			"postCode" : "GU16 7HF",
				"emailAddress" : "ishwor@makeitsimple.info",
				"address1":"address1",
				"address2":"address2",
				"address3":"address3",
				"nationality":"GB",
				"gender":"M",
				"birthDate":"2014-12-17T00:00:00.000Z",
				"declaration" : "0",
  			        "p45GrossTax" : 20,
  			        "p45TaxDeducted" : 30,
  			        "payFrequency" : "2",
  			        "taxBasis" : "2",
  			        "taxCode" : "32",
				"currentP45":true,
				"p45Uploaded" : true,
  			        "niNumber" : "AA 22 33 55 B",
				"p46Uploaded":true,
				"p45DocumentUrl":"1418383593079Lion-013-2048x2048.jpg",
				"employeesNIpaid":true,
				"jobTitle" : "Developer",
				"startDate" : "2014-12-31T18:15:00.000Z",
				"title" : "Mr",
  			  	"firstName" : "ishwor",
  			  	"lastName" : "m",	
  			  	"userType" : "WK",
				"sector":"dev-team",
				"agency_name" : "wq",
        			"emp_last_visit" : false,
        			"recent_dep_date" : null,
        			"arrival_date" : null,
				"empLastVisit":false,
			};
			//req.get = function(){
			//	return('www.ishwor.com');
			//};
			var fullUrl='http://www.ishwor.com';
			signupStub.returns(p);
			candidatesController.postCandidate(req, responseMock);
			d.resolve({result:true,object:{userModel:[userVm]}});

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:retObj}));
			done();
		});
		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={get:function(x){if(x==='host')return 'www.ishwor.com';},body:{"_id":"54c6699cb50b1f740f5a7d30",
        			"google": "ishwor@makeitsimple.info",
        			"altEmail" : "ishwor+alternate@makeitsimple.info",
       				"facebook" : "fb.com/ishwor",
       				"linkedin" : "linkedin.com/ishwor",
       				"mobile" : "888888",
        			"phone" : "999999",
				"bankName" : "Sheffield Bank",
  			        "accountName" : "ac/name",
  			        "sortCode" : "9989",
  			        "accountNo" : "45454",
  			        "bankRollNo" : "5555",
				"contactNumber" : "9999999",
       				"town" : "Sheffield",
        			"county" : "Sheffield",
        			"postCode" : "GU16 7HF",
				"emailAddress" : "ishwor@makeitsimple.info",
				"address1":"address1",
				"address2":"address2",
				"address3":"address3",
				"nationality":"GB",
				"gender":"M",
				"birthDate":"2014-12-17T00:00:00.000Z",
				"declaration" : "0",
  			        "p45GrossTax" : 20,
  			        "p45TaxDeducted" : 30,
  			        "payFrequency" : "2",
  			        "taxBasis" : "2",
  			        "taxCode" : "32",
				"currentP45":true,
				"p45Uploaded" : true,
  			        "niNumber" : "AA 22 33 55 B",
				"p46Uploaded":true,
				"p45DocumentUrl":"1418383593079Lion-013-2048x2048.jpg",
				"employeesNIpaid":true,
				"jobTitle" : "Developer",
				"startDate" : "2014-12-31T18:15:00.000Z",
				"title" : "Mr",
  			  	"firstName" : "ishwor",
  			  	"lastName" : "m",
  			  	"userType" : "WK",
				"sector":"dev-team",
				"agency_name" : "wq",
        			"emp_last_visit" : false,
        			"recent_dep_date" : null,
        			"arrival_date" : null,
				"empLastVisit":false,
			}};


			signupStub.returns(p);
			candidatesController.postCandidate(req, responseMock)	
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done()
		});

	});

	describe('patchVehicleInformation tests', function(){
		var updateVehicleInfoStub;
		before(function(){
			updateVehicleInfoStub=sinon.stub(candidateServiceMock, 'updateVehicleInformation');
		});
		beforeEach(function(){
			updateVehicleInfoStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});

		it('should return json with vehicle info', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30","code":"1q2w3e4r"},
				 body:{"fuelType":"petrol",
				       "engineSize":"5ltr",
				       "make":"vauxhaul",
				       "registration":"dwtwbtwotl",
				       "companyCar":true
				 }};
			var retObj={"_id":"54c6699cb50b1f740f5a7d30",
				    "vehicleInformation":{"fuelType":"petrol",
				       "engineSize":"5ltr",
				       "make":"vauxhaul",
				       "registration":"dwtwbtwotl",
				       "companyCar":true
				 }};
			updateVehicleInfoStub.returns(p);
			candidatesController.patchVehicleInformation(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:retObj}));
			done();
		});
		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30","code":"1q2w3e4r"},
				 body:{"fuelType":"petrol",
				       "engineSize":"5ltr",
				       "make":"vauxhaul",
				       "registration":"dwtwbtwotl",
				       "companyCar":true
			}};

			updateVehicleInfoStub.returns(p);
			candidatesController.patchVehicleInformation(req, responseMock)	
			d.reject({name:'NotFound',message:'No User found'});

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({ message: "No User found", name: "NotFound" }));
			done()
		});

	});

	describe('getVehicleInformation tests', function(){
		beforeEach(function(){
			getUserStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});

		it('should return json with vehicle info', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30","code":"1q2w3e4r"}};
			var retObjz={"_id":"54c6699cb50b1f740f5a7d30",
				    "vehicleInformation":{"fuelType":"petrol",
				    "engineSize":"5ltr",
				    "make":"vauxhaul",
				    "registration":"dwtwbtwotl",
				    "companyCar":true
			}};
			var retObj={"_id":"54c6699cb50b1f740f5a7d30",
				    "vehicleInformation":{}};

			getUserStub.returns(p);
			candidatesController.getVehicleInformation(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:retObj}));
			done();
		});
		it('should return json failure object', function(done){
			var d=Q.defer();
			var p=d.promise;
			var req={params:{"id":"54c6699cb50b1f740f5a7d30","code":"1q2w3e4r"}};

			getUserStub.returns(p);
			candidatesController.getVehicleInformation(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:false, message:'Vehicle Information not found'}));
			done()
		});

	});






});
	
