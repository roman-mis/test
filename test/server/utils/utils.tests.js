var rewire=require('rewire');
var utils=rewire('../../../server/utils/utils');
var chai=require('chai');
var expect=chai.expect;

describe('utils tests',function(){
	describe('findInArray Tests',function(){
		it("should return proper value from the array of objects",function(done){
			var arr=[{'key':'Key1','value':'value1'},{'key':'Key2','value':'value2'},{'key':'Key3','value':'value3'}];
			var obj=utils.findInArray(arr,'value2','value');
			expect(obj).to.be.ok();
			expect(obj).to.have.property('value').and.equal('value2');
			 done();
		});
		
	});

	describe('secureString Tests',function(){
		it('should return secure string',function(done){
			var password="password";
			return utils.secureString(password)
				.then(function(secureString){

					console.log('function returned with this value   '+secureString);
					
					expect(secureString).to.be.ok();
					
					expect(secureString).to.not.be.a(password);	
					console.log('all expectation done');
					
				}).then(done,done)
				;
		});
	});
});