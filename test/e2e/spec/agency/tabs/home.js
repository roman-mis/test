var links = $$('.nav-tabs li a');
var checkTabUrl = function (path) {
  browser.wait(function () {
    return browser.getCurrentUrl().then(function (url) {
      var re = new RegExp("agencies\/.{24}\/?" + path, 'g');
      return (url.match(re));
    });
  }, 3000);
};


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
 
