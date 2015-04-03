'use strict';

var rewire=require('rewire');
var utils=require('../../../server/utils/utils');
var chai=require('chai');
var bcrypt=require('bcryptjs');
var expect=chai.expect;
console.log('sss');
describe('utils tests',function(){
	describe.only('cloneObject Tests',function(){
		var obj={
			    "dateInformed":"May 16 2015 12:54:43 GMT+0545",
			    "startDate":"May 5 2015 12:54:43 GMT+0545",
			    "endDate":"May 15 2015 12:54:43 GMT+0545",
			    "days":[
			        {
			            
			            "amount": 59.220000000000006,
			            "weekNumber": 2
			            },
			            {
			            "amount": 39.480000000000004,
			            "weekNumber": 4
			            }
			        ]
			};
		it('should return proper cloned object without skipping attributes',function(done){
			var clonedObj=utils.cloneObject(obj,null,null);
			expect(clonedObj).to.deep.equal(obj);
			done();

		});

		it('should ignore certain attributes',function(done){
			var clonedObj=utils.cloneObject(obj,['endDate','days.weekNumber'],null);
			expect(clonedObj).to.not.deep.equal(obj);
			expect(clonedObj).to.deep.equal({
			    "dateInformed":"May 16 2015 12:54:43 GMT+0545",
			    "startDate":"May 5 2015 12:54:43 GMT+0545",
			    "days":[
			        {
			            
			            "amount": 59.220000000000006
			            },
			            {
			            "amount": 39.480000000000004
			            }
			        ]
			});
			expect(clonedObj).to.not.contain.keys('endDate');
			done();

		});

		
	});

	describe('findInArray Tests',function(){
		it('should return proper value from the array of objects',function(done){
			var arr=[{'key':'Key1','value':'value1'},{'key':'Key2','value':'value2'},{'key':'Key3','value':'value3'}];
			var obj=utils.findInArray(arr,'value2','value');
			expect(obj).to.be.ok();
			expect(obj).to.have.property('value').and.equal('value2');
			 done();
		});

		it('should return proper value from the array of string',function(done){
			var arr=['value1','value2','value3'];
			var obj=utils.findInArray(arr,'value2');
			expect(obj).to.be.ok();
			console.log('result for string testing');
			console.log(obj);
			expect(obj).to.equal('value2');
			 done();
		});
		

	});

	describe('secureString Tests',function(){
		it('should return secure string',function(done){
			this.timeout(6000);//becrypt  genSalt is time consuming 
			var password='password';
			return utils.secureString(password)
				.then(function(secureString){

					expect(secureString).to.be.ok();
					
					expect(secureString).to.not.equal(password);	
					console.log('all expectation done');
					
				}).then(done,done)
				;
		});
	});

	describe('parseEnumValue tests', function(){
		it('should return proper value from enum object', function(done){
			var enumObj= {'Key1': 'value', 'Key2': 'value2', 'Key3': 'value3'};
			var retVal=utils.parseEnumValue(enumObj, 'Key2');
			console.log("retVal is........");
			console.log(retVal);
			expect(retVal).to.equal('value2');
			done();
		});
	});

	describe('nullifyDate tests', function(){
		it('should return ull for an empty date value or the dateValue if not null', function(done){
			var isodate = new Date().toISOString();
			var nullDate = '';
			var dateObj = null;
			var nullObj = null;
			dateObj = utils.nullifyDate(isodate);
			nullObj = utils.nullifyDate(nullDate);
			expect(dateObj).to.equal(isodate);
			expect(nullObj).to.be.null;
			done();
		});
	});

	describe('compareSecureString tests', function(){
		it('should return true if plainString hashes to secureString, otherwise false', function(done){
			var hash = utils.secureString("greenEggz");
			var retVal = utils.compareSecureString(hash,"greenEggz");
			expect(retVal).to.be.ok();
			done();
		});
	});

	describe('updateModel tests', function(){
		it('should return array containing key, val pairs for a viewmodel', function(done){
			var model = { 'youtubeId': '1234',
    				       'keywords': "hello",
    					'watches': [ {
        					'dateAdded': "12345",
        					'keyword': 'now',
        					'watcher': 'me'
    					} ],
    					'dateAdded': '2000 AD',
			};
			var viewmodel = { 'addedField':'123val', 'addedField2': '456val'};

			//var model = utils.updateModel(model, viewmodel);
			var props = utils.updateModel(model, viewmodel);
			console.log("props is......");
			console.log(props);
			console.log("model is.....");
			console.log(model);
			expect(props).to.be.ok();
			expect(props).to.include('addedField');
			expect(props).to.include('addedField2');
			done();
			});
	});

	describe('updateSubModel tests', function(){
		it('should should update model with values from viewmodel', function(done){
			var model = { 
					'youtubeId': '1234',
    				       'keywords': "hello",
    					'watches': [ {
        					'dateAdded': "12345",
        					'keyword': 'now',
        					'watcher': 'me'
    					} ],
    					'dateAdded': '2000 AD',
			};
			
			
			var viewmodel = { 'addedField':'123val', 'addedField2': '456val', "_id":"1q2w3e4r"};
			var props = utils.updateSubModel(model, viewmodel);
			//model = utils.updateSubModel(model, viewmodel);
			console.log("props is......");
			console.log(props);
			console.log("model is....");
			console.log(model);
			expect(props).to.be.ok();
			expect(props).to.include('addedField');
			expect(props).to.include('addedField2');
			expect(props).to.not.have.property('_id');
			done();
		});
	});

	//describe('filter test', function(){
	//	it('should ', function(done){
	
	//	});
	//});
	
	describe('padLeft test', function(){
		it('should prepend str to the begining of the substring nr, giving a total length of n', function(done){
			var nr = '9';
			var n = 5;
			var str = '0';
			//var str2 = [];
			var strz = '';
			var str2 = utils.padLeft(nr, n, str);
			expect(str2).to.eql('00009');
			done();

		});
	
	});

});
