'use strict';

module.exports = function(dbs){

	var db = dbs,
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		service={};
		var mongoose=require('mongoose');

	service.getExpenses=function(request){
		return Q.Promise(function(resolve,reject){
			var q=db.Expense.find().populate('agency').populate('user').populate('createdBy');

			queryutils.applySearch(q, db.Expense, request)
				.then(resolve,reject);
		});
	};

	service.getExpense=function(id, populate){
		populate = typeof populate !== 'undefined' ? populate : false;
		var q=db.Expense.findById(id);

		if(populate){
			q.populate('agency');
			q.populate('user');
			q.populate('createdBy');
		}

		return Q.nfcall(q.exec.bind(q));
	};

	service.saveExpenses = function(expenseDetails){
		console.log(expenseDetails);
		console.log('here wer are');
		var deff = Q.defer();
		var expenseModel;
		expenseModel = new db.Expense(expenseDetails);
		expenseModel.save(function(err){
			if(err){
				deff.reject(err);
			}else{
				console.log('save success');
				deff.resolve(expenseModel);
			}
		});
		return deff.promise;
	};
    service.getAllExpenses=function(request){


      request.orderBy=[{"submittedDate":-1}];
    	

    	return Q.Promise(function(resolve,reject){
			var q=db.Expense.find();

			queryutils.applySearch(q, db.Expense, request)
				.then(function(expense){

 
           var r=expense.rows; 
					 var bucket=[];
					 for(var first=0;first< r.length;first++){

                var bucketObject={};
                bucketObject.expenses=[];
                    
                bucketObject.claimReference=r[first].claimReference;
                bucketObject.claimDate=r[first].createdDate;
                bucketObject.expenses=[];
                bucketObject.id=r[first]._id;
                var secondValue=r[first].days;
                

                for(var second=0;second<secondValue.length;second++){
                      bucketObject.total=0;
                
                              secondValue[second].expenses.forEach(function(i){

                               var t={};
                               t.date=secondValue[second].date;
                               t.startTime=secondValue[second].startTime;
                               t.endTime=secondValue[second].endTime;
                               t.postcodes=secondValue[second].postcodes;
                               t.expenseType=i.expenseType;
                               t.subType=i.subType;
                               t._id=i._id;
                               t.value=i.value;
                               t.text=i.text;
                               t.description=i.description;
                               t.receiptUrls=i.receiptUrls;
                               bucketObject.total +=i.value;
                               bucketObject.expenses.push(t);

                               })


                } 
                bucket.push(bucketObject);

					 }
             
             
           resolve(bucket);
				     });
		     });
    		

    	
    }


	return service;
};