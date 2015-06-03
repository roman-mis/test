describe('Getting first agency properties', function () {


  it('getting /agencies url', function () {
    browser.get('/agencies');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('agencies') !== -1);
      });
    });
  });

  it('selecting first agency in the list', function () {
    element(by.repeater('row in options.data').row(0)).element(by.css('td:first-child')).click();
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.match(/agencies\/.{24}/g));
      });
    }, 3000);
  });

});

var links = $$('.nav-tabs li a');
var checkTabUrl = function (path) {
  browser.wait(function () {
    return browser.getCurrentUrl().then(function (url) {
      var re = new RegExp("agencies\/.{24}\/?" + path, 'g');
      return (url.match(re));
    });
  }, 3000);
};

var selectSimpleDynamicSelect = function ( element, optionNum, textGetter ) {
	expect(typeof(optionNum)).toBe('number');
	element.click();
	// for checks //
	typeof(textGetter) == 'function' && element.element(by.css('option[value="'+optionNum+'"]')).getText().then(textGetter);
	////////////////
	element.element(by.css('option[value="'+optionNum+'"]')).click();
	element.element(by.xpath('..')).click();
};

var pickRandomSelect = function(element, textGetter){
	element.click();
	var selector = element.all(by.css('option[value]'));
	selector.count().then(function(n){
		var opt = selector.get(Math.round(Math.random()*(n-1))|0);
		typeof(textGetter) == 'function' && opt.getText().then(textGetter);
		opt.click();
	});
	element.element(by.xpath('..')).click();
};

describe('Getting first agency properties', function () {


  it('checking tabs consistency', function () {
	//! 'checking link names'
    expect(links.get(0).getText()).toBe('Home');
    expect(links.get(1).getText()).toBe('Payroll');
    expect(links.get(2).getText()).toBe('Consultants');
    expect(links.get(3).getText()).toBe('Candidates');
    expect(links.get(4).getText()).toBe('Sales');
    expect(links.get(5).getText()).toBe('History');
    expect(links.get(6).getText()).toBe('Other');
	//! 'checking Home url address'
    links.get(0).click();
    checkTabUrl('');
    //! 'checking Payroll url address'
    links.get(1).click();
    checkTabUrl('payroll');
    //! 'checking Consultants url address'
    links.get(2).click();
    checkTabUrl('consultants');
    //! 'checking Candidates url address'
    links.get(3).click();
    checkTabUrl('candidates');
    //! 'checking Sales url address'
    links.get(4).click();
    checkTabUrl('sales');
    //! 'checking History url address'
    links.get(5).click();
    checkTabUrl('history');
    //! 'checking Other url address'
    links.get(6).click();
    checkTabUrl('other');

  });
});

