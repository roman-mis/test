'use strict';

module.exports = function(dbs){

	var db = dbs,
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		service={};

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
		console.log(expenseDetails);console.log(expenseDetails.days);
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
      request.orderBy=[{'submittedDate':-1}];

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

                               });


                });

                bucket.push(bucketObject);

					 });

           resolve(bucket);
				     });
		     });



    };
    service.updateEachExpense=function(status,ids){

        return Q.promise(function(resolve,reject){

            var q=db.Expense.find();

            return Q.nfcall(q.exec.bind(q)).then(function(doc){


                ids.forEach(function(e){

                  doc.forEach(function(d){

                    d.days.forEach(function(l){

                      l.expenses.forEach(function(ex){
                        console.log(typeof e);
                        if(String(ex._id)===e){
                          console.log('test');

                          ex.status=status;
                          d.save();

                          if(ids[ids.length-1]===e){

                            resolve({result:true});
                          }

                        }
                      });
                    });
                  });
                });

            },reject);

        });
    };
    service.deleteExpense=function(ids){

        return Q.promise(function(resolve,reject){
           var q=db.Expense.find();
           return Q.nfcall(q.exec.bind(q)).then(function(d){
              ids.forEach(function(r){

                  d.forEach(function(day){

                       day.days.forEach(function(ex){

                          var expenseToRemove=ex.expenses.id(r);
                          if(expenseToRemove){
                             expenseToRemove.remove();
                             day.save();
                              if(ids[ids.length-1]===r){

                                resolve({result:true,message:'Successfully deleted.'});
                              }
                           }
                       });
                  });

              });
           },reject);

        });

    };
    service.updateSelectedExpenses=function(values){

        return Q.promise(function(resolve,reject){
             var q=db.Expense.find();
             return Q.nfcall(q.exec.bind(q)).then(function(d){

                 values.forEach(function(v){

                      d.forEach(function(day){

                           day.days.forEach(function(ex){

                            ex.expenses.forEach(function(e){

                              if(String(e._id)===v.id){
                                e.expenseType=v.expenseType;
                                e.subType=v.subType;
                                e.value=v.value;
                                e.receiptUrls=v.receiptUrls;
                                day.save();
                                if(values[values.length-1].id===v.id){

                                  resolve({result:true,message:'Successfully updated.'});
                                }
                              }

                            });

                           });

                      });

                 });
             });

        });

    };


	return service;
};
