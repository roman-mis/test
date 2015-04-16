var helper = require('../../ui-helper.js');

describe('Checking ONBOARDING', function () {

  it('should open onboarding dialog', function () {

      var link=element(by.css('[ng-click="openOnboardingWin()"]'));
      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      $('.modal-content [ng-click="cancel()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();
      link.click();

  });
  it('should save data', function () {
    helper.selectSelector(element.all(by.model('data.agency')), 1);
    element(by.model('data.agencyName')).clear().sendKeys('Agency name from test');

    //helper.selectSelector(element.all(by.model('data.consultant')),1);
    element(by.model('data.payeRate')).clear().sendKeys('10');
    element(by.model('data.outsourcedRate')).clear().sendKeys('9');

    helper.selectSelector(element.all(by.model('data.serviceUsed')), 1);
    element.all(by.model('checked')).get(0).getAttribute('checked').then(function (str) {
      if (!str) {
        element.all(by.model('checked')).get(0).click();
      }
    });

    $('.modal-content [ng-click="save(true)"]').click();
    expect($('.alert-success').isPresent()).toBeTruthy();
    expect($('.modal-content').isPresent()).toBeFalsy();

  });

});
