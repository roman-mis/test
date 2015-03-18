'use strict';

var sinon=require('sinon'),
	mockery=require('mockery'),
	chai=require('chai'),
	expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('user',function(){
	
	//declaration for mocks and test data
	var responseMock,requestMock,userController,emailRequestMock, userMock, postActivationMock, getUserMock;
	var jsonStub,sendFailureResponseStub, lockUnlockMock, getActivationMock, fakes,verifyChngPasswdMock, verifyChangePasswdMock;

	//before function is called for each test suite inside this test suite
	before(function(){
		
		//mockery configuration
		mockery.enable({
			warnOnReplace:false,
			warnOnUnregistered:false,
			useCleanCache:true
		});

		//creating a mock object to be passed as a res parameter to the getTaskDetails function
		responseMock={'json':function(){},'sendFailureResponse':function(){}};
		jsonStub=sinon.stub(responseMock,'json');
		sendFailureResponseStub=sinon.stub(responseMock,'sendFailureResponse');

		userMock={'checkDuplicateUser':function(){},'lockunlock':function(){},'isActivationCodeValid':function(){},
			  'activateUser':function(){},'getAllUsers':function(){},'verifyCode':function(){},
			  'changePassword':function(){},'getUser':function(){}};

		mockery.registerMock('../services/userservice', userMock);
		userController=require('../../../server/controllers/users')(null);
		emailRequestMock={params:{'emailAddress':'matt@makeitsimple.info'}};
		getActivationMock={params:{'emailAddress':'matt@makeitsimple.info'}, query:{'verificationCode':'1q2w3e4r'}};
		postActivationMock={params:{'emailAddress':'matt@makeitsimple.info'}, body:{'newPassword':'1q2w3e4r','verificationCode':'1q2w3e4r'}};
		lockUnlockMock={user:{'id':'5556fafabasdfaszy55'},params:{'id':'54c6699cb50b1f740f5a7d30','flag':'true'}};
		verifyChangePasswdMock={params:{'emailAddress':'matt@makeitsimple.info', 'code':'1q2w3e4r'}, body:{'newPassword':'1q2w3e4r'}};
		verifyChngPasswdMock={params:{'emailAddress':'matt@makeitsimple.info','code':'1q2w3e4r'}};
		getUserMock={params:{'id':'54c6699cb50b1f740f5a7d30'}};
		});
		
	after(function(){
		mockery.disable();
	});
	
	beforeEach(function () {
        sinon.stub(process, 'nextTick').yields();
	fakes=sinon.collection;
    });
    afterEach(function () {
    	fakes.restore();
        process.nextTick.restore();
    });
	
	describe('emailValidation tests', function(){
		var checkDupUserStub;
		before(function(){
				checkDupUserStub=sinon.stub(userMock, 'checkDuplicateUser');
		});
		beforeEach(function(){
			
			checkDupUserStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		
		it('should return json result true', function(done){
			var retObj={result:true}, ret;
			var d=Q.defer();
			var p=d.promise;
			checkDupUserStub.returns(p);
			
			userController.emailValidation(emailRequestMock, responseMock);
			d.resolve(retObj);
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));
			done();
		});

		it('should return json failure response', function(done){
			var retObj={}, ret;
			var d=Q.defer();
			var p=d.promise;

			checkDupUserStub.returns(p);
			userController.emailValidation(emailRequestMock, responseMock);
			d.reject({result:false, name:'NOTFOUND'});	
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();
		});
	});

	describe('lockunlock tests', function(){
		var lockUnlockStub;
		before(function(){
			lockUnlockStub=sinon.stub(userMock, 'lockunlock');
		});
		beforeEach(function(){
			lockUnlockStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});

		it('should return json result true..', function(done){
			var retObj={result:true};
			var d=Q.defer();
			var p=d.promise;
			lockUnlockStub.returns(p);

			userController.lockunlock(lockUnlockMock, responseMock);
			d.resolve(retObj);
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));
			done();
		});

		it('should return json failure response', function(done){
			var d=Q.defer();
			var p=d.promise;

			lockUnlockStub.returns(p);
			userController.lockunlock(lockUnlockMock, responseMock);
			d.reject({result:false, name:'NOTFOUND'});	
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();
		});

	});//describe...

	describe('getActivation tests', function(){
		var isActCodeValidStub;
		before(function(){
			isActCodeValidStub=fakes.stub(userMock, 'isActivationCodeValid');
		});
		beforeEach(function(){
			isActCodeValidStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});

		it('should return json result object with true value..', function(done){
			var retObj={result:true};
			var d=Q.defer();
			var p=d.promise;
			isActCodeValidStub.returns(p);

			userController.getActivation(getActivationMock, responseMock);
			d.resolve(retObj);
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));
			done();
		});

		it('should return json failure response', function(done){
			var d=Q.defer();
			var p=d.promise;

			isActCodeValidStub.returns(p);
			userController.getActivation(getActivationMock, responseMock);
			d.reject();	
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,{result:false,message:'Invalid code'});
			done();
		});

	});//describe...

	describe('postActivation tests', function(){
		var postActivationStub, activateUserStub;
		before(function(){
			postActivationStub=fakes.stub(userMock, 'isActivationCodeValid');
			activateUserStub=sinon.stub(userMock, 'activateUser');
		});
		beforeEach(function(){
			postActivationStub.reset();
			activateUserStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});

		it('should return json result object with true value', function(done){
			var userVm={
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
	
			var d=Q.defer();
			var p=d.promise;
			postActivationStub.returns(p);
			var x=Q.defer();
			var y=x.promise;
			activateUserStub.returns(y);

			userController.postActivation(postActivationMock, responseMock);
			d.resolve(userVm);
			x.resolve(userVm);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));
			done();
		});

		it('should return json failure response', function(done){
			var d=Q.defer();
			var p=d.promise;
			var userVm={
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

			postActivationStub.returns(p);
			var x=Q.defer();
			var y=x.promise;
			activateUserStub.returns(y);

			userController.postActivation(postActivationMock, responseMock);
			d.reject();
			x.reject();
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,{result:false,message:'Invalid code'});
			done();
		});


	});
