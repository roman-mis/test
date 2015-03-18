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
    service.getExpenseByUserId=function(id){



    	return Q.promise(function(resolve,reject){

    		var q=db.Expense.find({"user":id});
    		
    	    Q.nfcall(q.exec.bind(q)).then(function(r){

                var bucket=[];
    	    	
    	    	for(var first=0;first < r.length;first++){

    	    		var bucketObject={};
    	    		bucketObject.expenses=[];

    	    		bucketObject.claimReference=r[first].claimReference;
    	    		bucketObject.claimDate=r[first].createdDate;
    	    		bucketObject.id=r[first]._id;
    	    	    var secondValue=r[first].days[0];
    	    	    var total=0;
    	    		for(var second=0;second < secondValue.expenses.length;second++){
                       var t={};
                       t.date=secondValue.date;
                       t.startTime=secondValue.startTime;
                       t.endTime=secondValue.endTime;
                       t.postcodes=secondValue.postcodes;
                       t.expenseType=secondValue.expenses[second].expenseType;
                       t.subType=secondValue.expenses[second].subType;
                       t.value=secondValue.expenses[second].value;
                       t.text=secondValue.expenses[second].text;
                       t.description=secondValue.expenses[second].description;
                       t.receiptUrls=secondValue.expenses[second].receiptUrls;
                       total +=secondValue.expenses[second].value;
                       bucketObject.expenses.push(t);



    	    		}
    	    		bucketObject.total=total;
    	    		bucket.push(bucketObject);
    	    		
    	    	}
    	    	resolve(bucket);

    	    },reject);
    	})
    }

	return service;
};