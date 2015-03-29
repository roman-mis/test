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

  service.getAllExpenses = function(request) {

        request.orderBy = [{
            'submittedDate': -1
        }];

        return Q.Promise(function(resolve, reject) {
            var q = db.System.find().select('statutoryTables expensesRate');
            return Q.nfcall(q.exec.bind(q)).then(function(system) {
                system.forEach(function(systemDoc) {

                    var expensesQuery = db.Expense.find().populate('user', 'title firstName lastName');


                    queryutils.applySearch(expensesQuery, db.Expense, request)
                        .then(function(expense) {
                            var bucket = [];

                            expense.rows.forEach(function(t) {
                                var bucketObject = {};
                                bucketObject.expenses = [];

                                bucketObject.claimReference = t.claimReference;
                                bucketObject.claimDate = t.createdDate;
                                bucketObject.expenses = [];
                                bucketObject.userName = t.user;
                                bucketObject.id = t._id;

                                var secondValue = t.days;

                                bucketObject.total = 0;
                                secondValue.forEach(function(l) {


                                    var daySpecific = {};
                                    daySpecific.startTime = l.startTime;
                                    daySpecific.endTime = l.endTime;
                                    daySpecific.date = l.date;
                                    daySpecific.postcodes = l.postcodes;
                                    daySpecific.dayId = l._id;
                                    l.expenses.forEach(function(i) {

                                        var t = {};
                                        t.date = daySpecific.date;
                                        t.startTime = daySpecific.startTime;
                                        t.endTime = daySpecific.endTime;
                                        t.postcodes = daySpecific.postcodes;
                                        t.dayId = daySpecific.dayId;
                                        t.expenseType = i.expenseType;
                                        t._id = i._id;
                                        t.amount = i.value;
                                        t.status = i.status;
                                        t.text = i.text;
                                        t.description = i.description;
                                        t.subType=i.subType;
                                        t.receiptUrls = i.receiptUrls;
                                        bucketObject.total += i.value;
                                        if (i.expenseType === 'Other' || i.expenseType === 'Subsistence') {

                                            var sys = systemDoc.expensesRate.id(i.subType);

                                            if (sys) {
                                                t.expenseDetail = {};
                                                t.expenseDetail.name = sys.name;
                                                t.expenseDetail.id = sys._id;

                                                if (sys.taxApplicable) {

                                                    systemDoc.statutoryTables.vat.forEach(function(time) {
                                                        var validFrom = new Date(time.validFrom);
                                                        var validTo = new Date(time.validTo);

                                                        var current = new Date();
                                                        if (current.valueOf() >= validFrom.valueOf() && current.valueOf() <= validTo.valueOf()) {

                                                            t.expenseDetail.total = i.value + (time.amount / 100 * i.value);
                                                            t.expenseDetail.vat = time.amount + '%';

                                                        }


                                                    });
                                                }


                                            }

                                        }else{

                                          t.expenseDetail = {};
                                          t.expenseDetail.name=i.subType;
                                          t.expenseDetail.total=i.value;
                                          t.expenseDetail.vat=0+'%';
                                        }

                                        bucketObject.expenses.push(t);

                                    });


                                });

                                bucket.push(bucketObject);

                            });

                            resolve(bucket);
                        });




                });

            }, reject);

        });



    };

    service.fetchExpenses=function(val){
        console.log('^^^^^^^^^^^^^^^^^^^^^^^1');
        console.log(val);

     var q=db.Expense.find().where('days.expenses._id').in(val);
        console.log('^^^^^^^^^^^^^^^^^^^^^^^1');

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
  /*  service.sendMail=function(contactDetails){

      return Q.promise(function(resolve,reject){


      var promises=[];
      for(var i=0;i<contactDetails.length;i++){

        var mailModel={title:contactDetails[i].title,firstName:contactDetails[i].firstName,lastName:contactDetails[i].lastName,reason:contactDetails[i].reason};
        var mailOption={to:contactDetails[i].to};
        promises.push(mailer.sendEmail(mailOption,mailModel,'status_change'));
        if(contactDetails.length-1===i){

          Q.allSettled(promises).then(function(d){

                console.log(d);
          })
        }

      }
    });
   //   console.log(contactDetails);

    }; */

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
                 resolve({result:true});

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

           var q = db.System.find().select('statutoryTables expensesRate');

          return Q.nfcall(q.exec.bind(q)).then(function(system){


        system.forEach(function(systemDoc){

          console.log(ids)

          service.fetchExpensesForEdit(ids).then(function(model){


              var bucket=[];
                       console.log('%%%%%%%%%%%%%%%%%%%%1');
                       console.log(model.length);

              for(var i=0;i<model.length;i++){

                model[i].days.forEach(function(l){
                   ids.forEach(function(doc){

                       var e=l.expenses.id(doc.id);
                       if(e){
                        for(var key in doc){
                          if(doc[key]){
                            e[key] = doc[key];
                          }
                          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
                          console.log(key)
                        }

                       }
                   });
                });
                  bucket.push(Q.nfcall(model[i].save.bind(model[i])));
              }
             // var bucket=[];
             // model.forEach(function(mo){

             //   bucket.push(Q.nfcall(mo.save.bind(mo)));

             // });
             return Q.all(bucket).then(function(){
                 resolve({result:true})

             },reject);


          },reject);
         });
         });

        });

    };

  return service;
};
