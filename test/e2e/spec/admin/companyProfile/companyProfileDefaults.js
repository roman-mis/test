describe('checking companyProfile defaults tab', function () {

//	var editLink = $('a[href="/admin/companyprofile/contact"]'),
	bankDetailsLink = $('a[href="/admin/companyprofile/defaults"]'),
	entryTitle = $('p.entry-title'),
	defaultItems = $$('ul.entry-content li'),
	editButton = $('a.pull-right'),
	modalWindow = $('div.modal-window'),

	payFrequency =  element(by.model('companyProfile.defaults.payFrequency')),
	holidayPayRule = element(by.model('companyProfile.defaults.holidayPayRule')),
	paymentMethod = element(by.model('companyProfile.defaults.paymentMethod')),
	adminFee = element(by.model('companyProfile.defaults.adminFee')),
	derogationContract = element(by.model('companyProfile.defaults.derogationContract')),
	derogationSpreadWeeks = element(by.model('companyProfile.defaults.derogationSpreadWeeks')),
	communicationMethod = element(by.model('companyProfile.defaults.communicationMethod')),
	contractorStatus = element(by.model('companyProfile.defaults.contractorStatus')),
	taxCodeContractors = element(by.model('companyProfile.defaults.taxCodeContractors')),

	saveButton = element.all(by.css('.modal-footer button')).get(1),
	cancelButton = element.all(by.css('.modal-footer button')).get(0);

  it('Getting right url', function () {
    browser.get('/admin/companyprofile/defaults');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('/admin/companyprofile/defaults') !== -1);
      });
    });
  });

	it("checking defaults link text", function () {
 //     bankDetailsLink.click();
      expect(bankDetailsLink.getText()).toEqual("Defaults");
	});

	it("checking entry-title text", function () {
		expect(entryTitle.getText()).toEqual("Defaults");
	});

	it("checking defaults items  count", function () {
		expect(defaultItems.count()).toEqual(9);
	});

	it("checking defaults items text", function () {
		expect(defaultItems.get(0).getText()).toContain("Default Pay Frequency");
		expect(defaultItems.get(1).getText()).toContain("Default Holiday Pay Rule");
		expect(defaultItems.get(2).getText()).toContain("Default Payment Method");
		expect(defaultItems.get(3).getText()).toContain("Default Admin Fee");
		expect(defaultItems.get(4).getText()).toContain("Derogation Contract");
		expect(defaultItems.get(5).getText()).toContain("Derogation Spread Weeks");
		expect(defaultItems.get(6).getText()).toContain("Communication Method");
		expect(defaultItems.get(7).getText()).toContain("Contractor Status");
		expect(defaultItems.get(8).getText()).toContain("Default Tax Code Contractors");
	});

	it("checking edit button click", function () {
		editButton.click();
		expect(modalWindow.isDisplayed()).toBeTruthy();
	});

	it("should check edit window title", function () {
		expect($('h3.modal-title').getText()).toEqual("Edit Accounts");
	});

	it('should check edit window input labels', function () {
		var labels = $$('div.modal-body label');
			expect(labels.count()).toBe(9);
			expect(labels.get(0).getText()).toEqual("Default Pay Frequency");
			expect(labels.get(1).getText()).toEqual("Default Holiday Pay Rule");
			expect(labels.get(2).getText()).toEqual("Default Payment Method");
			expect(labels.get(3).getText()).toEqual("Default Admin Fee");
			expect(labels.get(4).getText()).toEqual("Derogation Contract");
			expect(labels.get(5).getText()).toEqual("Derogation Spread Weeks");
			expect(labels.get(6).getText()).toEqual("Communication Method");
			expect(labels.get(7).getText()).toEqual("Contractor Status");
			expect(labels.get(8).getText()).toContain("Default Tax Code Contractors");

	});


	/* баг з перезавантаженням */
	it("should check if changing information by select options work properly", function () {

		var items = $$('ul.entry-content li span'),
			arr = [];
		payFrequency.all(by.css('option')).get(1).click();
			arr.push(payFrequency.all(by.css('option')).get(1).getText());
		holidayPayRule.all(by.css('option')).get(1).click();
			arr.push(holidayPayRule.all(by.css('option')).get(1).getText());
		paymentMethod.all(by.css('option')).get(1).click();
			arr.push(paymentMethod.all(by.css('option')).get(1).getText());
		adminFee.all(by.css('option')).get(1).click();
			arr.push(adminFee.all(by.css('option')).get(1).getText());
		derogationContract.all(by.css('option')).get(1).click();
			arr.push(derogationContract.all(by.css('option')).get(1).getText());
		derogationSpreadWeeks.clear().sendKeys("12");
			arr.push(derogationSpreadWeeks.getText());
		communicationMethod.all(by.css('option')).get(1).click();
			arr.push(communicationMethod.all(by.css('option')).get(1).getText());
		contractorStatus.all(by.css('option')).get(1).click();
			arr.push(contractorStatus.all(by.css('option')).get(1).getText());
		taxCodeContractors.clear().sendKeys("2");
			arr.push(taxCodeContractors.getText());


		saveButton.click().then(function () {
			bankDetailsLink.click(function () {
				var i = 0;
				while(arr.length){
					expect(items.get(i).getText()).toEqual(arr.shift());
					i++;
				}
			});

		});






	});

});
