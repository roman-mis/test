describe('KTest', function() {
	//HOUSEKEEPING
	browser.driver.manage().window().setSize(1050,850);
	browser.driver.manage().window().setPosition(0,0);
	var selectSelector=function(selectAll,item){
	selectAll.all(by.css('[ng-click="$select.toggle($event)"]')).get(0).click();
	selectAll.all(by.css('[ng-click="$select.select(item,false,$event)"]')).get(item).click();
	};

	//TESTS START HERE
	it('should login', function() {
	browser.get('http://localhost:9000');
	browser.setLocation('/register/home');
	element(by.model('emailAddress')).sendKeys('ishwor@makeitsimple.info');
	element(by.model('password')).sendKeys('passw0rd');
	element(by.css('.sign-in')).click();
	});

	it('should click first candidate', function() {
	var el = element.all(by.repeater('row in options.data')).get(0);
	el.element(by.css('.fa-eye')).click();
	});
	
	it('should sleep', function() {
    browser.sleep(1000000);
  });
});