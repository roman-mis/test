var helper = require('./ui-helper.js');

var clickFirstVisible = function (locator, callback) {
  element.all(locator).filter(function (elem, index) {
    return elem.isDisplayed().then(function (bool) {
      return bool;
    });
  }).then(function (displayedElem) {
    callback(displayedElem[0]);
  });
};
var testModal = function (locator) {
  clickFirstVisible(locator, function (link) {
    link.click();
    expect($('.modal-content').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
    link.click();
  })
};

/*
describe('Checking Timesheet dialog', function () {

  it('should open-cancel Timesheet dialog', function () {
    clickFirstVisible(by.css('[ng-click="openAddTimesheetWin()"]'), function (link) {
      link.click();
      expect($('.modal-content .add-tsh').isDisplayed()).toBeTruthy();
      $('.modal-content [ng-click="cancel()"]').click();
      browser.driver.switchTo().alert().accept();
      expect($('.modal-content .add-tsh').isPresent()).toBeFalsy();
      link.click();
    })
  });

  it('adding timesheet items into the table', function () {

    //select datepicker
    $('.modal-content #datepicker [ng-click="clicked = true"]').click();
    $('.modal-content #datepicker [ng-click="okay();clicked =false"]').click();

    helper.selectSimpleSelect(element(by.model('saveAgency')),0);
    helper.selectSimpleSelect(element(by.model('saveRate')),1);
    element(by.model('elements.unit')).clear().sendKeys('10');
    element(by.model('elements.payRate')).clear().sendKeys('5');
    element(by.model('userDescription')).clear().sendKeys('desc');
    $('[ng-click="populateTable()"]').click();

    var  rows= element.all(by.repeater('element in finalElements'));
    expect(rows.count()).toBeGreaterThan(0);


    rows.first().then(function (row) {
      var rowElems = row.all(by.tagName('td'));
      rowElems.then(function (cols) {
        expect(cols[0].getText()).toContain(element(by.model('saveRate')).all(by.tagName('option')).get(1).getText());
        expect(cols[1].getText()).toContain('desc');
        expect(cols[2].getText()).toContain('10');
        expect(cols[3].getText()).toContain('5');
        expect(cols[5].getText()).toContain('50');
      });
    });

    $('[ng-click="ok()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();

  });

});*/



describe('Checking ACTION REQUEST', function () {

  it('should open Call-log dialog', function () {
    clickFirstVisible(by.css('[ng-click="openCreateDocumentWin({})"]'), function (link) {
      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
    });
  });

  it('should upload file and save', function () {
    helper.selectSelector(element(by.model('data.agency')), 1);
    helper.selectSelector(element(by.model('data.documentType')), 1);
    helper.selectSelector(element(by.model('data.documentType')), 1);
    element(by.model('data.documentName')).clear().sendKeys('asd');

    var path = require('path');
    var fileToUpload = '../sample.png';
    var absolutePath = path.resolve(__dirname, fileToUpload);
    $('[ng-model="data.file"]').sendKeys(absolutePath);
    $('[ng-click="uploadFile()"]').click();


    element.all(by.repeater('file in files')).count().then(function (n) {
      expect(n).toBeGreaterThan(0);
      $('[ng-click="save()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();
    });

  });

});









