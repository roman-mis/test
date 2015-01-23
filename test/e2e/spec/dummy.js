
describe('console test ', function() {
    browser.get('/candidates');
    var inputs=element.all(by.css('input'));
    
    inputs.count().then(function(i){
            console.log('count='+i);
    }).then(function(){
            console.log('second');
    });
	console.log('third');
});