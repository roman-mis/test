var links = $$('.table-view-main-content .tabs-wrapper .nav-tabs a[href^="/candidates/"]');
var isNonAdminSession = !!global.isNonAdminSession;
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
      cancelBtn.click();
      helper.alertAccept();
      browser.sleep(4000);
      //expect($('.modal-content').isPresent()).toBeFalsy();
    });
  };

  it('Testing popup dialog for open/close', function () {
    helper.getByText(links, 'Contact').click();
    testDialog(editLink1);
    testDialog(editLink2);
    isNonAdminSession || testDialog(editLink3);
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
    helper.alertAccept();

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

    inputs.get(0).clear().sendKeys('020231' + number);
    inputs.get(1).clear().sendKeys('070231' + number);        
    inputs.get(2).clear().sendKeys(isNonAdminSession ? loginData.userEmail.replace('+','_') : 'boojaka_r' + number + '@gmail.com');
    inputs.get(3).clear().sendKeys('alt_r' + number + '@gmail.com');
    inputs.get(4).clear().sendKeys('https://www.facebook.com/' + (isNonAdminSession ? 'originemtest' : 'boojaka') + number);
    inputs.get(5).clear().sendKeys('https://www.linkedin.com/profile/view?id=16' + number);
    
    //browser.sleep(120000);
    saveBtn.click();
    helper.alertAccept();
    browser.refresh();

    expect(labels.get(0).getText()).toBe('020231' + number);
    expect(labels.get(1).getText()).toBe('070231' + number);
    expect(labels2.get(0).getText()).toBe(isNonAdminSession ? loginData.userEmail.replace('+','_') : 'boojaka_r' + number + '@gmail.com');
    expect(labels2.get(1).getText()).toBe('alt_r' + number + '@gmail.com');
    expect(labels2.get(2).getText()).toBe('https://www.facebook.com/' + (isNonAdminSession ? 'originemtest' : 'boojaka') + number);
    expect(labels2.get(3).getText()).toBe('https://www.linkedin.com/profile/view?id=16' + number);

  });

  isNonAdminSession || it('Bank Details inserting data', function () {
    /// Second dialog
    editLink3.click();

    inputs.get(0).clear();
    inputs.get(0).sendKeys('Bank_' + number);
    inputs.get(1).clear();
    inputs.get(1).sendKeys('RBS_' + number);
    inputs.get(2).clear();
    inputs.get(2).sendKeys('811' + number);
    inputs.get(3).clear();
    inputs.get(3).sendKeys(number+'1');
    inputs.get(4).clear();
    inputs.get(4).sendKeys(number+'2');
    // Third party account options need to tested //
    //helper.selectSimpleSelect(inputs.get(5),1);
    //helper.selectSimpleSelect(inputs.get(6),1);
    
    // ! 'Check it!'
	//browser.sleep(40000);
    saveBtn.click();
    helper.alertAccept();
    browser.refresh();
  });

  isNonAdminSession || it('Bank number should match input value', function(){

	expect(labels.get(2).getText()).toBe('Bank_' + number);

  });

  isNonAdminSession || it('RBS number should match input value', function(){
	  expect(labels.get(3).getText()).toBe('RBS_' + number);
  });

  isNonAdminSession || it('Account number should match last 3 digits of input value. Other digits must be masked with \'*\'', function(){
	  var input_3_masked = ('811' + number).replace(/(.*)(\d{3})$/, function(m, p0, p1){
		return p0.replace(/\d/g,'*')+p1;
	  });

	  expect(labels.get(4).getText()).toBe(input_3_masked);
  });

  isNonAdminSession || it('Checking other bank details', function(){
	  expect(labels.get(5).getText()).toBe(number+'1');
      expect(labels.get(6).getText()).toBe(number+'2');
  });

});
