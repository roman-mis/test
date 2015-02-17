var helper={

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
  }
};


module.exports = helper;
