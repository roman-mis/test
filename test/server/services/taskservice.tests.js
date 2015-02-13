'use strict';


var sinon=require('sinon'),
	mockery=require('mockery'),
	 chai=require('chai'),
	 expect=chai.expect,
	Q=require('q');

//this is the parent test suite for the whole controller
describe('taskservice',function(){
	
	//declaration for mocks and test data
	var taskService, dbMock;
	var taskModelMock;

	//before function is called for each test suite inside this test suite
	before(function(){
		
		//mockery configuration
		mockery.enable({
			warnOnReplace:false,
			warnOnUnregistered:false,
			useCleanCache:true
		});
		
		taskModelMock={find:function(){}};
		dbMock={Task:taskModelMock};

		taskService=require('../../../server/services/taskservice')(dbMock);

	});	

	after(function(){
		mockery.disable();
	});
	
	beforeEach(function () {
        sinon.stub(process, 'nextTick').yields();
   	 });
   	 afterEach(function () {
        process.nextTick.restore();
    	});
	
	describe('#getTaskDetails', function(){
		var tasks,taskFindStub,taskQueryMock,userId;
		
		before(function(){
			userId='5556fafabasdfaszy55';
			//lets create some test data to be used later on
			tasks=[{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'},
			{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html task 2',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'}];
			
			taskFindStub=sinon.stub(dbMock.Task, 'find');
			taskQueryMock={exec:function(){}};
			

		});
		
		beforeEach(function(){
			taskFindStub.reset();
			
			taskQueryMock={exec:function(){}};
			
		});
		//test case
		it('should result an array of tasks',function(done){

			taskFindStub.returns(taskQueryMock);
			taskQueryMock.exec=function(cb){
				
				cb(null,tasks);
				
			};
			
			var p=taskService.getTaskDetails(userId);
			
			p.then(function(allTasks){
				
				expect(allTasks).to.be.ok();
				expect(allTasks).to.have.length(2);
				done();
			}).fail(function(err){
				
				done(err);
			});
			
		
		});



	});


	
});


		


