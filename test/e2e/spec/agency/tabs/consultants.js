var links = $$('.nav-tabs li a');

describe('Editing consultants tab', function () {

  var number = helper.getDefaultNumber();
  
  var testConsultant = global.TestConsultant;

  var currRow=$$('.panel').last().element(by.repeater('consultant in branch.consultants').row(0));
  
  it('cleanup agencies created by previous tests', function cleanup(){	  
	  
	  links.get(3).click();	  

      element.all(by.repeater('branch in branches')).count().then(function(count){
		  if(count > 1){
			$$('[ng-click="toggleOpen()"]').last().click();
			$$('[ng-click="deleteAgencyBranch(branch)"]').last().click();
			helper.alertAccept();
			expect( element.all(by.repeater('branch in branches')).count()).toBe(count-1);
			cleanup();
		  }
       });    
  });

  it('add new branch', function () {


    links.get(3).click();
    
    $$('[ng-click="openAgencyBranchModal(null)"]').last().click();

    element(by.model('data.name')).clear().sendKeys('Branch_'+number);
    element(by.model('data.address1')).clear().sendKeys('Address1_'+number);
    element(by.model('data.address2')).clear().sendKeys('Address2_'+number);
    element(by.model('data.address3')).clear().sendKeys('Address3_'+number);
    element(by.model('data.town')).clear().sendKeys('Town_'+number);
    element(by.model('data.postCode')).clear().sendKeys('E22 2EE');

    $('[ng-click="ok()"]').click();
    helper.alertAccept();
    browser.sleep(1000);
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('editing new branch', function () {


    $$('[ng-click="toggleOpen()"]').last().click();
    browser.sleep(500);
    $$('[ng-click="openAgencyBranchModal(branch)"]').last().click();

    expect(element(by.model('data.name')).getAttribute('value')).toBe('Branch_'+number);
    expect(element(by.model('data.address1')).getAttribute('value')).toBe('Address1_'+number);
    expect(element(by.model('data.address2')).getAttribute('value')).toBe('Address2_'+number);
    expect(element(by.model('data.address3')).getAttribute('value')).toBe('Address3_'+number);
    expect(element(by.model('data.town')).getAttribute('value')).toBe('Town_'+number);

    $('[ng-click="ok()"]').click();
    helper.alertAccept();
    browser.sleep(1000);
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('editing new consultant', function () {
	
	testConsultant && console.log('using account', testConsultant.loginUser);  
	  
    $$('[ng-click="openAgencyConsultantModal(branch, null)"]').last().click();

    element(by.model('data.firstName')).clear().sendKeys('FirstName_'+number);
    element(by.model('data.lastName')).clear().sendKeys('LastName_'+number);
    element(by.model('data.emailAddress')).clear().sendKeys(testConsultant ? testConsultant.loginUser : 'originemtest2+t'+number+'@yandex.com');
    element(by.model('data.phone')).clear().sendKeys(number);
    helper.selectSimpleSelect(element(by.model('data.role')),1)
    helper.selectSimpleSelect(element(by.model('data.status')),1)

    $('[ng-click="ok()"]').click();
    helper.alertAccept();
    browser.sleep(1000);
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
    expect(element(by.model('data.emailAddress')).getAttribute('value')).toBe(testConsultant ? testConsultant.loginUser : 'originemtest2+t'+number+'@yandex.com');
    expect(element(by.model('data.phone')).getAttribute('value')).toBe(number);
    expect(element(by.model('data.role')).element(by.css('[selected="selected"]')).getText()).toContain('Manager');
    expect(element(by.model('data.status')).element(by.css('[selected="selected"]')).getText()).toContain('Live');
    $('[ng-click="ok()"]').click();
    helper.alertAccept();
    browser.sleep(1000);
    expect($('.modal-content').isPresent()).toBeFalsy();

  });
/*
  it('send "change password" email request to consultant', function(){
	//! 'SENDING CHANGE EMAIL REQUEST'
	//! '(Email would be checked later)'

    currRow.element(by.css('[ng-click="changeConsultantPassword(consultant)"]')).click();
    browser.driver.switchTo().alert().accept();
    expect($('.alert-success').isPresent()).toBeTruthy();
  });*/

  testConsultant || it('remove consultant', function(){

    //! 'removing consultant'
    currRow.element(by.css('[ng-click="deleteAgencyConsultant(branch, consultant)"]')).click();
    //browser.driver.switchTo().alert().accept();
    helper.alertAccept();
    browser.sleep(1000);


  });

  testConsultant || it('delete branch', function(){

    element.all(by.repeater('branch in branches')).count().then(function(count){
      $$('[ng-click="deleteAgencyBranch(branch)"]').last().click();
      helper.alertAccept();
	  browser.sleep(1000);
      expect( element.all(by.repeater('branch in branches')).count()).toBe(count-1);
    });

	  //! 'DELETING BRANCH'
/*

    (function cleanup(){

      element.all(by.repeater('branch in branches')).count().then(function(count){
        $$('[ng-click="deleteAgencyBranch(branch)"]').last().click();
        browser.driver.switchTo().alert().accept();
        expect( element.all(by.repeater('branch in branches')).count()).toBe(count-1);
        if(count > 3) cleanup();
      });

    })();

*/

  });


});