describe('Editing home tab', function () {

  var inputs;

  var number = helper.getDefaultNumber();
  var saveBtn = $('.modal-content [ng-click="ok()"]');

  it('checking Address Information', function () {

    links.get(0).click();

	[0,1].forEach(function(status){
		//! 'open Edit Agency dialog'
		$('[ng-click="openAgencyEdit()"]').click();
    
		browser.wait(function(){
			inputs = {};
			return true;
		});
    
		element.all(by.css('.modal-content [ng-model^="data."]')).each(function(field){		
			
			field.getAttribute('ng-model').then(function(model){
				inputs[model.replace(/^data\./, '')] = field;
			});
		});
    
		browser.wait(function(){    
			//! ' selecting status'
			helper.selectSelector(inputs.status, status);
		
			//! ' typing agency name'
			inputs.name.clear().sendKeys('Agency Name_' + number);		
			//! ' typing address #1'
			inputs.address1.clear().sendKeys('Address1_' + number);		
			//! ' typing address #2'
			inputs.address2.clear().sendKeys('Address2_' + number);		
			//! ' typing address #3'
			inputs.address3.clear().sendKeys('Address3_' + number);
			//! ' typing town'
			inputs.town.clear().sendKeys('Town_' + number);		
			//! ' selecting country'
			helper.selectSelector(inputs.country, 0);
			//! ' typing post code'
			inputs.postCode.clear().sendKeys('E22 2EE');
			if(status == 1){
				//! 'typing registration number'
				inputs.companyRegNo.clear().sendKeys('23'+number);
				//! 'typing VAT number'
				inputs.companyVatNo.clear().sendKeys('123'+number);
			}
			return true;
		});
		//! ' clicking on "save" button'
		expect(saveBtn.isEnabled()).toBeTruthy();
	
		saveBtn.click();
		
		browser.refresh();
		
		var addressInformationLabels = element.all(by.css('.meta'));
		
		//! 'checking if data is saved'
		expect(addressInformationLabels.get(0).getText()).toBe('Agency Name_' + number);
		expect(addressInformationLabels.get(1).getText()).toBe('Address1_' + number);
		expect(addressInformationLabels.get(2).getText()).toBe('Address2_' + number);
		expect(addressInformationLabels.get(3).getText()).toBe('Address3_' + number);
		expect(addressInformationLabels.get(4).getText()).toBe('Town_' + number);
		expect(addressInformationLabels.get(5).getText()).toBe('United Kingdom');
		expect(addressInformationLabels.get(6).getText()).toBe('E22 2EE');
		if(status == 1){
			expect(addressInformationLabels.get(7).getText()).toBe('23'+number);
			expect(addressInformationLabels.get(8).getText()).toBe('123'+number);
		}
		
	});

  });
  
  it('checking Contacts Information', function(){
	//! 'open Edit Contacts dialog'
	$('[ng-click="openContactEdit()"]').click();
	
	browser.wait(function(){
		inputs = element.all(by.css('.modal-content input[ng-model]'));
		//! ' populating data'
		inputs.get(0).clear().sendKeys('02012'+number);
		inputs.get(1).clear().sendKeys('02012'+number);
		inputs.get(2).clear().sendKeys('02012'+number);
		inputs.get(3).clear().sendKeys('facebook.com/' + number);
		inputs.get(4).clear().sendKeys('linkedin.com/' + number);
		inputs.get(5).clear().sendKeys('http://website.com');
		inputs.get(6).clear().sendKeys('super@email.com');
		
		return true;
	});
	
	//! ' clicking on "save" button'
	expect(saveBtn.isEnabled()).toBeTruthy();
	//browser.pause();
	saveBtn.click();
	
	browser.refresh();   
    
    //! ' check if data is saved'
    var contactInformationLabels = element.all(by.css('.meta-o'));
    
    expect(contactInformationLabels.get(0).getText()).toBe('02012'+number);
    expect(contactInformationLabels.get(1).getText()).toBe('02012'+number);
    expect(contactInformationLabels.get(2).getText()).toBe('02012'+number);
    expect(contactInformationLabels.get(3).getText()).toBe('facebook.com/' + number);
    expect(contactInformationLabels.get(4).getText()).toBe('linkedin.com/' + number);
    expect(contactInformationLabels.get(5).getText()).toBe('http://website.com');
    expect(contactInformationLabels.get(6).getText()).toBe('super@email.com');
    
  });


});

