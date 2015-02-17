'use strict';


var sinon=require('sinon'),
	mockery=require('mockery'),
	 chai=require('chai'),
	 expect=chai.expect,
	Q=require('q'),
	testHelpers=require('../helpers/testHelpers');

//this is the parent test suite for the whole controller
describe('taskservice',function(){
	
	//declaration for mocks and test data
	var taskService, dbMock, candidateCommonMock;
	var  taskSaveStub,historySaveStub;

	//before function is called for each test suite inside this test suite
	before(function(){
		
		//mockery configuration
		mockery.enable({
			warnOnReplace:false,
			warnOnUnregistered:false,
			useCleanCache:true
		});
		
		//taskModelMock.find=function(){};

		//taskSaveMock={save:function(){}};
		//dbMock={Task:taskModelMock};
		dbMock={};
		candidateCommonMock={'getUser':function(){}};
		mockery.registerMock('./candidatecommonservice',function(){ return candidateCommonMock});

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
			dbMock.Task=testHelpers.getTaskModelMock();
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

	describe('#postTaskDetails', function(){
		var x, userId, tasks, historyDetails;
		var getUserStub, taskDetails;	
		before(function(){
			userId='5556fafabasdfaszy55';
			//lets create some test data to be used later on
			tasks=[{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'},
			{assignee:'assignee',owner:'',user:'',agency:'',priority:'P',taskType:'TASK',status:'1',templateHtml:'template html task 2',template:'templateid',templateTitle:'template title',followUpTaskDate:Date(),notifyMe:false,completedDate:Date(),taskCategory:'CAT1'}];

			taskDetails={'user':'54c6699cb50b1f740f5a7d30','assignee':'54c8ab3a409b43bc13170654','agency':'54c8bb4b27df08b003488587', 'priority':'2','taskType':'2','status':'2','templateHtml':'Payslip for  the candidate template body','template':'54c8f8a73b417dfc00ae9c9b', 'templateTitle':'Payslip Task template title','followUpTaskDate':'2015-01-04T18:15:00.000Z','notifyMe':true,'completedDate':null,'taskCategory':'CALL_LOG'};
    		
			historyDetails={ "eventType" : "CREATE_TASK","historyBy" :"54c6699cb50b1f740f5a7d30", "user" : "54c6699cb50b1f740f5a7d30","eventData" : null,"notes" : "DPA updated by ishwor m","eventDate" : "2015-01-28T14:59:04.611Z"};

			dbMock.Task=testHelpers.getTaskModelMock();
			dbMock.History=testHelpers.getHistoryModelMock();

			getUserStub=sinon.stub(candidateCommonMock,'getUser');
			taskSaveStub=sinon.stub(dbMock.Task.prototype,'save');
			historySaveStub=sinon.stub(dbMock.History.prototype,'save');

		});
		
		beforeEach(function(){
			getUserStub.reset();
			taskSaveStub.reset();
			historySaveStub.reset();
			//taskSaveStub={save:function(){}};
			
		});
		it('should save the task and create history', function(done){
			var dummyUser=testHelpers.getDummyUser();
			getUserStub.returns(dummyUser);
			taskSaveStub.yields(null,taskDetails);
			historySaveStub.yields(null,historyDetails);
			//var a=Q.all();
			//var p=Q.promise();
			var d=Q.defer();
			var p=d.promise;

			getUserStub.returns(p);
			x = taskService.postTaskDetails(userId, taskDetails, historyDetails);
			d.resolve(dummyUser);
		
			x.then(function(result){
				var taskModel=result.object;
				expect(taskModel).to.be.ok();
				
				expect(taskModel).to.have.property('user')
					.and.equal(taskDetails.user);
				sinon.assert.calledOnce(taskSaveStub);
				sinon.assert.calledOnce(historySaveStub);
				done();
			}).fail(function(err){
				
				done(err);
			});
		});

		it('should not save the task if no user found', function(done){
			var dummyUser=testHelpers.getDummyUser();
			getUserStub.returns(dummyUser);
			taskSaveStub.yields(null,taskDetails);
			historySaveStub.yields(null,historyDetails);
			//var a=Q.all();
			//var p=Q.promise();
			var d=Q.defer();
			var p=d.promise;

			getUserStub.returns(p);
			x = taskService.postTaskDetails(userId, taskDetails, historyDetails);
			d.resolve(null);
		
			x.then(function(result){
				
				done('Should not resolve');
			}).fail(function(err){
				
				done();
			});
		});
		
	});



});			