//	describe('verifyChangePassword tests', function(){
//		var verifyCodeStub;
//		before(function(){
//			verifyCodeStub=sinon.stub(userMock, 'verifyCode');
//		});
//		beforeEach(function(){
//			verifyCodeStub.reset();
//			jsonStub.reset();
//			sendFailureResponseStub.reset();		
//
//		});
//		it('should return json containing response', function(done){
//			var d=Q.defer();
//			var p=d.promise;
//
//			verifyCodeStub.returns(p);
//			userController.verifyChangePassword(verifyChngPasswdMock, responseMock);
//			d.resolve();
//
//			sinon.assert.calledOnce(jsonStub);
//			done();
//		});
//	});

	describe('getAllUsers test', function(){
		var getAllUsersStub;
		before(function(){
			getAllUsersStub=sinon.stub(userMock, 'getAllUsers');
		
		});
		beforeEach(function(){
			getAllUsersStub.reset();
		
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json object with result value true...', function(done){
			var reqObj={}, userObj={};
			var retObj={result:true, objects:{},meta:{}};
			var d=Q.defer();
			var p=d.promise;
			getAllUsersStub.returns(p);
		

			userController.getAllUsers(reqObj, responseMock);
			d.resolve(retObj);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match(retObj));
			done();
		});
		it('should return json failure response', function(done){
			var reqObj={}, userObj={};
			var d=Q.defer();
			var p=d.promise;
			getAllUsersStub.returns(p);
		

			userController.getAllUsers(reqObj, responseMock);
			d.reject({result:false, name:'NOTFOUND'});	
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();

		});
	});

	describe('verifyChangePassword test', function(){
		var verifyCodeStub;
		before(function(){
			verifyCodeStub=sinon.stub(userMock, 'verifyCode');
		});
		beforeEach(function(){
			verifyCodeStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json object with result value true...', function(done){
			var retObj={result:true, object:{'user':'ishwor','code':'1q2w3e4r'}};
			var x;
			var d=Q.defer();
			var p=d.promise;
			verifyCodeStub.returns(p);

			userController.verifyChangePassword(verifyChangePasswdMock, responseMock);
			d.resolve(retObj);
			//x.then(function(returned){
			//	expect(returned).to.have.property('user');
			//});
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match(retObj));
			done();
		});
		it('should return json failure response', function(done){
			var reqObj={}, userObj={};
			var d=Q.defer();
			var p=d.promise;
			verifyCodeStub.returns(p);

			userController.verifyChangePassword(verifyChangePasswdMock, responseMock);
			d.reject({result:false, name:'NOTFOUND'});	
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();

		});
	});
	
	describe('changePassword test', function(){
		var changePasswordStub;
		before(function(){
			changePasswordStub=sinon.stub(userMock, 'changePassword');
		});
		beforeEach(function(){
			changePasswordStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json object with result value true...', function(done){
			var d=Q.defer();
			var p=d.promise;
			var retObj={result:true};
			changePasswordStub.returns(p);

			userController.changePassword(verifyChangePasswdMock, responseMock);
			d.resolve(retObj);
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match(retObj));
			done();
		});
		it('should return json failure response', function(done){
			var reqObj={};
			var d=Q.defer();
			var p=d.promise;
			changePasswordStub.returns(p);

			userController.verifyChangePassword(verifyChangePasswdMock, responseMock);
			d.reject({result:false, name:'NOTFOUND'});	
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();

		});
	});

	describe('getUser test', function(){
		var getUserStub;
		before(function(){
			getUserStub=sinon.stub(userMock, 'getUser');
		
		});
		beforeEach(function(){
			getUserStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json object with result value true...', function(done){
			var userObj={};
			var userVm={
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
			var retObj={result:true, object:{}};
			var d=Q.defer();
			var p=d.promise;
			getUserStub.returns(p);
		
			userController.getAllUsers(getUserMock, responseMock);
			d.resolve(userVm);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match({result:true,object:userVm}));
			done();
		});
		it('should return json failure response', function(done){
			var reqObj={}, userObj={};
			var d=Q.defer();
			var p=d.promise;
			var userVm={
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

			getUserStub.returns(p);


			userController.getUser(getUserMock, responseMock);
			d.reject();	
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();

		});
	});


	

		
});

				
