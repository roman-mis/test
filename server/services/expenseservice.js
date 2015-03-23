'use strict';

module.exports = function(dbs){

	var db = dbs,
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		service={};
    var enums=require('../utils/enums');

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
  service.updateForExpenses=function(val){

    return Q.promise(function(resolve,reject){

       var bucket=[];
       var q;
       val.forEach(function(v){

         bucket.push(v.id);

       });
       q=db.Expense.find().where('days.expenses._id').in(bucket);
       Q.nfcall(q.exec.bind(q)).then(function(d){
           d.forEach(function(doc){

              resolve(doc);
           });


       },reject);

      });

  };
  service.deleteOrUpdate=function(val){


    return Q.promise(function(resolve,reject){

       var q=db.Expense.find().where('days.expenses._id').in(val);
       Q.nfcall(q.exec.bind(q)).then(function(d){
           d.forEach(function(doc){

              resolve(doc);
           });


       },reject);

    });
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
    service.saveExpensesValues=function(model){
       return Q.promise(function(resolve,reject){

           return Q.nfcall(model.save.bind(model)).then(function(){

                       resolve();

          },reject);


       });



    };
    service.updateEachExpense=function(status,ids){

        return Q.promise(function(resolve,reject){

          service.deleteOrUpdate(ids).then(function(model){

            ids.forEach(function(e){

               model.days.forEach(function(ex){

                  var l=ex.expenses.id(e);
                  if(l){

                    if(status==='Approve'){

                      l.status=enums.expenseStatus.Approve;
                    }else{

                     l.status=enums.expenseStatus.Reject;
                    }
                  }

               });

            });
          service.saveExpensesValues(model).then(function(){

           resolve({result:true});

          },reject);

          });


        });
    };
    service.deleteExpense=function(ids){

        return Q.promise(function(resolve,reject){

          service.deleteOrUpdate(ids).then(function(model){

             ids.forEach(function(r){

               model.days.forEach(function(ex){

                 var expenseToRemove=ex.expenses.id(r);

                 if(expenseToRemove){

                   expenseToRemove.remove();

                 }

               });

             });
          service.saveExpensesValues(model).then(function(){

           resolve({result:true});

          },reject);

          },reject);

        });

    };

    service.updateSelectedExpenses=function(values){
        return Q.promise(function(resolve,reject){
          service.updateForExpenses(values).then(function(model){

                values.forEach(function(l){

                    model.days.forEach(function(ex){


                    var e=ex.expenses.id(l.id);
                    if(e){
                       e.expenseType=l.expenseType;
                       e.subType=l.subType;
                       e.value=l.value;
                       e.receiptUrls=l.receiptUrls;
                    }
                  });
                });
                service.saveExpensesValues(model).then(function(){

                   resolve({result:true});

                  },reject);

          },reject);

        });

    };


	return service;
};
