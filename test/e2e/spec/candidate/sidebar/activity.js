describe('Checking Activity', function () {
  var openActivityDialog = function () {
      $('[ng-click="openAddActivityWin()"]').click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
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
