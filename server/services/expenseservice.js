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
           r.forEach(function(t){
                var bucketObject={};
                bucketObject.expenses=[];

                bucketObject.claimReference=t.claimReference;
                bucketObject.claimDate=t.createdDate;
                bucketObject.expenses=[];
                bucketObject.id=t._id;

                var secondValue=t.days;
                bucketObject.total=0;
                secondValue.forEach(function(l){

                      var daySpecific={};
                      daySpecific.startTime=l.startTime;
                      daySpecific.endTime=l.endTime;
                      daySpecific.date=l.date;
                      daySpecific.postcodes=l.postcodes;
                      daySpecific.dayId=l._id;
                          l.expenses.forEach(function(i){

                               var t={};
                               t.date= daySpecific.date;
                               t.startTime= daySpecific.startTime;
                               t.endTime=daySpecific.endTime;
                               t.postcodes=daySpecific.postcodes;
                               t.dayId= daySpecific.dayId;
                               t.expenseType=i.expenseType;
                               t.subType=i.subType;
                               t._id=i._id;
                               t.value=i.value;
                               t.status=i.status;
                               t.text=i.text;
                               t.description=i.description;
                               t.receiptUrls=i.receiptUrls;
                               bucketObject.total +=i.value;
                               bucketObject.expenses.push(t);

                               })


                });

                bucket.push(bucketObject);

					 });

           console.log(bucket.length);
           resolve(bucket);
				     });
		     });



    };
    service.updateEachExpense=function(resourceId,dayId,expenseId,status){

        return Q.promise(function(resolve,reject){

          db.Expense.findById(resourceId, function (e, data) {

              if(e){

                reject({result:false,message:"Something went wrong."})
              }else{
              data.days.id(dayId).expenses.id(expenseId).status = expenseId;

              data.save();
              resolve({result:true,message:"Success."})
            }
          });

        });

    };


	return service;
};
