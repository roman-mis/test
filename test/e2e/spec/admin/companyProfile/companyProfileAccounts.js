describe('checking companyProfile accounts tab', function () {

  //var companyProfileLink = $('a[href="/admin/companyprofile/contact"]');

  it('Getting right url', function () {
    browser.get('/admin/companyprofile/accounts');
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('/admin/companyprofile/accounts') !== -1);
      });
    });
  });

  it("accounts link text should be Accounts", function () {
    expect($('a[href="/admin/companyprofile/accounts"]').getText()).toEqual('Accounts');
  });

  it('should count all account details = 6', function () {
    var details = $$('ul.entry-content li');
    expect(details.count()).toBe(6);
  });

  it(" entry-title title", function () {
    expect($('p.entry-title').getText()).toEqual('Accounts Details');
  });

  it("should check opening editing window", function () {
    $('a.pull-right').click();
    expect($('div.modal-window').isDisplayed()).toBeTruthy();
  });

  it(' checking 6 input fields in accounts modal form', function () {
    expect(element.all(by.css('div.modal-content input')).count()).toBe(6);
  });
  it('should check text of input field labels', function () {
    var labels = $$('div.modal-window label.control-label');
    expect(labels.count()).toBe(6);
    expect(labels.get(0).getText()).toEqual('Vat Number');
    expect(labels.get(1).getText()).toEqual('Company Registration Number');
    expect(labels.get(2).getText()).toEqual('UTR Number');
    expect(labels.get(3).getText()).toEqual('Tax District Number');
    expect(labels.get(4).getText()).toEqual('PAYE Reference');
    expect(labels.get(5).getText()).toEqual('Accounts Office Reference');
  });

  it("should check valid vat number error", function () {
    var vatNumber = element(by.model('companyProfile.accounts.vatNumber')),
      vatNumberError = $(' div [ng-show="accountsForm.vatNumber.$error.pattern || accountsForm.vatNumber.$error.number"]'),
      saveButton = element.all(by.css('.modal-footer button')).get(1);
    vatNumber.click().clear().sendKeys('1234');
    expect(vatNumberError.isDisplayed()).toBeTruthy();
    vatNumber.sendKeys('56789');
    expect(vatNumberError.isDisplayed()).not.toBeTruthy();
    vatNumber.sendKeys('ddf');
    expect(vatNumberError.isDisplayed()).toBeTruthy();
    expect(vatNumberError.getText()).toEqual('Please enter valid Vat Number.');


  });
/* No longer displayable
  it("should check company registration chars exceed error message", function () {
    var regNumber = element(by.model('companyProfile.accounts.companyRegNo')),
      regNumError = $(' div [ng-show="accountsForm.reg.$error.maxlength"]');
    regNumber.click().clear().sendKeys('12345678');
    expect(regNumError.isDisplayed()).not.toBeTruthy();
    regNumber.sendKeys('1');
    expect(regNumError.isDisplayed()).toBeTruthy();
    expect(regNumError.getText()).toEqual('Please enter registration number than 8 digits.');
    expect(element.all(by.css('.modal-footer button')).get(1).isEnabled()).toBe(false);

  });
*/
  it("should check valid company registration number error message", function () {
	  //! 'clicking on "Cancel" button...'
    element.all(by.css('div.modal-footer button')).get(0).click().then(function () {
		helper.alertAccept();
		browser.sleep(2000);
		//! 'open dialog again...'
      $('a.pull-right').click();
      var regNumber = element(by.model('companyProfile.accounts.companyRegNo')),
        regNumError = $(' div [ng-show="accountsForm.reg.$error.number"]');
      regNumber.clear().sendKeys('12312ff');
      expect(regNumError.isDisplayed()).toBeTruthy();
      expect(regNumError.getText()).toEqual('Please enter valid Company Registration Number.');


    });

  });

  it('should check utr number chars exceed and valied number error message', function () {
    var utrNumber = element(by.model('companyProfile.accounts.utrNumber')),
      utrNumError = $(' div[ng-show="accountsForm.utr.$error.maxlength"]'),
      utrValidNumberError = $('div[ng-show="accountsForm.utr.$error.number"]');

    utrNumber.clear().sendKeys('12345678910');
    expect(utrNumError.isDisplayed()).toBeTruthy();
    expect(utrNumError.getText()).toEqual('Enter less than 10 digits.');
    expect(element.all(by.css('.modal-footer button')).get(1).isEnabled()).toBe(false);
    utrNumber.clear().sendKeys('123123f');
    expect(utrValidNumberError.isDisplayed()).toBeTruthy();
    expect(element.all(by.css('.modal-footer button')).get(1).isEnabled()).toBe(false);
    element.all(by.css('div.modal-footer button')).get(0).click();
    helper.alertAccept();
	browser.sleep(2000);
    $('a.pull-right').click();
    utrNumber.clear().sendKeys('12312312');
    expect(utrValidNumberError.isDisplayed()).not.toBeTruthy();
    expect(utrNumError.isDisplayed()).not.toBeTruthy();
    
  });


  var details = {
    vatNumber: (new Date).getTime().toString().substring(0, 10),
    companyRegNo: (new Date).getTime().toString().substring(0, 8),
    utrNumber: (new Date).getTime().toString().substring(0, 10),
    taxDistrictNo: (new Date).getTime().toString().substring(0, 10),
    payeRef: (new Date).getTime().toString().substring(0, 10),
    accountsOfficeRef: (new Date).getTime().toString().substring(0, 10)
  };

  it("should check correctness of changing data in account details", function () {
    element(by.model('companyProfile.accounts.vatNumber')).clear().sendKeys(details.vatNumber);
    element(by.model('companyProfile.accounts.companyRegNo')).clear().sendKeys(details.companyRegNo);
    element(by.model('companyProfile.accounts.utrNumber')).clear().sendKeys(details.utrNumber);
    element(by.model('companyProfile.accounts.taxDistrictNo')).clear().sendKeys(details.taxDistrictNo);
    element(by.model('companyProfile.accounts.payeRef')).clear().sendKeys(details.payeRef);
    element(by.model('companyProfile.accounts.accountsOfficeRef')).clear().sendKeys(details.accountsOfficeRef);
    expect(element.all(by.css('.modal-footer button')).get(1).isEnabled()).toBe(true);

    element.all(by.css('.modal-footer button')).get(1).click().then(function () {
		helper.alertAccept();
      content = $$('ul.entry-content li span');
      expect(content.get(0).getText()).toEqual(details.vatNumber);
      expect(content.get(1).getText()).toEqual(details.companyRegNo);
      expect(content.get(2).getText()).toEqual(details.utrNumber);
      expect(content.get(3).getText()).toEqual(details.taxDistrictNo);
      expect(content.get(4).getText()).toEqual(details.payeRef);
      expect(content.get(5).getText()).toEqual(details.accountsOfficeRef);

    });

  });

});
