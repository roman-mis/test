var fs = require('fs');
var path = require('path');
var helper={
  getByText: function(selector, text){
	  return selector.filter(function(e, i){
		  return e.getText().then(function(el_text){
			  return el_text.indexOf(text) != -1;
		  });
	  }).get(0);
  },
  selectSelector:function(select,item){
    select.all(by.css('[ng-click="$select.toggle($event)"]')).get(0).click();
    select.all(by.css('[ng-click="$select.select(item,false,$event)"]')).get(item).click();
  },
  selectSimpleSelect:function ( element, optionNum ) {
      element.all(by.css('option')).get(optionNum).click();
  },
  selectSimpleDynamicSelect:function ( element, optionNum, textGetter ) {
	expect(typeof(optionNum)).toBe('number');
	element.click();
	// for checks //
	typeof(textGetter) == 'function' && element.element(by.css('option[value="'+optionNum+'"]')).getText().then(textGetter);
	////////////////
	element.element(by.css('option[value="'+optionNum+'"]')).click();
	element.element(by.xpath('..')).click();
  },
  setDatepickerDate: function(element, value){
	  element.click();
	  var m = value.match(/^(\d+)\/(\d+)\/(\d+)$/);
	  //browser.executeScript("$(document.activeElement).val('')");
	  //browser.sleep(1000);
	  //browser.executeScript("$(document.activeElement).val("+JSON.stringify(value)+")");
	  element.element(by.css('input')).clear().sendKeys(m && [m[2].replace(/^0/,''),m[1].replace(/^0/,''),m[3]]||'');
  },
  pickRandomOptionOnSelectSimple:function(element, textGetter){
	element.click();
	var selector = element.all(by.css('option[value]'));
	selector.count().then(function(n){
		expect(n).toBeGreaterThan(0);
		var opt = selector.get(Math.round(Math.random()*(n-1))|0);
		typeof(textGetter) == 'function' && opt.getText().then(textGetter);
		var value;
		opt.getAttribute('value').then(function(v){
			value = v;
		});
		opt.click();
		browser.wait(function(){
			expect(element.getAttribute('value')).toBe(value);
			element.element(by.xpath('..')).click();
			return true;
		});
	});	
  },
  getDefaultNumber:function(){
    return String(parseInt(new Date().getTime().toString().substr(-9,6)));
  },
  getDateByModel:function(model){
    return $('[ng-model="'+model+'"] [ng-model="ngModel"]');
  },
  printStage: function(){
	  var args = Array.prototype.map.call(arguments, function(x){ return x; });
	  browser.wait(function(){
		  console.log('\033[33m    * '+args.join(' ')+'\033[39m'); // print text with yellow color
		  return true;
	  })
  },
  alertAccept: function(){
	  //browser.driver.switchTo().alert().accept();
	  browser.sleep(1000);
	  element(by.css('button.confirm')).click();
  },
  execScript: function(x){
	if(typeof(x) == 'function')
		x();
	else 
	if(typeof(x) == 'string'){
		x = path.normalize(x);
		delete require.cache[x]; // remove from cache if has it
		require(x);	
	}
	else throw new Error('Invalid argument: ' + x);
  }
};


module.exports = helper;