describe('Editing consultants tab', function () {

  var number = helper.getDefaultNumber();

  var currRow=$$('.panel').last().element(by.repeater('consultant in branch.consultants').row(0));

  it('add new branch', function () {
	  

    links.get(2).click();
    $('[ng-click="openAgencyBranchModal(null)"]').click();

    element(by.model('data.name')).clear().sendKeys('Branch_'+number);
    element(by.model('data.address1')).clear().sendKeys('Address1_'+number);
    element(by.model('data.address2')).clear().sendKeys('Address2_'+number);
    element(by.model('data.address3')).clear().sendKeys('Address3_'+number);
    element(by.model('data.town')).clear().sendKeys('Town_'+number);
    element(by.model('data.postCode')).clear().sendKeys('E22 2EE');

    $('[ng-click="ok()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('editing new branch', function () {

    $$('[ng-click="toggleOpen()"]').last().click();
    $$('[ng-click="openAgencyBranchModal(branch)"]').last().click();

    expect(element(by.model('data.name')).getAttribute('value')).toBe('Branch_'+number);
    expect(element(by.model('data.address1')).getAttribute('value')).toBe('Address1_'+number);
    expect(element(by.model('data.address2')).getAttribute('value')).toBe('Address2_'+number);
    expect(element(by.model('data.address3')).getAttribute('value')).toBe('Address3_'+number);
    expect(element(by.model('data.town')).getAttribute('value')).toBe('Town_'+number);
    //expect(element(by.model('data.postcode')).getAttribute('value')).toBe('E22 2EE');

    $('[ng-click="ok()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('editing new consultant', function () {
    $$('[ng-click="openAgencyConsultantModal(branch, null)"]').last().click();

    element(by.model('data.firstName')).clear().sendKeys('FirstName_'+number);
    element(by.model('data.lastName')).clear().sendKeys('LastName_'+number);
    element(by.model('data.emailAddress')).clear().sendKeys('boojaka_'+number+'@gmail.com');
    element(by.model('data.phone')).clear().sendKeys(number);
    helper.selectSimpleSelect(element(by.model('data.role')),1)
    helper.selectSimpleSelect(element(by.model('data.status')),1)

    $('[ng-click="ok()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });



  it('checking consultant info', function () {
      

    //! 'CHECKING LOCKING OPTION'
    expect(currRow.element(by.css('[ng-click="changeConsultantLockStatus(consultant)"]')).element(by.css('.fa-unlock')).isPresent()).toBeTruthy();
    currRow.element(by.css('[ng-click="changeConsultantLockStatus(consultant)"]')).click();
    expect(currRow.element(by.css('[ng-click="changeConsultantLockStatus(consultant)"]')).element(by.css('.fa-lock')).isPresent()).toBeTruthy();

	//! 'Checking consultant info'
   
    currRow.element(by.css('[ng-click="openAgencyConsultantModal(branch, consultant)"]')).click();
    expect(element(by.model('data.firstName')).getAttribute('value')).toBe('FirstName_'+number);
    expect(element(by.model('data.lastName')).getAttribute('value')).toBe('LastName_'+number);
    expect(element(by.model('data.emailAddress')).getAttribute('value')).toBe('boojaka_'+number+'@gmail.com');
    expect(element(by.model('data.phone')).getAttribute('value')).toBe(number);
    expect(element(by.model('data.role')).element(by.css('[selected="selected"]')).getText()).toContain('Manager');
    expect(element(by.model('data.status')).element(by.css('[selected="selected"]')).getText()).toContain('Live');
    $('[ng-click="ok()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
    
  });
  
  it('send "change password" email request to consultant', function(){
	//! 'SENDING CHANGE EMAIL REQUEST'
	//! '(Email would be checked later)'

    currRow.element(by.css('[ng-click="changeConsultantPassword(consultant)"]')).click();
    browser.driver.switchTo().alert().accept();
    expect($('.alert-success').isPresent()).toBeTruthy();
  });
  
  it('remove consultant', function(){
    
    //! 'removing consultant'
    currRow.element(by.css('[ng-click="deleteAgencyConsultant(branch, consultant)"]')).click();
    browser.driver.switchTo().alert().accept();


  });
  
  it('delete branch', function(){
	  
	//! 'DELETING BRANCH'
	
	(function cleanup(){

		element.all(by.repeater('branch in branches')).count().then(function(count){
			$$('[ng-click="deleteAgencyBranch(branch)"]').last().click();
			browser.driver.switchTo().alert().accept();
			expect( element.all(by.repeater('branch in branches')).count()).toBe(count-1);
			if(count > 3) cleanup();
		});
		
	})();
		
    
  });


});

describe('Editing payroll tab', function () {

  var inputs = element.all(by.css('.modal-content input'));

  var number = helper.getDefaultNumber();
  var saveBtn = $('.modal-content [ng-click="ok()"]');
  
  var labels = element.all(by.css('.meta'));
  var labels2 = element.all(by.css('.meta-o'));

  it('edit default invoicing', function () {

    links.get(1).click();

	var holidayPayIncluded,
	employersNiIncluded,
	invoiceVatCharged,
	paymentTerms,
	invoiceMethod,
	invoiceDesign,
	invoiceTo,
	invoiceEmailPrimary,
	invoiceEmailSecondary;
	
	

	//! 'open "edit default invocing" dialog'
    $('[ng-click="openAgencyDefaultInvoicing()"]').click();   
    
    //! 'selecting "holiday pay include"'
    pickRandomSelect(element(by.model('data.holidayPayIncluded')), function(value){
		holidayPayIncluded = value;
	});
    
    //! 'selecting "employers ni included"'
    pickRandomSelect(element(by.model('data.employersNiIncluded')), function(value){
		employersNiIncluded = value;
	});
        
    //! 'selecting "Vat charged"'
    pickRandomSelect(element(by.model('data.invoiceVatCharged')), function(value){
		invoiceVatCharged = value;
	});
        
    //! 'selecting "payment terms"'
    pickRandomSelect(element(by.model('data.paymentTerms')), function(value){
		paymentTerms = value;
	});
    
    //! 'selecting "invoice method"'
    pickRandomSelect(element(by.model('data.invoiceMethod')), function(value){
		invoiceMethod = value;
	});
    
    //! 'selecting "invoice design"'
    pickRandomSelect(element(by.model('data.invoiceDesign')), function(value){
		invoiceDesign = value;
	});
        
    //! 'selecting "invoice to"'
    pickRandomSelect(element(by.model('data.invoiceTo')), function(value){
		invoiceTo = value;
	});
      
    
    //! 'typing "primary & secondary emails"'
    element(by.model('data.invoiceEmailPrimary')).clear().sendKeys('primary_'+number+'@email.com');
    
    element(by.model('data.invoiceEmailPrimary')).getAttribute('value').then(function(value){
		invoiceEmailPrimary = value;
	});
	
    element(by.model('data.invoiceEmailSecondary')).clear().sendKeys('secondary_'+number+'@email.com');
    
    element(by.model('data.invoiceEmailSecondary')).getAttribute('value').then(function(value){
		invoiceEmailSecondary = value;
	});
    
    //! 'clicking on "save button"'
    saveBtn.click();
    
    browser.refresh();
        
    
    
    browser.wait(function(){
		//! 'check "Holiday Pay included" to be', holidayPayIncluded
		expect(labels.get(0).getText()).toContain(holidayPayIncluded);
		//! 'check "Employers NI included" to be', employersNiIncluded
		expect(labels.get(1).getText()).toBe(employersNiIncluded);		
		//! 'check "VAT charged" to be', invoiceVatCharged
		expect(labels.get(2).getText()).toBe(invoiceVatCharged);
		//! 'check "Invoice method" to be', invoiceMethod
		expect(labels.get(3).getText()).toBe(invoiceMethod);
		//! 'check "Invoice design" to be', invoiceDesign
		expect(labels.get(4).getText()).toBe(invoiceDesign);

		//! 'check "Primary email address" to be', invoiceEmailPrimary
		expect(labels2.get(0).getText()).toBe(invoiceEmailPrimary);
		//! 'check "Primary secondary address" to be', invoiceEmailSecondary
		expect(labels2.get(1).getText()).toBe(invoiceEmailSecondary);
		
		//! 'check "Payment terms" to be', paymentTerms
		expect(labels.get(5).getText()).toBe(paymentTerms);
		//! 'check "Invoice to" to be', invoiceTo
		expect(labels.get(6).getText()).toBe(invoiceTo);
		
		return true;
    });
    
  });

  it('edit default payroll', function () {
	  
	var productType,
	marginType,
	marginChargedToAgency;

    links.get(1).click();
	
    $('[ng-click="openAgencyDefaultPayroll()"]').click();
    element.all(by.css('.switch_wrap input[type="checkbox"]:checked')).each(function (el, i) {
      el.element(by.xpath('..')).element(by.css('.bullet')).click();
    });

    element(by.model('data.marginAmount')).clear().sendKeys('5');
    element(by.model('data.holidayAmount')).clear().sendKeys('19');

    pickRandomSelect(element(by.model('data.productType')), function(v){
		productType = v;
	});
	
	pickRandomSelect(element(by.model('data.marginChargedToAgency')), function(v){
		marginChargedToAgency = v;
	});
	
    pickRandomSelect(element(by.model('data.marginType')), function(v){
		marginType = v;
	});	
    saveBtn.click();
	
	browser.refresh();

	browser.wait(function(){
		//! 'check "Product Type" to be', productType
		expect(labels.get(7).getText()).toBe(productType);
		//! 'check "Margin charged to agency" to be', marginChargedToAgency
		expect(labels.get(8).getText()).toBe(marginChargedToAgency);
		//! 'check "Margin Type" to be', marginType
		expect(labels.get(9).getText()).toBe(marginType);
		expect(labels.get(10).getText()).toBe('£5');
		expect(labels.get(11).getText()).toBe('19%');
		return true;
	});

  });

});

/*
describe('Editing sales tab', function () {

  var number = helper.getDefaultNumber();


  it('filling sales info', function () {

    links.get(4).click();
    //
    helper.selectSimpleSelect(element(by.model('data.sales.leadSales')),1);
    helper.selectSimpleSelect(element(by.model('data.sales.accountManager')),1);
    helper.selectSimpleSelect(element(by.model('data.sales.commisionProfile')),1);

    element(by.model('data.administrationCost.perReferral')).clear().sendKeys(parseInt(number.substr(-3, 3)));
    element(by.model('data.administrationCost.perTimesheet')).clear().sendKeys(parseInt(number.substr(-3, 3)));
    element(by.model('data.administrationCost.timesheetGross')).clear().sendKeys(parseInt(number.substr(-3, 3)));

    $('[ng-click="save()"]').click();
  });

});*/

/* TODO CHECK MAILBOX email on chanching pass agency-consultant tab*/
