var helper = require('../../ui-helper.js');

describe('Checking Call Log', function () {

  it('should allow to create task', function () {

    var link=element(by.css('[ng-click="openCreateTaskWin({activityType: \'task\'})"]'));
    link.click();
    expect($('.modal-content').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
    link.click();

    helper.selectSelector(element.all(by.model('data.agency')), 0);
    helper.selectSelector(element.all(by.model('data.taskType')), 3);
    helper.selectSelector(element.all(by.model('data.priority')), 1);
    helper.selectSelector(element.all(by.model('data.status')), 0);
    // helper.selectSelector(element.all(by.model('data.template')),0);
    element(by.model('data.templateTitle')).clear().sendKeys('Super task title');
    element(by.model('data.templateHtml')).clear().sendKeys('Super task desc');
    helper.getDateByModel('data.followUpTaskDate').clear().sendKeys('01/01/2015');
    helper.selectSelector(element.all(by.model('data.assignee')), 1);
    element(by.css('[ng-click="save()"]')).click();
    expect($('.alert-success').isPresent()).toBeTruthy();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

});
