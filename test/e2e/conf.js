exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:9000',
	capabilities: {
		'browserName': 'chrome'
	},
	suites: {
		reg: './spec/reg.js',
		login: './spec/login.js',
    candidates: ['./spec/login.js','./spec/candidates.js'],
    sidebar: ['./spec/login.js','./spec/sidebar.js'],
    test: ['./spec/dummy.js']
	}

};
