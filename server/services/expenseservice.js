'use strict';

module.exports = function(dbs){

	var db = dbs,
		Q=require('q'),
		queryutils=require('../utils/queryutils')(db),
		service={};
    var enums=require('../utils/enums');
    var async=require('async');

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
        var q=db.System.find().select('statutoryTables expensesRate');
        return Q.nfcall(q.exec.bind(q)).then(function(system){
           system.forEach(function(systemDoc){
             //  console.log(systemDoc);
                var expensesQuery=db.Expense.find().populate('user','title firstName lastName');


            queryutils.applySearch(expensesQuery, db.Expense, request)
            .then(function(expense){
            //  console.log(expense.rows.length);


               var bucket=[];

               expense.rows.forEach(function(t){
              //   console.log(t);
                    var bucketObject={};
                    bucketObject.expenses=[];

                    bucketObject.claimReference=t.claimReference;
                    bucketObject.claimDate=t.createdDate;
                    bucketObject.expenses=[];
                    bucketObject.userName=t.user;
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
                            //   t.subType=i.subType;
                               t._id=i._id;
                               t.amount=i.value;
                               t.status=i.status;
                               t.text=i.text;
                               t.description=i.description;
                               t.receiptUrls=i.receiptUrls;
                               bucketObject.total +=i.value;
                               if(i.expenseType === 'Other' || i.expenseType === 'Subsistence' ){

                                  var sys=systemDoc.expensesRate.id(i.subType);

                                  if(sys){
                                 //   console.log(sys);
                                  t.expenseDetail={};
                                  t.expenseDetail.name=sys.name;
                                  t.expenseDetail.id=sys._id;

                                  if(sys.taxApplicable){

                                    systemDoc.statutoryTables.vat.forEach(function(time){
                                         var validFrom=new Date(time.validFrom);
                                         var validTo=new Date(time.validTo);

                                         var current=new Date();
                                         if(current.valueOf() >= validFrom.valueOf() && current.valueOf() <= validTo.valueOf()){

                                            t.total=i.value+(time.amount/100*i.value);
                                            t.tax=time.amount+'%';

                                         }


                                    });
                                  }


                                  }

                               };
                         //      console.log('i am called');
                               bucketObject.expenses.push(t);

                               });


                });

                bucket.push(bucketObject);

           });

           resolve(bucket);
             });




           });

        },reject);
		/*	var q=db.Expense.find().populate('user','title firstName lastName');


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
                bucketObject.userName=t.user;
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
                               if(i.expenseType==='Other'|| i.expenseType==='Subsistence'){



                               }else{

                               //  bucketObject.expenses.push(t);
                               }
                               console.log('last test');
                            //   bucketObject.expenses.push(t);

                               });


                });

                bucket.push(bucketObject);

					 });

           resolve(bucket);
				     }); */
		     });



    };

    service.fetchExpenses=function(val){

     var q=db.Expense.find().where('days.expenses._id').in(val);
     return Q.nfcall(q.exec.bind(q));

    };
    service.fetchExpensesForEdit=function(val){
      var b=[];
      var q;
      val.forEach(function(l){

          b.push(l.id);
      });
      q=db.Expense.find().where('days.expenses._id').in(b);
      return Q.nfcall(q.exec.bind(q));
    };
    service.changeStatus=function(status,ids){

        return Q.promise(function(resolve,reject){

          service.fetchExpenses(ids).then(function(model){

             for(var i=0;i<model.length;i++){
                model[i].days.forEach(function(l){

                      ids.forEach(function(id){

                           var v=l.expenses.id(id);
                           if(v){
                              v.status=status;
                           }
                      });
                });

             }
             var bucket=[];
             model.forEach(function(mo){

               bucket.push(Q.nfcall(mo.save.bind(mo)));

             });

             return Q.all(bucket).then(function(){
                 resolve({result:true})

             },reject);


          });


        });
    };
    service.deleteExpense=function(ids){

        return Q.promise(function(resolve,reject){

            service.fetchExpenses(ids).then(function(model){


               for(var i=0;i<model.length;i++){

                 model[i].days.forEach(function(l){

                        ids.forEach(function(id){

                        var v=l.expenses.id(id);
                        if(v){

                          v.remove();

                          }

                        });
                 });

               }
             var bucket=[];
             model.forEach(function(mo){

               bucket.push(Q.nfcall(mo.save.bind(mo)));

             });

             return Q.all(bucket).then(function(){
                 resolve({result:true});

             },reject);

            },reject);

        });

    };

    service.editExpenses=function(ids){
        return Q.promise(function(resolve,reject){

          service.fetchExpensesForEdit(ids).then(function(model){


              var bucket=[];
              var modelId;
              for(var i=0;i<model.length;i++){

                model[i].days.forEach(function(l){
                   ids.forEach(function(doc){

                       var e=l.expenses.id(doc.id);

                       if(e){

                        e.expenseType=doc.expenseType;
                        e.subType=doc.subType;
                        e.value=doc.value;
                        e.receiptUrls=doc.receiptUrls;
                       }
                   });

                });

              }
             var bucket=[];
             model.forEach(function(mo){

               bucket.push(Q.nfcall(mo.save.bind(mo)));

             });

             return Q.all(bucket).then(function(){
                 resolve({result:true})

             },reject);


          },reject);

        });

    };


	return service;
};
