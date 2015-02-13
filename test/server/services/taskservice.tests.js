'use strict';


var sinon=require('sinon'),
	mockery=require('mockery'),
	// chai=require('chai'),
	// expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('taskservice',function(){
	
	//declaration for mocks and test data
	var responseMock,requestMock, postTaskDetailsMock,taskService, dbMock, userId;
	var jsonStub,sendFailureResponseStub, candidateCommonServiceMock;

	//before function is called for each test suite inside this test suite
	before(function(){
		
		//mockery configuration
		mockery.enable({
			warnOnReplace:false,
			warnOnUnregistered:false,
			useCleanCache:true
		});
		userId={'userId':'5556fafabasdfaszy55'};
		postTaskDetailsMock={body:{'assignee':'54c8ab3a409b43bc13170654','agency':'54c8bb4b27df08b003488587', 'priority':'2','taskType':'2','status':'2','templateHtml':'Payslip for  the candidate template body','template':'54c8f8a73b417dfc00ae9c9b', 'templateTitle':'Payslip Task template title','followUpTaskDate':'2015-01-04T18:15:00.000Z','notifyMe':true,'completedDate':null,'taskCategory':'CALL_LOG'},'user':{'id':'54c6699cb50b1f740f5a7d30','firstName':'matthew','lastName':'cheesman'},'params':{'id':'54c6699cb50b1f740f5a7d30'}}
	
		responseMock={'json':function(){}, 'sendFailureResponse':function(){}};
		jsonStub=sinon.stub(responseMock,'json');
		sendFailureResponseStub=sinon.stub(responseMock,'sendFailureResponse');
	
		candidateCommonServiceMock={'getUser':function(){}};
		dbMock={'Task':{'find':function(){}},'taskModel':{'save':function(){}},'save':{'bind':function(){}}};
		mockery.registerMock('../../../server/services/candidatecommonservice', candidateCommonServiceMock);
		taskService=require('../../../server/services/taskservice')(dbMock);

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
	
	describe('#getTaskDetails', function(){
		var tasks,taskFindStub, taskSaveStub, taskBindStub;
		//before function is called for each test suite inside this test suite
		before(function(){
			
			//lets create some test data to be used later on
			tasks=[{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'},
			{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html task 2',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'}];
			var newObject = dbMock.Task;
			console.log("newObject is....");
			console.log(newObject);
			taskFindStub=sinon.stub(dbMock.Task, 'find');
			taskSaveStub=sinon.stub(dbMock.taskModel,'save');
			// BIND AND EXEC STUBS STILL NEED WRITING....
			taskBindStub=sinon.stub(dbMock.

			
		});
		
		beforeEach(function(){
			taskFindStub.reset();
			//Stub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		//test case
		it('should return task details',function(done){

			//now let's stub(fake) the json function of the responseMock, which means we are faking the json function of the request object we are passing in order to see if .json function has been executed or not, which is our real goal here 
			
			
			//create a blank promise that returns our test data.
			var d=Q.defer();
			var p=d.promise;
			//stub getTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			taskFindStub.returns(p);

			//at this point we have setup everything required to unit test the controller's getTaskDetails function
			//lets make an actual call to the controller's function by supplying our mocked/faked req and res parameters
			taskService.getTaskDetails(userId,responseMock);
			// console.log('resolving promise');
			d.resolve(tasks);
			// console.log('promise resolved');
				
			//if everything went as planned, res.json should be called only once.
			sinon.assert.calledOnce(jsonStub);

			//if everything went as planned res.json should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));

			sinon.assert.calledWith(jsonStub,sinon.match({object:tasks}));
			//we are done with the test
			done();
		
		});

		//test case
		it('should send failure response on error',function(done){

			//now let's stub(fake) the json function of the responseMock, which means we are faking the json function of the request object we are passing in order to see if .json function has been executed or not, which is our real goal here 
			//sinon.stub(responseMock,'json');
			
			//create a blank promise that rejects.
			var d=Q.defer();
			var p=d.promise;

			//stub getTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			taskFindStub.returns(p);

			//at this point we have setup everything required to unit test the controller's getTaskDetails function
			//lets make an actual call to the controller's function by supplying our mocked/faked req and res parameters
			taskService.getTaskDetails(requestMock,responseMock);
			d.reject({result:false,name:'NOTFOUND'});
			
			//if everything went as planned, res.sendFailureResponse should be called only once.
			sinon.assert.calledOnce(sendFailureResponseStub);

			//if everything went as planned res.sendFailureResponse should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
			//we are done with the test
			done();


		});


	});

	describe('#postTaskDetails',function(){
		var tasks,postTaskDetailsStub;
		//before function is called for each test suite inside this test suite
		before(function(){
			
			//lets create some test data to be used later on
			tasks=[{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'},
			{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html task 2',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'}];
			postTaskDetailsStub=sinon.stub(taskServiceMock,'postTaskDetails');
			
		});
		
		beforeEach(function(){
			
			postTaskDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		//test case
		it('should post task details',function(done){
			var d=Q.defer();
			var p=d.promise;
			//stub postTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			postTaskDetailsStub.returns(p);
			taskController.postTaskDetails(postTaskDetailsMock,responseMock);
			var taskForPost = tasks[0];
			d.resolve({object: taskForPost});

			sinon.assert.calledOnce(jsonStub);

			//if everything went as planned res.json should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));

			sinon.assert.calledWith(jsonStub,sinon.match({object:taskForPost}));

			//we are done with the test
			done();
		});

	it('should send failure response on error',function(done){

			//now let's stub(fake) the json function of the responseMock, which means we are faking the json function of the request object we are passing in order to see if .json function has been executed or not, which is our real goal here 
			//sinon.stub(responseMock,'json');
			
			//create a blank promise that rejects.
			var d=Q.defer();
			var p=d.promise;

			//stub getTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			postTaskDetailsStub.returns(p);

			//at this point we have setup everything required to unit test the controller's getTaskDetails function
			//lets make an actual call to the controller's function by supplying our mocked/faked req and res parameters
			taskController.postTaskDetails(postTaskDetailsMock,responseMock);
			d.reject({result:false,name:'NOTFOUND'});
			
			//if everything went as planned, res.sendFailureResponse should be called only once.
			sinon.assert.calledOnce(sendFailureResponseStub);

			//if everything went as planned res.sendFailureResponse should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
			//we are done with the test
			done();


		});
	
	});

	describe('#getCalllogDetails',function(){
		var calllogTasks,getCalllogDetailsStub;
		//before function is called for each test suite inside this test suite
		before(function(){
			
			//lets create some test data to be used later on
			calllogTasks=[{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CALL_LOG'},
			{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html task 2',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CALL_LOG'}];
			getCalllogDetailsStub=sinon.stub(taskServiceMock,'getCalllogDetails');
			
		});
		
		beforeEach(function(){
			
			getCalllogDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		//test case
		it('should return task details',function(done){

			//now let's stub(fake) the json function of the responseMock, which means we are faking the json function of the request object we are passing in order to see if .json function has been executed or not, which is our real goal here 
			
			
			//create a blank promise that returns our test data.
			var d=Q.defer();
			var p=d.promise;
			//stub getTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			getCalllogDetailsStub.returns(p);

			//at this point we have setup everything required to unit test the controller's getTaskDetails function
			//lets make an actual call to the controller's function by supplying our mocked/faked req and res parameters
			taskController.getCalllogDetails(requestMock,responseMock);
			// console.log('resolving promise');
			d.resolve(calllogTasks);
			// console.log('promise resolved');
				
			//if everything went as planned, res.json should be called only once.
			sinon.assert.calledOnce(jsonStub);

			//if everything went as planned res.json should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));

			sinon.assert.calledWith(jsonStub,sinon.match({objects:calllogTasks}));
			//we are done with the test
			done();
		
		});

		//test case
		it('should send failure response on error',function(done){

			//now let's stub(fake) the json function of the responseMock, which means we are faking the json function of the request object we are passing in order to see if .json function has been executed or not, which is our real goal here 
			//sinon.stub(responseMock,'json');
			
			//create a blank promise that rejects.
			var d=Q.defer();
			var p=d.promise;

			//stub getTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			getCalllogDetailsStub.returns(p);

			//at this point we have setup everything required to unit test the controller's getTaskDetails function
			//lets make an actual call to the controller's function by supplying our mocked/faked req and res parameters
			taskController.getCalllogDetails(requestMock,responseMock);
			d.reject({result:false,name:'NOTFOUND'});
			
			//if everything went as planned, res.sendFailureResponse should be called only once.
			sinon.assert.calledOnce(sendFailureResponseStub);

			//if everything went as planned res.sendFailureResponse should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
			//we are done with the test
			done();


		});


	});

	describe('#postCalllogDetails',function(){
		var tasks,postCalllogDetailsStub;
		//before function is called for each test suite inside this test suite
		before(function(){
			
			//lets create some test data to be used later on
			tasks=[{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'},
			{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html task 2',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'}];
			postCalllogDetailsStub=sinon.stub(taskServiceMock,'postCalllogDetails');
			
		});
		
		beforeEach(function(){
			
			postCalllogDetailsStub.reset();
			jsonStub.reset();
			sendFailureResponseStub.reset();
		});
		//test case
		it('should post task details',function(done){
			var d=Q.defer();
			var p=d.promise;
			//stub postTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			postCalllogDetailsStub.returns(p);
			taskController.postCalllogDetails(postTaskDetailsMock,responseMock);
			//d.resolve(tasks);

			var taskForPost = tasks[0];
			d.resolve({object: taskForPost});
			sinon.assert.calledOnce(jsonStub);

			//if everything went as planned res.json should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(jsonStub,sinon.match({result:true}));

			sinon.assert.calledWith(jsonStub,sinon.match({object:taskForPost}));
			//we are done with the test
			done();
		});

	it('should send failure response on error',function(done){

			//now let's stub(fake) the json function of the responseMock, which means we are faking the json function of the request object we are passing in order to see if .json function has been executed or not, which is our real goal here 
			//sinon.stub(responseMock,'json');
			
			//create a blank promise that rejects.
			var d=Q.defer();
			var p=d.promise;

			//stub getTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			postCalllogDetailsStub.returns(p);

			//at this point we have setup everything required to unit test the controller's getTaskDetails function
			//lets make an actual call to the controller's function by supplying our mocked/faked req and res parameters
			taskController.postTaskDetails(postTaskDetailsMock,responseMock);
			d.reject({result:false,name:'NOTFOUND'});
			
			//if everything went as planned, res.sendFailureResponse should be called only once.
			sinon.assert.calledOnce(sendFailureResponseStub);

			//if everything went as planned res.sendFailureResponse should have been executed by supplying result:true in the controller.
			sinon.assert.calledWith(sendFailureResponseStub,sinon.match({result:false,name:'NOTFOUND'}));
					
			//we are done with the test
			done();


		});
	
	});

	
	
});


		


