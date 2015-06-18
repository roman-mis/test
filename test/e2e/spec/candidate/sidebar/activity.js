var picturePath = require('path').normalize(__dirname + '../../../../sample.png');

describe('Checking Activity', function () {
  var openActivityDialog = function () {
    $('[ng-click="openAddActivityWin()"]').click();
    expect($('.modal-content').isDisplayed()).toBeTruthy();
  };

  it('should open Call-log dialog', function () {
    openActivityDialog();
    helper.selectSelector(element(by.model('data.agency')), 0);
    helper.selectSelector(element(by.model('data.activityType')), 0);
    $('.modal-content [ng-click="next()"]').click();
    expect($('.modal-title [ng-show="activityType==\'callLog\'"]').getText()).toContain('Call Log');
    expect($('.modal-title [ng-show="activityType==\'callLog\'"]').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    helper.alertAccept();
    browser.sleep(1000);
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('should open Task-Wizard dialog ', function () {
    openActivityDialog();
    helper.selectSelector(element(by.model('data.agency')), 0);
    helper.selectSelector(element(by.model('data.activityType')), 1);
    $('.modal-content [ng-click="next()"]').click();

    expect($('.modal-title [ng-show="activityType==\'task\'"]').getText()).toContain('Task Wizard');
    expect($('.modal-title [ng-show="activityType==\'task\'"]').isDisplayed()).toBeTruthy();

    $('.modal-content [ng-click="cancel()"]').click();
    helper.alertAccept();
    browser.sleep(1000);
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('should allow to create Task-', function () {
    openActivityDialog();
    helper.selectSelector(element(by.model('data.agency')), 0);
    helper.selectSelector(element(by.model('data.activityType')), 1);
    $('.modal-content [ng-click="next()"]').click();

    expect($('.modal-title [ng-show="activityType==\'task\'"]').getText()).toContain('Task Wizard');
    expect($('.modal-title [ng-show="activityType==\'task\'"]').isDisplayed()).toBeTruthy();

    helper.selectSelector(element(by.model('data.status')), 0);
    helper.selectSelector(element(by.model('data.priority')), 1);
    helper.selectSelector(element(by.model('data.taskType')), 1);

    element(by.model('data.templateTitle')).sendKeys('Task Title');
    element(by.model('data.templateHtml')).sendKeys('Task Description');

    element.all(by.model('data.followUpTaskDate')).all(by.css('input')).first().clear().sendKeys('01/01/2015');

    helper.selectSelector(element(by.model('data.assignee')), 1);

    $('.modal-content [ng-click="save()"]').click();
    helper.alertAccept();
    browser.sleep(1000);
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('should open Upload Documents dialog ', function () {
    openActivityDialog();
    helper.selectSelector(element(by.model('data.agency')), 0);
    helper.selectSelector(element(by.model('data.activityType')), 2);
    $('.modal-content [ng-click="next()"]').click();

    expect($('.modal-title').getText()).toContain('Upload Documents');
    expect($('.modal-title').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    helper.alertAccept();
    browser.sleep(2000);
    expect($('.modal-content').isPresent()).toBeFalsy();
  });

  it('should allow to upload Documents ', function () {
    openActivityDialog();
    helper.selectSelector(element(by.model('data.agency')), 0);
    helper.selectSelector(element(by.model('data.activityType')), 2);
    $('.modal-content [ng-click="next()"]').click();

    expect($('.modal-title').getText()).toContain('Upload Documents');
    expect($('.modal-title').isDisplayed()).toBeTruthy();

    helper.selectSelector(element(by.model('data.agency')), 0);

    helper.selectSelector(element(by.model('data.documentType')), 1);

    var expectedAgency = null;
    var expectedDocumentType = null;


    element(by.model('data.agency')).getText().then(function (v) {
      expectedAgency = v;
    });

    element(by.model('data.documentType')).getText().then(function (v) {
      expectedDocumentType = v;
    });

    element(by.model('data.documentName')).sendKeys('Test Document');

    browser.executeScript("$('.modal-content input[type=\"file\"]').css(\"display\",\"inline-block\")");
    element(by.model('data.file')).sendKeys(picturePath);
    browser.executeScript("$('.modal-content input[type=\"file\"]').css(\"display\",\"none\")");
    expect(element(by.css('[ng-click="uploadFile()"]')).isEnabled()).toBeTruthy();
    element(by.css('[ng-click="uploadFile()"]')).click();
    browser.wait(function () {
      return element(by.css('[ng-click="uploadFile()"]')).isEnabled().then(function (b) {
        return !b;
      });
    });

    element.all(by.repeater('file in files')).each(function (row) {
      row.all(by.css('td')).then(function (cols) {
        expect(cols[0].getText()).toBe('Test Document');
        expect(cols[1].getText()).toBe(expectedDocumentType);
        expect(cols[2].getText()).toBe(expectedAgency);
      });
    });


    $('.modal-content [ng-click="save()"]').click();
    helper.alertAccept();
    browser.sleep(1000);    
    expect($('.modal-content').isPresent()).toBeFalsy();
  });
  /*
   it('should open Document-wizard dialog ', function () {
   openActivityDialog();
   helper.selectSelector(element(by.model('data.agency')), 0);
   helper.selectSelector(element(by.model('data.activityType')), 2);
   $('.modal-content [ng-click="next()"]').click();

   expect($('.modal-title').getText()).toContain('Upload Documents');
   expect($('.modal-title').isDisplayed()).toBeTruthy();
   $('.modal-content [ng-click="cancel()"]').click();
   expect($('.modal-content').isPresent()).toBeFalsy();
   });
   */
});
