describe('Using login details', function() {
  it('setting up random login details', function () {
    var randomNumber=new Date().getTime().toString().substr(-9,6);
    loginData.userName='originemtest_t'+randomNumber;
    loginData.userEmail=loginData.userName.replace('_','+')+'@yandex.com';
    loginData.userPassword='andyboss';
    loginData.userSurname='Tester_t'+randomNumber;
  });
});

describe('Browse to sign up', function() {

  var nextBtn=element(by.css('[ng-click="nextstep()"]'));
  var submitBtn=element(by.css('[ng-click="submit()"]'));
  var selectSelector=function(selectAll,item){
    selectAll.all(by.css('[ng-click="$select.toggle($event)"]')).get(0).click();
    selectAll.all(by.css('[ng-click="$select.select(item,false,$event)"]')).get(item).click();
  };
  var pasteInput=function(element,str){
    element.sendKeys(str);
  };
  var expectValid=function(element){
    expect(element.getAttribute('class')).toContain('ng-valid');

  };
  var expectInvalid=function(element) {
    expect(element.getAttribute('class')).toContain('ng-invalid');
  };

  var validateInputByModel=function(modelStr,inputStr) {
    var input = element(by.model(modelStr));
    expectInvalid(input);
    pasteInput(input,inputStr);
    expectValid(input);
  };
  var validateDateByName=function(name,inputStr) {
    var date=$('[name="'+name+'"] [ng-model="ngModel"]');
    date.sendKeys(inputStr);
    expect(date.getAttribute('class')).toContain('ng-valid');
  };



  /* TESTs START HERE */


  it('should navigate to page with register options ', function() {
    browser.get('/register/step1');
  });
  it('should navigate to step1 page ', function() {
    browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return (url.indexOf('step1') !== -1);
      });
    });
  });

  it('step1 form should have no errors', function() {
    nextBtn.click();

    var select=element(by.model('candidate.details.title'));
    expect(select.getAttribute('class')).toContain('ng-invalid');
    element(by.css('[ng-click="$select.toggle($event)"]')).click();
    element(by.className('select2-result-single')).click();
    expect(select.getAttribute('class')).toContain('ng-valid');

    validateInputByModel('candidate.details.firstName',loginData.userName);
    validateInputByModel('candidate.details.lastName',loginData.userSurname);

    // email test
    var input = element(by.model('candidate.details.emailAddress'));
    expectInvalid(input);
    input.sendKeys('boojaka');
    expectValid(input);
    input.clear();
    expectValid(input);
    expectInvalid(input);
    input.sendKeys(loginData.userEmail);
    expectValid(input);


    validateInputByModel('candidate.details.phone','07624123456');
    validateInputByModel('candidate.details.niNumber','AB 12 34 56 C');

    helper.getDateByModel('candidate.details.birthDate').clear().sendKeys('5/5/1991');

    nextBtn.click();
  });
  it('should navigate to step2 page ', function () {
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        return (url.indexOf('step2') !== -1);
      });
    });
  });


  it('step2 form should have no errors', function() {

   nextBtn.click();

  var select = element.all(by.model('candidate.details.gender'));
    expectInvalid(select.get(0));
    selectSelector(select,1);
    expectValid(select.get(0));


    var select = element.all(by.model('candidate.details.nationality'));
    expectInvalid(select.get(0));
    selectSelector(select,0);
    expectValid(select.get(0));
    expect($('.addtionalinfo-container').isDisplayed()).toBeFalsy();

    validateInputByModel('candidate.details.address1','Super street');
    validateInputByModel('candidate.details.town','Super town');
    validateInputByModel('candidate.details.postCode','E20 2BB');


    //additinal info for non-resident
    selectSelector(select,1);
    expect($('.addtionalinfo-container').isDisplayed()).toBeTruthy();

    var date=helper.getDateByModel('candidate.details.arrivalDate');
    date.sendKeys('2000/01/29');
    expect(date.getAttribute('class')).toContain('ng-valid');

    var date=helper.getDateByModel('candidate.details.recentDepDate');
    date.sendKeys('2000/01/01');
    expect(date.getAttribute('class')).toContain('ng-valid');

    var checkboxes=$$('.addtionalinfo-container [ng-model="candidate.details.empLastVisit"] ');
    checkboxes.get(0).click();

    nextBtn.click();
  });




  it('should navigate to step3 page ', function() {
    browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return (url.indexOf('step3') !== -1);
      });
    });
  });

  it('should validate step3 form', function() {
    validateInputByModel('candidate.details.agencyName', 'Super Agency');
    helper.getDateByModel('candidate.details.startDate').sendKeys('5/5/1991');
    nextBtn.click();
  });


  it('should navigate to step4 page ', function() {
    browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return (url.indexOf('step4') !== -1);
      });
    });
  });




  it('should validate step4 form', function() {
    nextBtn.click();
    validateInputByModel('candidate.details.bankName', 'Super bank');
    validateInputByModel('candidate.details.accountName', 'Super account name');
    validateInputByModel('candidate.details.sortCode', '123456');
    validateInputByModel('candidate.details.accountNo', '12345678');

    nextBtn.click();
  });



  it('should navigate to step5 page ', function() {
    browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return (url.indexOf('step5') !== -1);
      });
    });

    nextBtn.click();

  });





  //FILE Upload check commented

/*
   it('should validate step5 form', function() {

   var path = require('path');
   var fileToUpload = 'http://savepic.ru/6366199.png';
   var absolutePath = path.resolve(__dirname, fileToUpload);
   var file=$('[type="file"]');
   file.sendKeys(absolutePath);
   });*/



  //browser.get('/register/confirm');

  it('should navigate to confirm page ', function() {
    browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return (url.indexOf('confirm') !== -1);
      });
    });
  });



  it('should validate confirm form', function() {
	  
	//browser.sleep(120000);

	element(by.model('$parent.confirm.ContactDetail1')).click();
    expectValid(element(by.model('$parent.confirm.ContactDetail1')));

    element(by.model('$parent.confirm.ContactDetail2')).click();
    expectValid(element(by.model('$parent.confirm.ContactDetail2')));    

    element(by.model('$parent.confirm.BankDetail')).click();
    expectValid(element(by.model('$parent.confirm.BankDetail')));    

    element(by.model('$parent.confirm.TaxDetail')).click();
    expectValid(element(by.model('$parent.confirm.TaxDetail')));


    element(by.model('$parent.confirm.AcceptTerms')).click();
    expectValid(element(by.model('$parent.confirm.AcceptTerms')));

    submitBtn.click();

  });


/// change FINAL KEYWORD
  it('url should take to welcome page ', function() {
    browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return (url.indexOf('welcome') !== -1);
      });
    },3000);
  });

});

