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
	var jsonStub,sendFailureResponseStub, lockUnlockMock, getActivationMock, fakes, verifyChangePasswdMock;

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
			  'changePassword':function(){},'getUser':function(){},'getUserViewModel':function(){}};

		mockery.registerMock('../services/userservice', userMock);
		userController=require('../../../server/controllers/users')(null);
		emailRequestMock={params:{'emailAddress':'matt@makeitsimple.info'}};
		getActivationMock={params:{'emailAddress':'matt@makeitsimple.info'}, query:{'verificationCode':'1q2w3e4r'}};
		postActivationMock={params:{'emailAddress':'matt@makeitsimple.info'}, body:{'verificationCode':'1q2w3e4r'}};
		lockUnlockMock={user:{'id':'5556fafabasdfaszy55'},params:{'id':'54c6699cb50b1f740f5a7d30','flag':'true'}};
		verifyChangePasswdMock={params:{'emailAddress':'matt@makeitsimple.info', 'code':'1q2w3e4r'}, body:{'newPassword':'1q2w3e4r'}};
		getUserMock={params:{'id':'1q2w3e4r'}};
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
			d.reject({result:false, message:'Invalid code'});	
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
			var retObj={result:true};
			var d=Q.defer();
			var p=d.promise;
			postActivationStub.returns(p);
			var x=Q.defer();
			var y=x.promise;
			activateUserStub.returns(y);

			userController.postActivation(postActivationMock, responseMock);
			d.resolve(retObj);
			x.resolve(retObj);

			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));
			done();
		});

		it('should return json failure response', function(done){
			var d=Q.defer();
			var p=d.promise;
			postActivationStub.returns(p);
			var x=Q.defer();
			var y=x.promise;
			activateUserStub.returns(y);

			userController.postActivation(postActivationMock, responseMock);
			d.reject({result:false, message:'Invalid code'});	
			sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub,{result:false,message:'Invalid code'});
			done();
		});


	});

	describe('getAllUsers test', function(){
		var getAllUsersStub, getUserViewModelStub;
		before(function(){
			getAllUsersStub=sinon.stub(userMock, 'getAllUsers');
			getUserViewModelStub=fakes.stub(userMock, 'getUserViewModel');
		});
		beforeEach(function(){
			getAllUsersStub.reset();
			getUserViewModelStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json object with result value true...', function(done){
			var reqObj={}, userObj={};
			var retObj={result:true, objects:{},meta:{}};
			var d=Q.defer();
			var p=d.promise;
			getAllUsersStub.returns(p);
			getUserViewModelStub(userObj);

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
			getUserViewModelStub.returns(userObj);

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
		var getUserStub, getUserViewModStub;
		before(function(){
			getUserStub=sinon.stub(userMock, 'getUser');
			getUserViewModStub=fakes.stub(userMock, 'getUserViewModel');
		});
		beforeEach(function(){
			getUserStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		it('should return json object with result value true...', function(done){
			var userObj={};

			var retObj={result:true, object:{}};
			var d=Q.defer();
			var p=d.promise;
			getUserStub.returns(p);
			getUserViewModStub(userObj);

			userController.getAllUsers(getUserMock, responseMock);
			d.resolve(retObj);
			//sinon.assert.calledOnce(jsonStub);
			sinon.assert.calledWith(jsonStub, sinon.match(retObj));
			done();
		});
		it('should return json failure response', function(done){
			var reqObj={}, userObj={};
			var d=Q.defer();
			var p=d.promise;
			getUserStub.returns(p);
			getUserViewModStub.returns(userObj);

			userController.getUser(getUserMock, responseMock);
			d.reject({result:false, name:'NOTFOUND'});	
			sinon.assert.calledOnce(sendFailureResponseStub);
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
			done();

		});
	});


	

		
});

				
