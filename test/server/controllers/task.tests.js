'use strict';

var sinon=require('sinon'),
	mockery=require('mockery'),
	chai=require('chai'),
	expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('Task controller tests',function(){
	
	//declaration for mocks and test data
	var responseMock,requestMock,taskController,taskServiceMock,tasks;

	//before function is called for each test suite inside this test suite
	before(function(){
		
		//mockery configuration
		mockery.enable({
			warnOnReplace:false,
			warnOnUnregistered:false,
			useCleanCache:true
		});

		//creating a mock object to be passed as a res parameter to the getTaskDetails function
		responseMock={'json':function(){}};
		
		//creating a mock object for the taskservice dependency
		//as we are only supposed to test the getTaskDetails function of the controller, we should try to avoid the call to the actual function in the service.
		taskServiceMock={'getTaskDetails':function(){}};
		
		//register the tastkServiceMock with the mockery so that the require('../services/taskservice') call will always return the supplied parameter which is a function that returns the mocked service object
		mockery.registerMock('../services/taskservice',function(){return taskServiceMock;});
		
		//now lets grab the controller whose method we are testing.
		taskController=require('../../../server/controllers/task')(null);
		
		//lets create some test data to be used later on
		tasks=[{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'},
		{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html task 2',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'}];
		
		//create a mock for the request object that is passed as req in getTaskDetails function that we are going to test
		//as params.id parameter is used from the req object, we need to make sure that it it setup with proper value.
		requestMock={body:{},params:{'id':'5556fafabasdfaszy55'}};
		
	});
	
	//this function is called at the end of the test suite
	after(function(){
		mockery.disable();
	});

	//test suite for getTaskDetails
	describe('getTaskDetails Tests',function(){

		//test case
		it('should return task details',function(done){

			//now let's stub(fake) the json function of the responseMock, which means we are faking the json function of the request object we are passing in order to see if .json function has been executed or not, which is our real goal here 
			sinon.stub(responseMock,'json');
			
			//create a blank promise that returns our test data.
			var p=Q(tasks);

			//stub getTaskDetails function of the mocked taskService an tell it to return the promise that we created earlier.
			sinon.stub(taskServiceMock,'getTaskDetails').returns(p);

			//at this point we have setup everything required to unit test the controller's getTaskDetails function
			//lets make an actual call to the controller's function by supplying our mocked/faked req and res parameters
			taskController.getTaskDetails(requestMock,responseMock);

			//As we are dealing with asynchronous promise here we need to do our assertions at the end of the promise, which is finally.
			p.finally(function(){
				
				//if everything went as planned, res.json should be called only once.
				sinon.assert.calledOnce(responseMock.json);

				//if everything went as planned res.json should have been executed by supplying result:true in the controller.
				sinon.assert.calledWith(responseMock.json,sinon.match({result:true}));

				sinon.assert.calledWith(responseMock.json,sinon.match({objects:tasks}));
				//we are done with the test
				done();
			});
			
			

			//done();
		});


	});	
});
