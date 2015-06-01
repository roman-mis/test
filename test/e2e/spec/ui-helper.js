var fs = require('fs');
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
  }
};


module.exports = helper;
