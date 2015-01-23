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





  it('should navigate to page with register options ', function() {
    browser.get('/register/home');
  });


  it('should find reg button ', function() {
    var regButton=element(by.css('[ng-click="$parent.nextstep()"]'));
    expect(regButton.isPresent()).toBe(true);
    regButton.click();
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

    var select=element(by.model('candidate.title'));
    expect(select.getAttribute('class')).toContain('ng-invalid');
    element(by.css('[ng-click="$select.toggle($event)"]')).click();
    element(by.className('select2-result-single')).click();
    expect(select.getAttribute('class')).toContain('ng-valid');

    validateInputByModel('candidate.firstName','Roman');
    validateInputByModel('candidate.lastName','Konstantinov');

    // email test
    var input = element(by.model('candidate.emailAddress'));
    expectInvalid(input);
    input.sendKeys('boojaka');
    expectValid(input);
    input.clear();
    expectValid(input);
    expectInvalid(input);
    input.sendKeys('boojaka+t'+new Date().getTime().toString().substr(-9,6)+'@gmail.com');
    expectValid(input);


    validateInputByModel('candidate.contactNumber','+44777612345');
    validateInputByModel('candidate.niNumber','AB 12 34 56 C');


    var input = element(by.model('ngModel'));
    input.sendKeys('1987/03/26');

    nextBtn.click();
  });



  it('should navigate to step2 page ', function() {
    browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return (url.indexOf('step2') !== -1);
      });
    });
  });




  it('step2 form should have no errors', function() {
    nextBtn.click();

    var select = element.all(by.model('candidate.gender'));
    expectInvalid(select.get(0));
    selectSelector(select,1);
    expectValid(select.get(0));


    var select = element.all(by.model('candidate.nationality'));
    expectInvalid(select.get(0));
    selectSelector(select,0);
    expectValid(select.get(0));
    expect($('.addtionalinfo-container').isDisplayed()).toBeFalsy();

    validateInputByModel('candidate.address1','Super street');

    validateInputByModel('candidate.town','Super town');

    validateInputByModel('candidate.postCode','E20 2BB');


    //additinal info for non-resident
    selectSelector(select,1);
    expect($('.addtionalinfo-container').isDisplayed()).toBeTruthy();

    var date=$('.addtionalinfo-container [name="entrancedate"] [ng-model="ngModel"]');
    date.sendKeys('2000/01/29');
    expect(date.getAttribute('class')).toContain('ng-valid');

    var date=$('.addtionalinfo-container [name="recententrancedate"] [ng-model="ngModel"]');
    date.sendKeys('2000/01/01');
    expect(date.getAttribute('class')).toContain('ng-valid');

    var checkboxes=$$('.addtionalinfo-container [ng-model="candidate.payEmployFlag"] ');
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
    validateInputByModel('candidate.agencyName', 'Super Agency');
    validateDateByName('jobStartDate','02/01/2014');
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
    validateInputByModel('candidate.bankName', 'Super bank');
    validateInputByModel('candidate.accountName', 'Super account name');
    validateInputByModel('candidate.sortCode', '77-00');
    validateInputByModel('candidate.accountNumber', '12345678');

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

    browser.executeScript("document.getElementById('contact1').checked = false");
    browser.executeScript("document.getElementById('contact1').click();").then(function() {
      expectValid(element(by.model('$parent.confirm.ContactDetail1')));
    });

    browser.executeScript("document.getElementById('contact2').checked = false");
    browser.executeScript("document.getElementById('contact2').click();").then(function() {
      expectValid(element(by.model('$parent.confirm.ContactDetail2')));
    });

    browser.executeScript("document.getElementById('bank').checked = false");
    browser.executeScript("document.getElementById('bank').click();").then(function() {
      expectValid(element(by.model('$parent.confirm.BankDetail')));
    });

    browser.executeScript("document.getElementById('tax').checked = false");
    browser.executeScript("document.getElementById('tax').click();").then(function() {
      expectValid(element(by.model('$parent.confirm.TaxDetail')));
    });


    browser.executeScript("document.getElementById('accpetterms').checked = false");
    browser.executeScript("document.getElementById('accpetterms').click();").then(function() {
      expectValid(element(by.model('$parent.confirm.AcceptTerms')));
    });



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

