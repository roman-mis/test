'use strict';

var sinon=require('sinon'),
	mockery=require('mockery'),
	chai=require('chai'),
	expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('candidates-payroll',function(){
		var responseMock, jsonStub, getPrProductDetailsStub, sendFailureResponseStub,candidatesPayrollController;
		var getUserStub, sandbox, userVm, candidatePayrollMock,candidateServiceMock,  updatePrProductDetailsStub, fakes;
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
		candidatePayrollMock={'updatePayrollTaxDetails':function(){},'getPayrollProductDetails':function(){},
		'updatePayrollProductDetails':function(){},'deletePayrollProductDetails':function(){},
		'postMarginException':function(){},'patchMarginException':function(){},'deleteMarginException':function(){}};
		candidateServiceMock={'getUser':function(){}};
		mockery.registerMock('../services/candidateservice', function(){ return candidateServiceMock;});
		mockery.registerMock('../services/payrollproductservice', function(){return candidatePayrollMock;});
		candidatesPayrollController=require('../../../server/controllers/candidates-payroll')(null);
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
	
	describe('getPayrollTax tests', function(){
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
			var req={params:{'candidateId':'54c8f20a1ae2818801a805e8'}};
			
			var retObj={
   				 '_id': "54c6699cb50b1f740f5a7d30",
   				 'declaration': "0",
   				 'niNumber': "AA 22 33 55 B",
   				 'p45GrossTax': 20,
   				 'p45TaxDeducted': 30,
   				 'payFrequency': "2",
   				 'startDate': "2014-12-31T18:15:00.000Z",
   				 'taxBasis': "2",
   				 'taxCode': "32"
  			};

			getUserStub.returns(p);
			candidatesPayrollController.getPayrollTax(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true, object:retObj}));
			done();
		});
		it('should return json failure response', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30'}};
			var d=Q.defer();
			var p=d.promise;
			getUserStub.returns(p);
		

			candidatesPayrollController.getPayrollTax(req, responseMock);
			d.reject();	
			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			//sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:undefined}));
			done();

		});
	});

	describe('postPayrollTax tests', function(){
		var updatePrTaxDetailsStub;
		before(function(){
			updatePrTaxDetailsStub=sinon.stub(candidatePayrollMock, 'updatePayrollTaxDetails');
		});
		beforeEach(function(){
			updatePrTaxDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
		
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30'},
				 body:{ '_id': "54c6699cb50b1f740f5a7d30", 
					'declaration': "0",
    					'niNumber': "AA 22 33 55 B",
   					'p45GrossTax': 20,
    					'p45TaxDeducted': 30,
    					'payFrequency': "2",
    					'startDate': "2014-12-31T18:15:00.000Z",
    					'taxBasis': "2",
    					'taxCode': "32"
  					}};
			var retObj={ '_id': "54c6699cb50b1f740f5a7d30", 
					'declaration': "0",
    					'niNumber': "AA 22 33 55 B",
   					'p45GrossTax': 20,
    					'p45TaxDeducted': 30,
    					'payFrequency': "2",
    					'startDate': "2014-12-31T18:15:00.000Z",
    					'taxBasis': "2",
    					'taxCode': "32"
  					};

			updatePrTaxDetailsStub.returns(p);
			candidatesPayrollController.postPayrollTax(req, responseMock);
			d.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true, object:retObj}));
			done();
		});
		it('should return json failure response', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30'},
				 body:{ '_id': "54c6699cb50b1f740f5a7d30", 
					'declaration': "0",
    					'niNumber': "AA 22 33 55 B",
   					'p45GrossTax': 20,
    					'p45TaxDeducted': 30,
    					'payFrequency': "2",
    					'startDate': "2014-12-31T18:15:00.000Z",
    					'taxBasis': "2",
    					'taxCode': "32"
  					}};


			var d=Q.defer();
			var p=d.promise;
			updatePrTaxDetailsStub.returns(p);
		

			candidatesPayrollController.postPayrollTax(req, responseMock);
			d.reject();	
			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();

		});
	});

	describe('getPayrollProduct tests', function(){
		//var getPrProductDetailsStub;
		before(function(){
			getPrProductDetailsStub=sinon.stub(candidatePayrollMock, 'getPayrollProductDetails');
		});
		beforeEach(function(){
			getPrProductDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var d=Q.defer();
			var p=d.promise;
			var x=Q.defer();
			var y=x.promise;
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'}};
					var retObj={ '_id': "54c6699cb50b1f740f5a7d30", 
					'declaration': "0",
    					'niNumber': "AA 22 33 55 B",
   					'p45GrossTax': 20,
    					'p45TaxDeducted': 30,
    					'payFrequency': "2",
    					'startDate': "2014-12-31T18:15:00.000Z",
    					'taxBasis': "2",
    					'taxCode': "32"
  			};
			var pr_product={
               			 "agency" : "54cf9f23f383e9be63a0d666",
               			 "margin" : "2",
               			 "marginFixed" : 20,
               			 "holidayPayRule" : "2",
               			 "derogationContract" : "2",
               			 "serviceUsed" : "1",
               			 "paymentTerms" : "2",
               			 "paymentMethod" : "2",
               			 "createdDate" : "2015-02-16T16:46:51.044Z",
               			 "_id" : "54e21efb46cac21961f01eaf",
               			 "marginException" : []
            		};
			
			getPrProductDetailsStub.returns(p);
			candidatesPayrollController.getPayrollProduct(req, responseMock);
			d.resolve([pr_product]);
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
      sinon.assert.calledWith(jsonStub, sinon.match({object:pr_product}));
			done();
		});


 	});
	describe('postPayrollProduct tests', function(){
		//var updatePrProductDetailsStub;
		before(function(){
			updatePrProductDetailsStub=sinon.stub(candidatePayrollMock,'updatePayrollProductDetails');
		});
		beforeEach(function(){
			getPrProductDetailsStub.reset();
			updatePrProductDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},body:{
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		}};
			var respObj={
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		};
	
			var d=Q.defer();
			var p=d.promise;
			var x=Q.defer();
			var y=x.promise;
			updatePrProductDetailsStub.returns(p);
			getPrProductDetailsStub.returns(y);
			candidatesPayrollController.postPayrollProduct(req, responseMock);
			d.resolve({user:userVm,product:[respObj]});
			x.resolve([respObj]);

			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match([respObj]));
			//sinon.assert.calledWith(jsonStub, sinon.match({object:[respObj]}));
			done();
		});

		it('should return json false result', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},body:{
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		}};
			var respObj={
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		};
	
			var d=Q.defer();
			var p=d.promise;
			
			updatePrProductDetailsStub.returns(p);
			candidatesPayrollController.postPayrollProduct(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});

	describe('patchPayrollProduct tests', function(){
		//var updatePrProductDetailStub;
		//before(function(){
		//	updatePrProductDetailStub=fakes.stub(candidatePayrollMock,'updatePayrollProductDetails');
		//});
		beforeEach(function(){
			getPrProductDetailsStub.reset();
			updatePrProductDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},body:{
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		}};
			var respObj={
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		};
	
			var d=Q.defer();
			var p=d.promise;
			var x=Q.defer();
			var y=x.promise;
			updatePrProductDetailsStub.returns(p);
			getPrProductDetailsStub.returns(y);
			candidatesPayrollController.patchPayrollProduct(req, responseMock);
			d.resolve({user:userVm,product:[respObj]});
			x.resolve([respObj]);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			done();
		});

		it('should return json result true', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},body:{
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		}};
			var respObj={
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		};
	
			var d=Q.defer();
			var p=d.promise;
			
			updatePrProductDetailsStub.returns(p);
			candidatesPayrollController.patchPayrollProduct(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});
	
	describe('deletePayrollProduct tests', function(){
		var deletePrProductDetailsStub;
		before(function(){
			deletePrProductDetailsStub=sinon.stub(candidatePayrollMock,'deletePayrollProductDetails');
		});
		beforeEach(function(){
			deletePrProductDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},body:{
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		}};
			var respObj={
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		};
	
			var d=Q.defer();
			var p=d.promise;
			
			deletePrProductDetailsStub.returns(p);
			candidatesPayrollController.deletePayrollProduct(req, responseMock);
			d.resolve(respObj);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			done();
		});

		it('should return json result true', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},body:{
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		}};
			var respObj={
                		"agency" : "54cf9f23f383e9be63a0d666",
                		"margin" : "2",
                		"marginFixed" : 20,
                		"holidayPayRule" : "2",
                		"derogationContract" : "2",
                		"serviceUsed" : "1",
                		"paymentTerms" : "2",
                		"paymentMethod" : "2",
                		"createdDate" : "2015-02-16T16:46:51.044Z",
                		"_id" : "54e21efb46cac21961f01eaf",
                		"marginException" : [],
				"branch":"1",
				"derogationSpread":"2",
				"jobDescription":"2",
				"consultant":"1",
				"agencyRef":"2"

            		};
	
			var d=Q.defer();
			var p=d.promise;
			
			deletePrProductDetailsStub.returns(p);
			candidatesPayrollController.patchPayrollProduct(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});
	describe('getMarginException tests', function(){
		//var getMarginExceptionStub;
		//before(function(){
		//	deletePrProductDetailsStub=s.stub(candidatePayrollMock,'deletePayrollProductDetails');
		//});
		beforeEach(function(){
			getUserStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'}};
				
			var d=Q.defer();
			var p=d.promise;
			
			getUserStub.returns(p);
			candidatesPayrollController.getMarginException(req, responseMock);
			d.resolve([userVm]);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			done();
		});

		it('should return json result true', function(done){
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'}};
					
			var d=Q.defer();
			var p=d.promise;
			
			getUserStub.returns(p);
			candidatesPayrollController.getMarginException(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});
	describe('postMarginExceptiont tests', function(){
		var postMargExceptionStub;
		before(function(){
			postMargExceptionStub=sinon.stub(candidatePayrollMock,'postMarginException');
		});
		beforeEach(function(){
			postMargExceptionStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			
	
			var d=Q.defer();
			var p=d.promise;
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},
				user:{'id':'54c6699cb50b1f740f5a7d30'},
			         body: {
                        "marginType" : "1",
                        "reason" : "2",
                        "deductionType" : "2",
                        "deductionNumberOfPayroll" : null,
                        "createdBy" : "54c6699cb50b1f740f5a7d30",
                        "createdDate" : "2015-01-29T12:36:39.782Z",
                        "_id" : "54ca29589c851ab013e9661c",
                        "deductionDate" : null,
                        "deductionPeriod" : "2"
                    }};
			
			postMargExceptionStub.returns(p);
			candidatesPayrollController.postMarginException(req, responseMock);
			d.resolve({object:{}});

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true, object:{}}));
			done();
		});

		it('should return json result true', function(done){


					
			var d=Q.defer();
			var p=d.promise;
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},
				user:{'id':'54c6699cb50b1f740f5a7d30'},
			         body: {
                        "marginType" : "1",
                        "reason" : "2",
                        "deductionType" : "2",
                        "deductionNumberOfPayroll" : null,
                        "createdBy" : "54c6699cb50b1f740f5a7d30",
                        "createdDate" : "2015-01-29T12:36:39.782Z",
                        "_id" : "54ca29589c851ab013e9661c",
                        "deductionDate" : null,
                        "deductionPeriod" : "2"
                    }};
	
			postMargExceptionStub.returns(p);
			candidatesPayrollController.postMarginException(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});
	describe('patchMarginExceptiont tests', function(){
		var patchMargExceptionStub;
		before(function(){
			patchMargExceptionStub=sinon.stub(candidatePayrollMock,'patchMarginException');
		});
		beforeEach(function(){
			patchMargExceptionStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			

				//var userVm={
   // "_id" : "54c6699cb50b1f740f5a7d30",
   // "candidate_no" : 1,
   // "activationCode" : "6d9a2f70-a577-11e4-a74f-8553e93f833e",
   // "title" : "Mr",
   // "firstName" : "ishwor",
   // "lastName" : "m",
   // "emailAddress" : "ishwor@makeitsimple.info",
   // "userType" : "WK",
   // "updated_date" : "2015-01-26T16:21:48.604Z",
   // "created_date" : "2015-01-26T16:21:48.604Z",
   // "dpaUpdatedDate" : "2015-01-29T12:03:10.642Z",
   // "documents" : [ 
   //     {
   //         "documentName" : "wnmrge",
   //         "documentType" : "3",
   //         "agency" : "54c8bb4b27df08b003488587",
   //         "generatedName" : "1422462334949_winmerge.2.14.0.nupkg",
   //         "mimeType" : "text/plain",
   //         "uploadedBy" : "54c6699cb50b1f740f5a7d30",
   //         "uploadedDate" : "2015-01-28T16:30:47.316Z",
   //         "_id" : "54c90eb756a277d41709d345"
   //     }
   // ],
   // "worker" : {
   //     "contactNumber" : "9999999",
   //     "town" : "Sheffield",
   //     "county" : "Sheffield",
   //     "postCode" : "GU16 7HF",
   //     "arrivalDate" : null,
   //     "recentDepDate" : null,
   //     "agencyName" : "some agency",
   //     "jobTitle" : "Developer",
   //     "bankDetail" : {
   //         "bankName" : "Sheffield Bank",
   //         "accountName" : "ac/name",
   //         "sortCode" : "9989",
   //         "accountNo" : "45454",
   //         "bankRollNo" : "5555"
   //     },
   //     "taxDetail" : {
   //         "p45Uploaded" : true,
   //         "niNumber" : "AA 22 33 55 B"
   //     },
   //     "address_1" : "address 1",
   //     "address_2" : "address 2",
   //     "address_3" : "address 3",
   //     "nationality" : "1",
   //     "payrollTax" : {
   //         "declaration" : "0",
   //         "p45GrossTax" : 20,
   //         "p45TaxDeducted" : 30,
   //         "payFrequency" : "2",
   //         "taxBasis" : "2",
   //         "taxCode" : "32"
   //     },
   //     "startDate" : "2014-12-31T18:15:00.000Z",
   //     "payrollProduct" : [ 
   //         {
   //             "agency" : "54c8bb4b27df08b003488587",
   //             "agencyRef" : "a",
   //             "margin" : "3",
   //             "marginFixed" : 1,
   //             "holidayPayRule" : "2",
   //             "derogationContract" : "2",
   //             "derogationSpread" : "2",
   //             "serviceUsed" : "2",
   //             "paymentTerms" : "2",
   //             "paymentMethod" : "3",
   //             "jobDescription" : "j",
   //             "createdDate" : "2015-01-29T12:30:03.951Z",
   //             "_id" : "54ca27cb9c851ab013e9661a",
   //             "marginException" : [ 
   //                 {
   //                     "marginType" : "1",
   //                     "reason" : "2",
   //                     "deductionType" : "2",
   //                     "deductionNumberOfPayroll" : null,
   //                     "createdBy" : "54c6699cb50b1f740f5a7d30",
   //                     "createdDate" : "2015-01-29T12:36:39.782Z",
   //                     "_id" : "54ca29589c851ab013e9661c",
   //                     "deductionDate" : null,
   //                     "deductionPeriod" : "2"
   //                 }, 
   //                 ],
   //             "branch" : null,
   //             "consultant" : null,
   //             "updatedDate" : "2015-01-29T12:33:28.550Z"
   //         }, 
   //         {
   //             "agency" : "54c8bb4b27df08b003488587",
   //             "agencyRef" : "ar",
   //             "margin" : "1",
   //             "marginFixed" : 4,
   //             "holidayPayRule" : "3",
   //             "derogationContract" : "3",
   //             "derogationSpread" : "5",
   //             "serviceUsed" : "5",
   //             "paymentTerms" : "1",
   //             "paymentMethod" : "2",
   //             "jobDescription" : "jd",
   //             "createdDate" : "2015-01-29T12:33:53.634Z",
   //             "_id" : "54ca28b19c851ab013e9661b",
   //             "marginException" : []
   //         }, 
   //                 ],
   //     "birthDate" : "Wed Jan 28 2015 20:27:03 GMT+0545 (Nepal Standard Time)",
   //     "payrollproducts" : []
   // },
   // "avatarFileName" : "",
   // "lockedUnlockedOn" : "2015-01-26T16:21:48.602Z",
   // "locked" : false,
   // "isActive" : true,
   // "__v" : 25,
   // "activatedDate" : "2015-01-26T16:22:34.763Z",
   // "password" : "$2a$10$9Tf6bDcOz3jziMHrJPc07uqeIsf/alwWab8RhTFKihN.AMJOWR3kK",
   // "candidateNo" : 7,
   // "contactDetail" : {
   //     "altEmail" : "ishwor+alternate@makeitsimple.info",
   //     "facebook" : "fb.com/ishwor",
   //     "linkedin" : "linkedin.com/ishwor",
   //     "mobile" : "888888",
   //     "phone" : "999999"
   // },
   // "dpaUpdatedBy" : "54c6699cb50b1f740f5a7d30"
//};
	
			var d=Q.defer();
			var p=d.promise;
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},
			         body: {
                        "marginType" : "1",
                        "reason" : "2",
                        "deductionType" : "2",
                        "deductionNumberOfPayroll" : null,
                        "createdBy" : "54c6699cb50b1f740f5a7d30",
                        "createdDate" : "2015-01-29T12:36:39.782Z",
                        "_id" : "54ca29589c851ab013e9661c",
                        "deductionDate" : null,
                        "deductionPeriod" : "2"
                    }};
			var respObj= {
                        "marginType" : "1",
                        "reason" : "2",
                        "deductionType" : "2",
                        "deductionNumberOfPayroll" : null,
                        "createdBy" : "54c6699cb50b1f740f5a7d30",
                        "createdDate" : "2015-01-29T12:36:39.782Z",
                        "_id" : "54ca29589c851ab013e9661c",
                        "deductionDate" : null,
                        "deductionPeriod" : "2"
                    };
			patchMargExceptionStub.returns(p);
			candidatesPayrollController.patchMarginException(req, responseMock);
			d.resolve([respObj]);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			//sinon.assert.calledWith(jsonStub, sinon.match({object:respObj}));
			done();
		});

		it('should return json result true', function(done){


					
			var d=Q.defer();
			var p=d.promise;
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},
			         body: {
                        "marginType" : "1",
                        "reason" : "2",
                        "deductionType" : "2",
                        "deductionNumberOfPayroll" : null,
                        "createdBy" : "54c6699cb50b1f740f5a7d30",
                        "createdDate" : "2015-01-29T12:36:39.782Z",
                        "_id" : "54ca29589c851ab013e9661c",
                        "deductionDate" : null,
                        "deductionPeriod" : "2"
                    }};
	
			patchMargExceptionStub.returns(p);
			candidatesPayrollController.patchMarginException(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});
	
	describe('deleteMarginException tests', function(){
		var deleteMargExceptionStub;
		before(function(){
			deleteMargExceptionStub=sinon.stub(candidatePayrollMock,'deleteMarginException');
		});
		beforeEach(function(){
			deleteMargExceptionStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){	
			var d=Q.defer();
			var p=d.promise;
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},
			         body: {
                        "marginType" : "1",
                        "reason" : "2",
                        "deductionType" : "2",
                        "deductionNumberOfPayroll" : null,
                        "createdBy" : "54c6699cb50b1f740f5a7d30",
                        "createdDate" : "2015-01-29T12:36:39.782Z",
                        "_id" : "54ca29589c851ab013e9661c",
                        "deductionDate" : null,
                        "deductionPeriod" : "2"
                    }};
			var respObj= {
                        "marginType" : "1",
                        "reason" : "2",
                        "deductionType" : "2",
                        "deductionNumberOfPayroll" : null,
                        "createdBy" : "54c6699cb50b1f740f5a7d30",
                        "createdDate" : "2015-01-29T12:36:39.782Z",
                        "_id" : "54ca29589c851ab013e9661c",
                        "deductionDate" : null,
                        "deductionPeriod" : "2"
                    };
			deleteMargExceptionStub.returns(p);
			candidatesPayrollController.deleteMarginException(req, responseMock);
			d.resolve();

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true}));
			done();
		});

		it('should return json result true', function(done){


					
			var d=Q.defer();
			var p=d.promise;
			var req={params:{'candidateId':'54c6699cb50b1f740f5a7d30',
					 'productId':'54e21efb46cac21961f01eaf'},
			         body: {
                        "marginType" : "1",
                        "reason" : "2",
                        "deductionType" : "2",
                        "deductionNumberOfPayroll" : null,
                        "createdBy" : "54c6699cb50b1f740f5a7d30",
                        "createdDate" : "2015-01-29T12:36:39.782Z",
                        "_id" : "54ca29589c851ab013e9661c",
                        "deductionDate" : null,
                        "deductionPeriod" : "2"
                    }};
	
			deleteMargExceptionStub.returns(p);
			candidatesPayrollController.deleteMarginException(req, responseMock);
			d.reject();

			sinon.assert.calledOnce(sendFailureResponseStub);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match(undefined));
			done();
		});

	});


});


			

