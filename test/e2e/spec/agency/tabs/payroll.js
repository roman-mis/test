var links = $$('.nav-tabs li a');
var checkTabUrl = function (path) {
  browser.wait(function () {
    return browser.getCurrentUrl().then(function (url) {
      var re = new RegExp("agencies\/.{24}\/?" + path, 'g');
      return (url.match(re));
    });
  }, 3000);
};


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
    helper.selectSimpleDynamicSelect(element(by.model('data.holidayPayIncluded')), 0, function(value){
		holidayPayIncluded = value;
	});
    
    //! 'selecting "employers ni included"'
    helper.selectSimpleDynamicSelect(element(by.model('data.employersNiIncluded')), 0, function(value){
		employersNiIncluded = value;
	});
        
    //! 'selecting "Vat charged"'
    helper.selectSimpleDynamicSelect(element(by.model('data.invoiceVatCharged')), 0, function(value){
		invoiceVatCharged = value;
	});
        
    //! 'selecting "payment terms"'
    helper.selectSimpleDynamicSelect(element(by.model('data.paymentTerms')), 0, function(value){
		paymentTerms = value;
	});
    
    //! 'selecting "invoice method"'
    helper.selectSimpleDynamicSelect(element(by.model('data.invoiceMethod')), 0, function(value){
		invoiceMethod = value;
	});
    
    //! 'selecting "invoice design"'
    helper.selectSimpleDynamicSelect(element(by.model('data.invoiceDesign')), 0, function(value){
		invoiceDesign = value;
	});
        
    //! 'selecting "invoice to"'
    helper.selectSimpleDynamicSelect(element(by.model('data.invoiceTo')), 0, function(value){
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

    element(by.model('data.marginAmount')).clear().sendKeys('5');
    element(by.model('data.holidayAmount')).clear().sendKeys('19');

    helper.selectSimpleDynamicSelect(element(by.model('data.productType')), 0, function(v){
		productType = v;
	});
	
	helper.selectSimpleDynamicSelect(element(by.model('data.marginChargedToAgency')), 0, function(v){
		marginChargedToAgency = v;
	});
	
    helper.selectSimpleDynamicSelect(element(by.model('data.marginType')), 0, function(v){
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
 
