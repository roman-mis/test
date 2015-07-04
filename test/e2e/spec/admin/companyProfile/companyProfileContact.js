describe('checking company profile',function () {

	var links = $$('.candidate-tabs li a'),

	    company = {
	    	companyName : 'company',
	    	address1 : 'address1',
	    	address2 : 'address2',
	    	town : 'town',
	    	country : 'country',
	    	postCode: 'WC2H 7LT',
	    	tel : '020231'+helper.getDefaultNumber(),
	    	fax : '070231'+helper.getDefaultNumber(),
	    	email: 'originemtest2@yandex.com'

	    };

  it('Getting right url', function () {
    browser.get('/admin/companyprofile/contact');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('/admin/companyprofile/contact') !== -1);
      });
    });
  });

	it("should check links if there are 4 links", function () {
		expect(links.count()).toBe(4);
	});
	it("should check the text of links", function () {
		expect(links.get(0).getText()).toEqual("Contact");
		expect(links.get(1).getText()).toEqual("Accounts");
		expect(links.get(2).getText()).toEqual("Bank Details");
		expect(links.get(3).getText()).toEqual("Defaults");

	});
	it("should check correctness of error messages information", function () {
		editInfoLink = $('p.entry-title a.pull-right');
		editInfoLink.click().then(function () {
			expect($('div.modal-window').isDisplayed()).toBeTruthy();
			var companyNameField =  element(by.model('companyProfile.contact.companyName'));
				companyNameField.click().clear();
			var button = element.all(by.css('div.modal-footer button')).get(1);
			//! 'checking companyName empty error'
			browser.sleep(500);
			var errMess = $('.alert-danger[ng-show="contactForm.companyName.$error.required"]');
			expect(errMess.isDisplayed()).toBeTruthy();
			expect(errMess.getText()).toBe("Company Name cannot be empty.");
			expect(button.isEnabled()).toBe(false);
			//! 'checking length exceed error'
			for(var i =0; i<=36; i++){
				companyNameField.sendKeys("1");
			}
			expect(errMess.isDisplayed()).not.toBeTruthy();
			var errMess2 = $('[ng-show="contactForm.companyName.$error.maxlength"]');
			expect(errMess2.isDisplayed()).toBeTruthy();

			//! 'checking Address1 empty error'
			var companyAddressField = element(by.model('companyProfile.contact.address1'));
				companyAddressField.sendKeys("2131231");
				companyAddressField.click().clear();
			var adMessErr = $('div [ng-show="contactForm.address1.$error.required"]');
				expect(adMessErr.isDisplayed()).toBeTruthy();
				expect(adMessErr.getText()).toBe("Please enter Address 1.");
				expect(button.isEnabled()).toBe(false);
			//! 'checking town empty error'
			var companyTownField = element(by.model('companyProfile.contact.town')),
				townEmptyError = $('div [ng-show="contactForm.town.$error.required"]');
				companyTownField.sendKeys("12132").click().clear();
				expect(townEmptyError.isDisplayed()).toBeTruthy();
				expect(button.isEnabled()).toBe(false);

			//! 'checking town country error'
			var companyCountryField = element(by.model('companyProfile.contact.country')),
				countryEmptyError = $('div [ng-show="contactForm.country.$error.required"]');
				companyCountryField.sendKeys("12132").click().clear();
				browser.sleep(100);
				expect(countryEmptyError.isDisplayed()).toBeTruthy();
				expect(button.isEnabled()).toBe(false);

			//! 'checking post code'
			var postCodeEl = element(by.model('companyProfile.contact.postcode')),
				postCodeError = $('input.ng-invalid[name="postcode"]');
				postCodeEl.clear().sendKeys('qwe');
				expect(postCodeError.isDisplayed()).toBeTruthy();

			//! 'cheking email error'
			var emailEl = element(by.model('companyProfile.contact.email')),
				emailError = $('.alert-danger[ng-show="contactForm.email.$error.email"]');
				emailEl.clear().sendKeys("qwe");
				browser.sleep(10);
				expect(emailError.isDisplayed()).toBeTruthy();


		});

	});

	it("should check correctness of editing", function () {
		element(by.model('companyProfile.contact.companyName')).clear().sendKeys(company.companyName);
		element(by.model('companyProfile.contact.address1')).clear().sendKeys(company.address1);
		element(by.model('companyProfile.contact.address2')).clear().sendKeys(company.address2);
		element(by.model('companyProfile.contact.town')).clear().sendKeys(company.town);
		element(by.model('companyProfile.contact.country')).clear().sendKeys(company.country);
		element(by.model('companyProfile.contact.postcode')).clear().sendKeys(company.postCode);
		element(by.model('companyProfile.contact.telephone')).clear().sendKeys(company.tel);
		element(by.model('companyProfile.contact.fax')).clear().sendKeys(company.fax);
		element(by.model('companyProfile.contact.email')).clear().sendKeys(company.email);
		var button = element.all(by.css('div.modal-footer button')).get(1),
		    modalWindow = $('div.modal-window'); 
		expect(button.isEnabled()).toBe(true);
		//browser.sleep(40000);
		button.click();
		helper.alertAccept();
		browser.sleep(2000);
		expect(browser.isElementPresent(modalWindow)).toEqual(false);


	});

	it("should check cancel button", function () {
		editInfoLink = $('p.entry-title a.pull-right');

		/*
		button = element.by.css('button[ng-click="cancel()"]');
		button.click();
		*/

	});

});
