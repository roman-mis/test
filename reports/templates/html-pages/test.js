var page = require('webpage').create();
	
    page.paperSize = {
        format: 'A4',
        margin: { 
			top:'0.8cm',
			bottom:'0.8cm',
			left: '0.5cm',
			right: '0.5cm'
			}
	};
	
	page.open('PATH_TO_HTML_FILE', function() {
		page.render('validation-report.pdf');
		phantom.exit();
	});