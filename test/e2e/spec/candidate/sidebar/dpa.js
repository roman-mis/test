describe('Checking DPA', function () {

  it('should open DPA dialog', function () {
      var link=element(by.css('[ng-click="openDPAWin()"]'));
      link.click();
      expect($('.modal-content').isDisplayed()).toBeTruthy();
      $('.modal-content [ng-click="cancel()"]').click();
      expect($('.modal-content').isPresent()).toBeFalsy();
      link.click();
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
