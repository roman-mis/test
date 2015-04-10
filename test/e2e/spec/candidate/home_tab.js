var helper = require('../ui-helper.js');
var links = $$('.candidate-tabs li a');

describe('Candidate Home tab', function () {
  it('Checking dialog data input',function(){
    links.get(0).click();
    $('[ng-click="editDetails()"]').click();
    expect($('.modal-content').isDisplayed()).toBeTruthy();

    helper.selectSelector(element(by.model('candidate.title')),0);
    element(by.model('candidate.firstName')).clear().sendKeys('FirstName');
    element(by.model('candidate.middleName')).clear().sendKeys('MiddleName');
    element(by.model('candidate.lastName')).clear().sendKeys('LastName');
    helper.selectSelector(element(by.model('candidate.gender')),0);
 //   element(by.css('[ng-model="candidate.birthDate"] [ng-model="ngModel"]')).clear().sendKeys('26/03/1987');
    helper.selectSelector(element(by.model('candidate.nationality')),0);

    $('[ng-click="saveCandidate()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('Checking if data saved to Db',function(){
    browser.getCurrentUrl().then(function (url) {
      browser.get(url);
    });

    var labels = element.all(by.css('span.meta'));
    expect(labels.get(0).getText()).toBe('Mr');
    expect(labels.get(1).getText()).toBe('FirstName');
    expect(labels.get(2).getText()).toBe('MiddleName');
    expect(labels.get(3).getText()).toBe('LastName');
    expect(labels.get(4).getText()).toBe('M');
    expect(labels.get(6).getText()).toBe('1');

  });
});
