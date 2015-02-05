'use strict';

var rewire=require('rewire');
var utils=rewire('../../../server/utils/utils');
var chai=require('chai');
var expect=chai.expect;

describe('utils tests',function(){
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
			var retVal=utils.parseEnumValue(enumObj, 'key2');
			expect(retVal).to.be.ok();
			expect(retVal).to.have.property('key2').and.equal('value2');
			done();
		});
	});

	describe('nullifyDate tests', function(){
		it('should return ull for an empty date value or the dateValue if not null', function(done){
			var isodate = new Date().toISOString();
			var nullDate = '';
			dateObj = utils.nullifyDate(isodate);
			nullObj = utils.nullifyDate(nullDate);
			expect(dateObj).to.be.ok();
			expect(nullObj).to.be.null;
			done();
		});
	});

	describe('compareSecureString tests', function(){
		it('should return true if plainString hashes to secureString, otherwise false', function(done){
			var hash = bcrypt.hash("greenEggz", null, null);
			var retVal = utils.compareSecureString(hash, "greenEggz");
			expect(retVal).to.be.true;
			done();
		});
	});

	describe('updateModel tests', function(){
		it('should return array containing key, val pairs for a viewmodel', function(done){
			var model = [{ 'youtubeId': '1234',
    				       'keywords': "hello",
    					'watches': [ {
        					'dateAdded': "12345",
        					'keyword': 'now',
        					'watcher': 'me'
    					} ],
    					'dateAdded': '2000 AD',
			}];
			var viewmodel = [{ 'addedField':'123val', 'addedField2': '456val'}];

			var model = utils.updateModel(model, viewmodel);
			expect(model).to.be.ok();
			expect(model).to.have.property('addedField2').and.equal('456val');
			done();
			});
	});

	describe('updateSubModel tests', function(){
		it('should should update model with values from viewmodel', function(done){
			var model = [{ '_id': '1q2w3e4r',
					'youtubeId': '1234',
    				       'keywords': "hello",
    					'watches': [ {
        					'dateAdded': "12345",
        					'keyword': 'now',
        					'watcher': 'me'
    					} ],
    					'dateAdded': '2000 AD',
			}];
			
			
			var viewmodel = [{ 'addedField':'123val', 'addedField2': '456val'}];
			model = utils.updateSubModel(model, viewmodel);
			expect(model).to.be.ok();
			expect(model).to.have.property('addedField2').and.equal('456val');
			expect(model).to.not.have.property('_id');
			done();
		});
	});

	//describe('filter test', function(){
	//	it('should ', function(done){
	
	//	});
	//});
	
	describe('padLeft test', function(){
		it('should prepend str to the begining of the substring nr, giving a total length of n', function(done){
			var nr = 'hello';
			var n = 'hellobellowmello';
			var str = 'Luser';
			var arr = [];
			arr = utils.padLeft(nr, n, str);
			console.log("array returned is...");
			console.log(arr);
			expect(arr).to.eql(['Luserhellobellowmello']);

		});
	
	});

});
