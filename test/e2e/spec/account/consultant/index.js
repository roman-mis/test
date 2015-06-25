

var workerAccountLoginData = {
	save: function(){
		describe('Save login details', function() {
			it('save worker login details', function () {
				workerAccountLoginData.userName = loginData.userName;
				workerAccountLoginData.userSurname = loginData.userSurname;
				workerAccountLoginData.userEmail = loginData.userEmail;
				workerAccountLoginData.userPassword = loginData.userPassword;
			});
		});
	},
	load: function(){
		describe('Load back login details', function() {
			it('load login details', function () {
				loginData.userName = workerAccountLoginData.userName;
				loginData.userSurname = workerAccountLoginData.userSurname;
				loginData.userEmail = workerAccountLoginData.userEmail;
				loginData.userPassword = workerAccountLoginData.userPassword;
			});
		});
	}
};
// proposal: put "global.e2edir = __dirname" in 'conf-demo.js' to make more like absulute path...
[
	function(){
		describe('Performing "Consultant Agency" account tests', function(){
			global.TestConsultant = {
				loginUser: 'originemtest+t'+helper.getDefaultNumber()+'@yandex.com',
				loginPassword: 'andyboss'
			};
		});
	},	
	__dirname + '/../login/admin_data.js',
	__dirname + '/../login/login1.js',	
	__dirname + '/../../agency/agency_prefill.js',	
    __dirname + '/../../agency/check_agency.js',
	__dirname + '/../../agency/tabs/consultants.js',
	__dirname + '/../login/logout.js',
	function(){
		describe('Set up login instructions for "Consultant Agency" user', function(){
			var testConsultant = global.TestConsultant;
			it('setup consultant login', function(){
				loginData.userEmail=testConsultant.loginUser;
				loginData.userPassword=testConsultant.loginPassword;
			});
		});
	},
	__dirname + '/../reg/check-inbox.js',
	__dirname + '/../reg/activate.js',
	__dirname + '/../login/login1.js',	
	function(){
		global.isNonAdminSession = true;
	},
	// TODO test worker account //	
	__dirname + '/../../candidate/home_tab.js',
	__dirname + '/../../candidate/contact_tab.js',
	__dirname + '/../settings/change_avatar.js',
	__dirname + '/../settings/change_password.js',
	__dirname + '/../settings/vehicle_info.js',
	__dirname + '/../login/logout.js',
	function(){
		global.isNonAdminSession = false;
	},
	function(){
		describe('Tests "Consultant Agency" finished', function(){
			global.TestConsultant = null;
		});
	},
	
].forEach(helper.execScript);
 

 
