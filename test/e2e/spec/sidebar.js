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

});

describe('Checking ONBOARDING', function () {

  it('should open onboarding dialog', function () {

    clickFirstVisible(by.css('[ng-click="openOnboardingWin()"]'), function (link) {
      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      $('.modal-content [ng-click="cancel()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();
      link.click();
    })
  });
  it('should save data', function () {
    helper.selectSelector(element.all(by.model('data.agency')), 1);
    element(by.model('data.agencyName')).clear().sendKeys('Agency name from test');

    //helper.selectSelector(element.all(by.model('data.consultant')),1);
    element(by.model('data.payeRate')).clear().sendKeys('10');
    element(by.model('data.outsourcedRate')).clear().sendKeys('9');

    helper.selectSelector(element.all(by.model('data.serviceUsed')), 1);
    element.all(by.model('checked')).get(0).getAttribute('checked').then(function (str) {
      console.log(str);
      if (!str) {
        element.all(by.model('checked')).get(0).click();
      }
    });

    $('.modal-content [ng-click="save(true)"]').click();


    expect($('.modal-content').isPresent()).toBeFalsy();

  });

});

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

describe('Checking Activity', function () {
  var openActivityDialog = function () {
    clickFirstVisible(by.css('[ng-click="openAddActivityWin()"]'), function (link) {
      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
    });
  };

  it('should open Call-log dialog', function () {
    openActivityDialog();
    helper.selectSelector(element(by.model('data.agency')), 1);
    helper.selectSelector(element(by.model('data.activityType')), 0);
    $('.modal-content [ng-click="next()"]').click();

    expect($('.modal-title [ng-show="activityType==\'callLog\'"]').getText()).toContain('call log');
    expect($('.modal-title [ng-show="activityType==\'callLog\'"]').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('should open Task-Wizard dialog ', function () {
    openActivityDialog();
    helper.selectSelector(element(by.model('data.agency')), 1);
    helper.selectSelector(element(by.model('data.activityType')), 1);
    $('.modal-content [ng-click="next()"]').click();

    expect($('.modal-title [ng-show="activityType==\'task\'"]').getText()).toContain('task wizard');
    expect($('.modal-title [ng-show="activityType==\'task\'"]').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('should open Document-wizard dialog ', function () {
    openActivityDialog();
    helper.selectSelector(element(by.model('data.agency')), 1);
    helper.selectSelector(element(by.model('data.activityType')), 2);
    $('.modal-content [ng-click="next()"]').click();

    expect($('.modal-title').getText()).toContain('Upload Documents');
    expect($('.modal-title').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

});

describe('Checking DPA', function () {

  it('should open DPA dialog', function () {
    clickFirstVisible(by.css('[ng-click="openDPAWin()"]'), function (link) {
      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      $('.modal-content [ng-click="cancel()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();
      link.click();
    });

  });

  it('DPA should generate unique questions', function () {

    var ensureUnique = function (inputPromise) {
      var arr = [];
      inputPromise.each(function (el) {
        el.getAttribute('value').then(function (val) {
          expect(arr.indexOf(val)).toBe(-1);
          arr.push(val);
        });
      });
    };

    var ensureChange = function (input, callback) {
      input.getAttribute('value').then(function (val) {
        console.log('value=' + val);
        callback();
        expect(input.getAttribute('value')).not.toEqual(val);
      });
    };

    var questions = element.all(by.model('dpa.question'));
    var answers = element.all(by.model('dpa.answer'));

    $('[ng-click="reGenerateAllSets()"]').click();
    ensureUnique(questions);
    ensureUnique(answers);

    element.all(by.css('[ng-click="reGenerateSet($index)"]')).each(function (btn, i) {
      ensureChange(questions.get(i), function () {
        btn.click();
        ensureUnique(questions);
        ensureUnique(answers);
      });
    });

    element.all(by.css('[ng-click="correctSet($index)"]')).each(function (btn) {
      btn.click();
    }).then(function () {
      $('[ng-click="save()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();
    });

  });

});

describe('Checking Call Log', function () {

  it('should allow to create task', function () {

    testModal(by.css('[ng-click="openCreateTaskWin({activityType: \'callLog\'})"]'));

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
    expect($('.modal-content').isPresent()).toBeFalsy();
  });


});

describe('checking expense wizard', function () {

  it('selecting wizard option', function () {

    clickFirstVisible(by.css('[ng-click="openAddExpensesWin()"]'), function (link) {
      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
    });

  });

  var okBtn = element(by.css('[ng-click="ok()"]'))

  it('selecting agency and default date', function () {
    element(by.css('[ng-click="gotoNext()"]')).click();

    helper.selectSelector(element(by.model('expenseData.agency')), 0);
    element(by.css('[ng-click="gotoNext()"]')).click();
    okBtn.click();
  });

  var days = element(by.model('addData.date'));

  it('adding dates', function () {
    var startH = element(by.model('addData.startHours'));
    var startM = element.all(by.model('addData.startMins'));
    var endH = element.all(by.model('addData.endHours'));
    var endM = element.all(by.model('addData.endMins'));
    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(startH, 10);
    helper.selectSimpleSelect(startM, 2);
    helper.selectSimpleSelect(endH, 17);
    helper.selectSimpleSelect(endM, 3);
    element(by.css('[ng-click="add()"]')).click();


    var rows = element.all(by.repeater('item in expenseData.times'));
    rows.first().then(function (row) {
      var rowElems = row.all(by.tagName('td'));
      rowElems.then(function (cols) {

        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
        cols[1].getText().then(function (str) {
          expect(str.split(':')[0] + ' ').toContain(startH.all(by.tagName('option')).get(10).getText());
          expect(str.split(':')[1] + ' ').toContain(startM.all(by.tagName('option')).get(2).getText());
        });
        cols[2].getText().then(function (str) {
          expect(str.split(':')[0] + ' ').toContain(endH.all(by.tagName('option')).get(17).getText());
          expect(str.split(':')[1] + ' ').toContain(endM.all(by.tagName('option')).get(3).getText());
        });
        okBtn.click();
      });
    });

  });

  it('adding location', function () {

    element(by.model('addData.code')).sendKeys('E20 2BB');
    helper.selectSimpleSelect(days, 2);
    element(by.css('[ng-click="add()"]')).click();

    var rows = element.all(by.repeater('item in expenseData.postCodes'));
    rows.first().then(function (row) {
      var rowElems = row.all(by.tagName('td'));
      rowElems.then(function (cols) {
        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
        expect(cols[1].getText()).toContain('E20 2BB');
        okBtn.click();
      });
    });
  });

  it('transport dialog', function () {

    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(element(by.model('addData.type')), 1);
    element.all(by.model('addData.mileage')).get(0).sendKeys('100');
    element(by.css('[ng-click="add()"]')).click();

    var rows = element.all(by.repeater('item in expenseData.transports'));
    rows.first().then(function (row) {
      var rowElems = row.all(by.tagName('td'));
      rowElems.then(function (cols) {
        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
        expect(cols[1].getText()).toContain(element(by.model('addData.type')).all(by.tagName('option')).get(1).getText());
        okBtn.click();
      });
    });

  });

  it('vehicle info dialog', function () { //arbitrariry field
    element(by.model('vehicle.fuelType')).isPresent().then(function (bool) {
      if (bool) {
        helper.selectSimpleSelect(element(by.model('vehicle.fuelType')), 1);
        element(by.model('vehicle.make')).sendKeys('Merzedes ml550');
        element(by.model('vehicle.registration')).sendKeys('12345678');
        helper.selectSimpleSelect(element(by.model('vehicle.engineSize')), 1);
        element(by.css('[ng-click="saveVehicleForm()"]')).click();
      } else {
        console.log('---vehicle info dialog has not be invoked');
      }
    });

  });

  it('Subsistence dialog', function () {

    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(element(by.model('addData.type')), 1);
    element(by.css('[ng-click="add()"]')).click();

    var rows = element.all(by.repeater('item in expenseData.subsistences'));
    rows.first().then(function (row) {
      var rowElems = row.all(by.tagName('td'));
      rowElems.then(function (cols) {
        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
        expect(cols[1].getText()).toContain(element(by.model('addData.type')).all(by.tagName('option')).get(1).getText());
        okBtn.click();
      });
    });

  });

  it('Document other expenses', function () {

    helper.selectSimpleSelect(days, 2);
    helper.selectSimpleSelect(element(by.model('addData.type')), 1);
    element(by.model('addData.cost')).sendKeys('100');
    element(by.css('[ng-click="add()"]')).click();

    var rows = element.all(by.repeater('item in expenseData.others'));
    rows.first().then(function (row) {
      var rowElems = row.all(by.tagName('td'));
      rowElems.then(function (cols) {
        expect(cols[0].getText()).toContain(days.all(by.tagName('option')).get(2).getText());
        expect(cols[1].getText()).toContain(element(by.model('addData.type')).all(by.tagName('option')).get(1).getText());
        expect(cols[3].getText()).toContain('100');
        okBtn.click();
      });
    });

  });

  it('Receipts dialog', function () {
    okBtn.click();
  });

  it('Review & Confirm dialog', function () {
    element.all(by.repeater('item in summaries')).count().then(function (count) {
      expect(count).toBeGreaterThan(0);
      element(by.model('isAgreedOnTerms')).click();
      okBtn.click();
    });
  });

  it('thank you screen', function () {
    expect(element(by.model('expenseData.claimReference')).getAttribute('value')).toBeTruthy();
    element(by.css('[ng-click="cancel()"]')).click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

});






