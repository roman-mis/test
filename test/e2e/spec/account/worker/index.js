

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
		describe('Performing "Worker" account tests', function(){
			console.log('but first we need to close Admin session');
		});
	},
	__dirname + '/../login/logout.js', // but first we need to close Admin session
	__dirname + '/../reg/reg.js',
	__dirname + '/../reg/check-inbox.js',
	__dirname + '/../reg/activate.js',
	__dirname + '/../login/login1.js',
	__dirname + '/../login/logout.js',
	workerAccountLoginData.save,
	__dirname + '/../login/admin_data.js',
	__dirname + '/../login/login1.js',
	// TODO set registered user account type to worker //
	__dirname + '/admin_check_is_worker.js',
	__dirname + '/../login/logout.js',
	workerAccountLoginData.load,
	__dirname + '/../login/login1.js',
	function(){
		global.isNonAdminSession = true;
	},
	// TODO test worker account //	
	__dirname + '/../../candidate/home_tab.js',
	__dirname + '/../../candidate/contact_tab.js',
	__dirname + '/../settings/change_avatar.js',
	__dirname + '/../settings/change_password.js',
	//__dirname + '/../settings/vehicle_info.js',
	__dirname + '/../login/logout.js',
	function(){
		global.isNonAdminSession = false;
	},
	
].forEach(helper.execScript);
 

 
