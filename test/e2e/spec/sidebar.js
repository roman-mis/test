var helper = require('./ui-helper.js');



var clickFirstVisible=function(locator,callback){
  element.all(locator).filter(function(elem, index) {
    return elem.isDisplayed().then(function(bool) {
      return bool;
    });
  }).then(function(displayedElem) {
      callback(displayedElem[0]);
  });
};
var testModal=function(locator){
  clickFirstVisible(locator,function(link){
    link.click();
    expect($('.modal-content').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    expect($('.modal-content').isPresent()).toBeFalsy();
    link.click();
  })
};
/*

describe('Checking DPA', function() {

  it('should open DPA dialog', function () {

    element.all(by.css('[ng-click="openDPAWin()"]')).filter(function(elem, index) {
        return elem.isDisplayed().then(function(bool) {
          return bool;
        });
    }).then(function(displayedElem) {
        displayedElem[0].click();
        expect($('.modal-content').isDisplayed()).toBeTruthy();
        $('.modal-content [ng-click="cancel()"]').click();
        expect($('.modal-content').isPresent()).toBeFalsy();
        displayedElem[0].click();
    });

  });

  it('DPA should generate unique questions', function () {
    var elements= element.all(by.repeater('dpa in generatedSets'));
    var questions=[];
    var answers=[];
    var genBtn=[];
    var corrBtn=[];
    var ensureUnique=function(inputs){
      var arr=[];
      for(var i=0;i<inputs.length;i++){
        inputs[i].getAttribute('value').then(function(val){
          expect(arr.indexOf(val)).toBe(-1);
          arr.push(val);
        });
      }
    };

    var ensureChange=function(input,btn){
      input.getAttribute('value').then(function(val){
        btn.click();
        expect(input.getAttribute('value')).toNotEqual(val);
      });
    };


    elements.then(function(rows){

      for(var i=0;i<rows.length;i++){
        questions.push(rows[i].element(by.model('dpa.question')));
        answers.push(rows[i].element(by.model('dpa.answer')));
        genBtn.push(rows[i].element(by.css('[ng-click="reGenerateSet($index)"]')));
        corrBtn.push(rows[i].element(by.css('[ng-click="correctSet($index)"]')));
      };

      $('[ng-click="reGenerateAllSets()"]').click();
      ensureUnique(questions);
      ensureUnique(answers);

      for(var i=0;i<rows.length;i++){
        genBtn[i].click();
        ensureUnique(questions);
        ensureUnique(answers);
        ensureChange(questions[i],genBtn[i]);
        ensureChange(answers[i],genBtn[i]);
        corrBtn[i].click();
      };

      $('[ng-click="save()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();

    });

  });

});




describe('Checking ONBOARDING', function() {

  it('should open onboarding dialog', function () {

    clickFirstVisible(by.css('[ng-click="openOnboardingWin()"]'),function(link){
      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      $('.modal-content [ng-click="cancel()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();
      link.click();
    })
  });
  it('should save data', function () {
     helper.selectSelector(element.all(by.model('data.agency')),1);
    element(by.model('data.agency_name')).sendKeys('Agency name from test');

    helper.selectSelector(element.all(by.model('data.consultant')),1);
    element(by.model('data.paye_rate')).sendKeys('10');
    element(by.model('data.outsourced_rate')).sendKeys('11');

    helper.selectSelector(element.all(by.model('data.service_used')),1);

    element(by.css('[ng-click="save(true)"]')).click();
  });

});

 */

describe('Checking Call Log', function() {

/*  it('should open call log dialog', function () {
    browser.get('/candidates/548af0d1f1ffa56c251ff15f');
    testModal(by.css('[ng-click="openCreateTaskWin({activityType: \'callLog\'})"]'));
  });*/

  it('should allow to create task', function () {
    browser.get('/candidates/548af0d1f1ffa56c251ff15f');
    testModal(by.css('[ng-click="openCreateTaskWin({activityType: \'callLog\'})"]'));
    helper.selectSelector(element.all(by.model('data.agency')),0);
    helper.selectSelector(element.all(by.model('data.taskType')),3);
    helper.selectSelector(element.all(by.model('data.priority')),1);
    helper.selectSelector(element.all(by.model('data.status')),0);
    helper.selectSelector(element.all(by.model('data.template')),0);
    element(by.model('data.templateTitle')).clear().sendKeys('Super task title');
    element(by.model('data.templateHtml')).clear().sendKeys('Super task desc');
    helper.getDateByModel('data.followUpTaskDate').clear().sendKeys('01/01/2015');
    helper.selectSelector(element.all(by.model('data.assignee')),1);
    element(by.css('[ng-click="save()"]')).click();
    expect($('.modal-content').isPresent()).toBeFalsy();
  });


});
