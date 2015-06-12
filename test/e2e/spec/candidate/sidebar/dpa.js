describe('Checking DPA', function () {

  it('should open DPA dialog', function () {
    var link = element(by.css('[ng-click="openDPAWin()"]'));
    link.click();
    browser.sleep(1000);
    expect($('.modal-content').isDisplayed()).toBeTruthy();
    $('.modal-content [ng-click="cancel()"]').click();
    helper.alertAccept();
    expect($('.modal-content').isPresent()).toBeFalsy();
    link.click();
    browser.sleep(1000);
  });

  it('DPA should generate unique questions', function () {
    // for questions
    var ensureUniqueTexts = function (inputPromise) {
      var arr = [];
      inputPromise.each(function (el) {
        el.getText().then(function (val) {
          expect(arr.indexOf(val)).toBe(-1);
          arr.push(val);
        });
      });
    };
    // for answers
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
        callback();
        //expect(input.getAttribute('value')).not.toEqual(val); // ???
      });
    };

    var questions = element.all(by.css('.modal-body .dpa-item .form-group div b.ng-binding'));
    var answers = element.all(by.model('dpa.answer'));

    $('[ng-click="reGenerateAllSets()"]').click();
    ensureUniqueTexts(questions);
    ensureUnique(answers);

    element.all(by.css('[ng-click="reGenerateSet($index)"]')).each(function (btn, i) {
      ensureChange(questions.get(i), function () {
        btn.click();
        ensureUniqueTexts(questions);
        ensureUnique(answers);
      });
    });
    element.all(by.css('[ng-click="correctSet($index)"]')).each(function (btn) {
      btn.click();
      browser.sleep(200);
      // check if it is set as corrected (should have .btn-primary) //
      btn.getAttribute('class').then(function (classAttr) {
        var classes = classAttr.split(/\s+/g);
        expect(classes.indexOf('btn-primary')).not.toBe(-1);
      });
    }).then(function () {
      $('[ng-click="save()"]').click();
      helper.alertAccept();
      browser.sleep(2000);
      expect($('.modal-content').isPresent()).toBeFalsy();
    });

  });

});
