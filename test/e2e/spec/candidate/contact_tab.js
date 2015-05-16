var links = $$('.table-view-main-content .tabs-wrapper .nav-tabs a[href^="/candidates/"]');

describe('Checking candidates contact tab', function () {

  var editLink1 = $('[ng-click="openPrimaryAddressEdit()"]');
  var editLink2 = $('[ng-click="openPrimaryContactEdit()"]');
  var editLink3 = $('[ng-click="openBankDetailsEdit()"]');

  var testDialog = function (link) {
    var cancelBtn = $('.modal-content [ng-click="cancel()"]');
    link.click();
    browser.driver.wait(function() {
      return $('.modal-content').isDisplayed().then(function(bool){
        return bool;
      })
    },2000).then(function(){
      cancelBtn.click().then(function(){
        expect($('.modal-content').isPresent()).toBeFalsy();
      });
    });
  };

  it('Testing popup dialog for open/close', function () {
    helper.getByText(links, 'Contact').click();
    testDialog(editLink1);
    testDialog(editLink2);
    testDialog(editLink3);
  });

  /// data fill test
  var number = helper.getDefaultNumber();
  var inputs = element.all(by.css('.modal-content input'));
  var saveBtn = $('.modal-content [ng-click="ok()"]');

  it('Primary address data input', function () {

    /// First dialog
    editLink1.click();

    inputs.get(0).clear().sendKeys('Address1_' + number);
    inputs.get(1).clear().sendKeys('Address2_' + number);
    inputs.get(2).clear().sendKeys('Address3_' + number);
    inputs.get(3).clear().sendKeys('Town_' + number);
    inputs.get(4).clear().sendKeys('E20 2BB');
    //inputs.get(4).clear().sendKeys('Country_' + number);
    //inputs.get(5).clear().sendKeys('E20 2BB');
    saveBtn.click();

    expect($('[ng-show="contactDetail.address1"]').getText()).toBe('Address1_' + number);
    expect($('[ng-show="contactDetail.address2"]').getText()).toBe('Address2_' + number);
    expect($('[ng-show="contactDetail.address3"]').getText()).toBe('Address3_' + number);
    
    browser.refresh();
    
    browser.waitForAngular(function(){
		expect($('[ng-show="contactDetail.address1"]').getText()).toBe('Address1_' + number);
		expect($('[ng-show="contactDetail.address2"]').getText()).toBe('Address2_' + number);
		expect($('[ng-show="contactDetail.address3"]').getText()).toBe('Address3_' + number);
	});
    // expect($('[ng-show="contactDetail.nationality"]').getText()).toBe('Afghan');

  });


  var labels = element.all(by.css('span.meta'));
  var labels2 = element.all(by.css('span.meta-o'));

  it('Primary contact info data input', function () {
    editLink2.click();

    inputs.get(0).clear().sendKeys('02012' + number);
    inputs.get(1).clear().sendKeys('07012' + number);
    inputs.get(2).clear().sendKeys('boojaka_r' + number + '@gmail.com');
    inputs.get(3).clear().sendKeys('alt_r' + number + '@gmail.com');
    inputs.get(4).clear().sendKeys('https://www.facebook.com/boojaka' + number);
    inputs.get(5).clear().sendKeys('https://www.linkedin.com/profile/view?id=16' + number);
    saveBtn.click();

    expect(labels.get(0).getText()).toBe('02012' + number);
    expect(labels.get(1).getText()).toBe('07012' + number);
    expect(labels2.get(0).getText()).toBe('boojaka_r' + number + '@gmail.com');
    expect(labels2.get(1).getText()).toBe('alt_r' + number + '@gmail.com');
    expect(labels2.get(2).getText()).toBe('https://www.facebook.com/boojaka' + number);
    expect(labels2.get(3).getText()).toBe('https://www.linkedin.com/profile/view?id=16' + number);

  });

  it('Bank Details data input', function () {
    /// Second dialog
    editLink3.click();

    inputs.get(0).clear();
    inputs.get(0).sendKeys('Bank_' + number);
    inputs.get(1).clear();
    inputs.get(1).sendKeys('RBS_' + number);
    inputs.get(2).clear();
    inputs.get(2).sendKeys('81' + number);
    inputs.get(3).clear();
    inputs.get(3).sendKeys(number);
    inputs.get(4).clear();
    inputs.get(4).sendKeys(number);
    saveBtn.click();


	expect(labels.get(2).getText()).toBe('Bank_' + number);
    expect(labels.get(3).getText()).toBe('RBS_' + number);
    expect(labels.get(4).getText()).toBe('81' + number);
    expect(labels.get(5).getText()).toBe(number);
    expect(labels.get(6).getText()).toBe(number);

  });
});
