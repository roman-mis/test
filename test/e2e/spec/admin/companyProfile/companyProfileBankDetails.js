describe("checking company profile bank details tab", function () {

	var	bankDetailsLink = $('a[href="/admin/companyprofile/bankdetails"]'),
		editBankDetails = element(by.css('a.pull-right'));


	var bankNameField = element(by.model('companyProfile.bankDetails.bankName')),
		address1Field = element(by.model('companyProfile.bankDetails.address1')),
		address3Field = element(by.model('companyProfile.bankDetails.address2')),
		townField = element(by.model('companyProfile.bankDetails.town')),
		countyField = element(by.model('companyProfile.bankDetails.county')),
		countryField = element(by.model('companyProfile.bankDetails.country')),
		postcodeField = element(by.model('companyProfile.bankDetails.postcode')),
		accountNameField = element(by.model('companyProfile.bankDetails.accountName')),
		accountNumber = element(by.model('companyProfile.bankDetails.accountNo')),
		sortCodeField = element(by.model('companyProfile.bankDetails.sortCode')),
		payrollRefField = element(by.model('companyProfile.bankDetails.payrollRef')),
		saveButton = element.all(by.css('.modal-footer button')).get(1),
		cancelButton = element.all(by.css('.modal-footer button')).get(0),

		bankNameFieldEmptyError = $('div[ng-show="bankDetailsForm.bankName.$error.required"]'),
		address1FieldEmptyError = $('div[ng-show="bankDetailsForm.address1.$error.required"]'),
		townFieldEmptyError = $('div[ng-show="bankDetailsForm.town.$error.required"]'),
		postcodeFieldPatternError = $('div[ng-show="bankDetailsForm.postcode.$error.pattern"]'),
		accountNameFieldEmptyError = $('div[ng-show="bankDetailsForm.accountName.$error.required"]'),
		accountNumberFieldError = $('div[ng-show="bankDetailsForm.accountNumber.$error.required || bankDetailsForm.accountNumber.$error.number "]'),
		sortCodeFieldError = $('div[ng-show="bankDetailsForm.sort.$error.required || bankDetailsForm.sort.$error.number "]'),
		payrollRefFieldEmptyError = $('div[ng-show="bankDetailsForm.payrollRef.$error.required"]'),
		accountNumberExceedError = element.all(by.css('div[ng-show="bankDetailsForm.accountNumber.$error.maxlength"]')).get(0);

	var bankDetails = {
		bankName : "Hana Bank",
		address1 : "55, Eulji-ro",
		address2 : "2Jung-gu",
		town: "Seoul",
		county: 'county',
		country: "South Korea",
		postcode: "CB10 1AA",
		accountName: "accountName",
		accountNumber: "84472132",
		sortCode: "12122",
		payrollRef: "12343"

	};

  it('Getting right url', function () {
    browser.get('/admin/companyprofile/bankdetails');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('/admin/companyprofile/bankdetails') !== -1);
      });
    });
  });

	it("current tab text equal bank details", function () {
		expect(bankDetailsLink.getText()).toEqual("Bank Details");
	});
	it("contact details title", function () {
		expect(element(by.css('p.entry-title')).getText()).toEqual("Contact Details");
	});
	it("entry content list items count = 11 ", function () {
		var items = $$('ul.entry-content li');
		bankDetailsLink.click().then( function () {
			expect(items.count()).toBe(11);
		});
	});
	it("checking content list items text", function () {
		var items = $$('ul.entry-content > li');
		expect(items.get(0).getText()).toContain("Bank Name");
		expect(items.get(1).getText()).toContain("Address 1");
		expect(items.get(2).getText()).toContain("Address 2");
		expect(items.get(3).getText()).toContain("Town");
		expect(items.get(4).getText()).toContain("County");
		expect(items.get(5).getText()).toContain("Country");
		expect(items.get(6).getText()).toContain("Post Code");
		expect(items.get(7).getText()).toContain("Account Name");
		expect(items.get(8).getText()).toContain("Account Number");
		expect(items.get(9).getText()).toContain("Sort Code");
		expect(items.get(10).getText()).toContain("Payroll Reference");

	});
	it("icon edit works", function () {
		var iconEdit = $('a.icon-edit'),
			modalWindow = $('div.modal-window');
		iconEdit.click();
		browser.sleep(1000);
		expect(modalWindow.isDisplayed()).toBeTruthy();	

	});

	it("checking modal window title", function () {
		expect($("h3.modal-title").getText()).toEqual("Edit Bank Details");
	});
	it("checking modal window labels", function () {
		var items = $$('div.modal-body div.form-group label.control-label');
			expect(items.get(0).getText()).toContain("Bank Name");
			expect(items.get(1).getText()).toContain("Address 1");
			expect(items.get(2).getText()).toContain("Address 2");
			expect(items.get(3).getText()).toContain("Town");
			expect(items.get(4).getText()).toContain("County");
			expect(items.get(5).getText()).toContain("Country");
			expect(items.get(6).getText()).toContain("Post Code");
			expect(items.get(7).getText()).toContain("Account Name");
			expect(items.get(8).getText()).toContain("Account Number");
			expect(items.get(9).getText()).toContain("Sort Code");
			expect(items.get(10).getText()).toContain("Payroll Reference");

	});
	it("checking modal window inputs", function () {
		var inputs = $$('div.modal-body div.form-group input');
		expect(inputs.count()).toBe(11);
	});



	it("should check bankNameField", function () {
		bankNameField.clear();
		expect(saveButton.isEnabled()).not.toBeTruthy();
		expect(bankNameFieldEmptyError.isDisplayed()).toBeTruthy();
		expect(bankNameFieldEmptyError.getText()).toEqual("Bank Name cannot be empty.");
		bankNameField.sendKeys(bankDetails.bankName);
		expect(bankNameFieldEmptyError.isDisplayed()).not.toBeTruthy();
		expect(saveButton.isEnabled()).toBeTruthy();
	});
	it("address1 field error", function () {
		address1Field.clear();
		expect(saveButton.isEnabled()).not.toBeTruthy();
		expect(address1FieldEmptyError.isDisplayed()).toBeTruthy();
		expect(address1FieldEmptyError.getText()).toEqual("Please enter Address 1.");
		address1Field.sendKeys(bankDetails.address1);
		expect(address1FieldEmptyError.isDisplayed()).not.toBeTruthy();
		expect(saveButton.isEnabled()).toBeTruthy();
	});

	it("town firled empty error", function () {
		townField.clear();
		expect(saveButton.isEnabled()).not.toBeTruthy();
		expect(townFieldEmptyError.isDisplayed()).toBeTruthy();
		expect(townFieldEmptyError.getText()).toEqual("Please enter town.");
		townField.sendKeys(bankDetails.town);
		expect(townFieldEmptyError.isDisplayed()).not.toBeTruthy();
		expect(saveButton.isEnabled()).toBeTruthy();

	});

	it("post code valid error", function () {
		postcodeField.clear().sendKeys("saddasd");
		expect(saveButton.isEnabled()).not.toBeTruthy();
		expect(postcodeFieldPatternError.isDisplayed()).toBeTruthy();
		expect(postcodeFieldPatternError.getText()).toEqual("Please enter valid postal code.");
		postcodeField.clear().sendKeys(bankDetails.postcode);
		expect(saveButton.isEnabled()).toBeTruthy();
		expect(postcodeFieldPatternError.isDisplayed()).not.toBeTruthy();

	});

	it("account name empty error", function () {
		accountNameField.clear();
		expect(accountNameFieldEmptyError.isDisplayed()).toBeTruthy();
		expect(saveButton.isEnabled()).not.toBeTruthy();
		expect(accountNameFieldEmptyError.getText()).toEqual("Please enter Account Name.");
		accountNameField.sendKeys("Name");
		expect(saveButton.isEnabled()).toBeTruthy();
		expect(accountNameFieldEmptyError.isDisplayed()).not.toBeTruthy();
	});

	it("account number valid, expeed and empty error", function () {
		accountNumber.clear();
		expect(accountNumberFieldError.isDisplayed()).toBeTruthy();
		expect(saveButton.isEnabled()).not.toBeTruthy();
		expect(accountNumberFieldError.getText()).toEqual("Please enter valid Account Number.");

		accountNumber.sendKeys("12312");
		expect(accountNumberFieldError.isDisplayed()).not.toBeTruthy();
		expect(saveButton.isEnabled()).toBeTruthy();
		expect(accountNumberExceedError.isDisplayed()).not.toBeTruthy();

		accountNumber.sendKeys("f");
		expect(accountNumberFieldError.isDisplayed()).toBeTruthy();
		expect(accountNumberExceedError.isDisplayed()).not.toBeTruthy();

		expect(saveButton.isEnabled()).not.toBeTruthy();
		//! 'Canceling'
		cancelButton.click();
		//! 'Prompting'
		helper.alertAccept();
		//! 'Edit bank details'
		browser.sleep(3000);
		editBankDetails.click();
		accountNumber.clear().sendKeys("123456789");
		expect(accountNumberExceedError.isDisplayed()).toBeTruthy();
		expect(accountNumberExceedError.getText()).toEqual("Account Number cannot exceed 8 digits.");
		expect(saveButton.isEnabled()).not.toBeTruthy();
		accountNumber.clear().sendKeys("12345678").then(function () {
			expect(accountNumberExceedError.isDisplayed()).not.toBeTruthy();
			expect(accountNumberFieldError.isDisplayed()).not.toBeTruthy();
		});
	});


	it("sort code error", function () {
		sortCodeField.clear();
		expect(saveButton.isEnabled()).toBeTruthy();

		sortCodeField.sendKeys("123");
		expect(sortCodeFieldError.isDisplayed()).not.toBeTruthy();
		expect(saveButton.isEnabled()).toBeTruthy();

		sortCodeField.sendKeys("f");
		expect(sortCodeFieldError.isDisplayed()).toBeTruthy();
		expect(sortCodeFieldError.getText()).toEqual("Please enter valid Sort Code.");
		expect(saveButton.isEnabled()).not.toBeTruthy();


		cancelButton.click();
		helper.alertAccept();
		browser.sleep(2000);
		editBankDetails.click();
		sortCodeField.clear().sendKeys("12312");
		expect(sortCodeFieldError.isDisplayed()).not.toBeTruthy();
		expect(saveButton.isEnabled()).toBeTruthy();		
	});

	it("Payroll Reference empty error", function () {
		payrollRefField.clear();
		expect(payrollRefFieldEmptyError.isDisplayed()).toBeTruthy();
		expect(saveButton.isEnabled()).not.toBeTruthy();

		payrollRefField.sendKeys("sadsda");
		expect(payrollRefFieldEmptyError.isDisplayed()).not.toBeTruthy();
		expect(saveButton.isEnabled()).toBeTruthy();

	});

	it("checking correctness of changing information", function () {
		bankNameField.clear().sendKeys(bankDetails.bankName);
		address1Field.clear().sendKeys(bankDetails.address1);
		address3Field.clear().sendKeys(bankDetails.address2);
		townField.clear().sendKeys(bankDetails.town);
		countyField.clear().sendKeys(bankDetails.county);
		countryField.clear().sendKeys(bankDetails.country);
		postcodeField.clear().sendKeys(bankDetails.postcode);
		accountNameField.clear().sendKeys(bankDetails.accountName);
		accountNumber.clear().sendKeys(bankDetails.accountNumber);
		sortCodeField.clear().sendKeys(bankDetails.sortCode);
		payrollRefField.clear().sendKeys(bankDetails.payrollRef);
		expect(saveButton.isEnabled()).toBeTruthy();

		saveButton.click();
		helper.alertAccept();
		var items = $$('ul.entry-content li span');
		expect(items.get(0).getText()).toEqual(bankDetails.bankName);
		expect(items.get(1).getText()).toEqual(bankDetails.address1);
		expect(items.get(2).getText()).toEqual(bankDetails.address2);
		expect(items.get(3).getText()).toEqual(bankDetails.town);
		expect(items.get(4).getText()).toEqual(bankDetails.county);
		expect(items.get(5).getText()).toEqual(bankDetails.country);
		expect(items.get(6).getText()).toEqual(bankDetails.postcode);
		expect(items.get(7).getText()).toEqual(bankDetails.accountName);
		expect(items.get(8).getText()).toEqual(bankDetails.accountNumber);
		expect(items.get(9).getText()).toEqual(bankDetails.sortCode);
		expect(items.get(10).getText()).toEqual(bankDetails.payrollRef);
	});

});
