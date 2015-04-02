'use strict';

module.exports = function(dbs){

  var db = dbs,
    Q=require('q'),
    queryutils=require('../utils/queryutils')(db),
    service={};
    var enums=require('../utils/enums');
    var mailer=require('../mailing/mailer');

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

  service.getAllExpenses = function(request,approvedOnly) {

        request.orderBy = [{
            'submittedDate': -1
        }];
        return Q.Promise(function(resolve, reject) {
            var q = db.System.find().select('statutoryTables.vat expensesRate mileageRates');
            return Q.nfcall(q.exec.bind(q)).then(function(system) {
                system.forEach(function(systemDoc) {

                    var expensesQuery = db.Expense.find().populate('user', 'title firstName lastName worker.vehicleInformation');


                    queryutils.applySearch(expensesQuery, db.Expense, request)
                        .then(function(expense) {
                            var bucket = [];

                            var pushIt = true;
                            expense.rows.some(function(t) {
                              if(!pushIt){
                                return true;
                              }
                                var bucketObject = {};
                                bucketObject.expenses = [];

                                bucketObject.claimReference = t.claimReference;
                                bucketObject.claimDate = t.createdDate;
                                bucketObject.expenses = [];
                                bucketObject.user = t.user;
                                bucketObject.id = t._id;

                                var secondValue = t.days;

                                bucketObject.total = 0;
                                secondValue.some(function(l) {


                                    var daySpecific = {};
                                    daySpecific.startTime = l.startTime;
                                    daySpecific.endTime = l.endTime;
                                    daySpecific.date = l.date;
                                    daySpecific.postcodes = l.postcodes;
                                    daySpecific.dayId = l._id;
                                    l.expenses.some(function(i) {
                                      if(approvedOnly && i.status !== 'approved' ){
                                        pushIt = false;
                                        return true;
                                      }
                                        var t = {};
                                        t.date = l.date;
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
                                              t.amount = i.value;
                                              t.value = 4.5;  
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
                                                            t.expenseDetail.vat = time.amount /100 * 4.5+'';

                                                        }


                                                    });
                                                }


                                            }

                                        }else{
                                          t.amount = i.value;
                                          t.value = 0.45;      
                                          t.expenseDetail = {};
                                          t.expenseDetail.name=i.subType;
                                          t.expenseDetail.total=i.value;
                                          t.expenseDetail.vat=0+'';
                                          systemDoc.statutoryTables.vat.forEach(function(time) {
                                                        var validFrom = new Date(time.validFrom);
                                                        var validTo = new Date(time.validTo);
                                                        var current = new Date();
                                                        if (current.valueOf() >= validFrom.valueOf() && current.valueOf() <= validTo.valueOf()) {

                                                            t.expenseDetail.total = i.value + (time.amount / 100 * i.value);
                                                            t.expenseDetail.vat = time.amount /100 * 4.5+'';

                                                        }


                                                    });
                                        }

                                        bucketObject.expenses.push(t);

                                    });


                                });

                                // console.log(bucketObject)
                                if(pushIt){
                                  bucket.push(bucketObject);
                                }

                            });
                            
                            resolve({ claims: bucket, system: system });
                        });




                });

            }, reject);

        });

  /////////////////////////////////////////////////////////////////////////////////////////
    // return Q.Promise(function(resolve, reject) {
    // // //   var q = db.System.find().select('statutoryTables.vat expensesRate');
    // // //         return Q.nfcall(q.exec.bind(q)).then(function(system) {
    // // //           console.log(system);
    // // //           resolve(system);
    // // //         },function(err){
    // // //           reject(err);
    // // //         });
    // // //       }); 


    //   var expensesQuery = db.Expense.find().populate('user', 'title firstName lastName');
    //   return queryutils.applySearch(expensesQuery, db.Expense, request)
    //       .then(function(expenses){
    //         console.log(expenses);
    //         console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%0')

    //         var q = db.System.find().select('mileageRates statutoryTables.vat expensesRate');
    //         return Q.nfcall(q.exec.bind(q)).then(function(system) {
    //           console.log(system);
    //           console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%1')
    //           resolve({system:system,expenses:expenses});
    //         },function(err){
    //           // resolve(expenses);
    //         },function(err){
    //           reject(err);
    //         });
    //       });


    //       },function(err){
    //         console.log(err);
    //         reject(err);
    //       });
        // });
    };

    service.fetchExpenses=function(val){
        console.log('^^^^^^^^^^^^^^^^^^^^^^^1');
        console.log(val);

     var q=db.Expense.find().where('days.expenses._id').in(val).populate('user', 'title firstName lastName emailAddress');
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




service.sendMail  = function(user,expense,status,reason,claimReference){
  return Q.Promise(function(resolve,reject){
              var lastPart = '';
              if(reason){
                lastPart = ' due to '+ reason;
              }
              var message = 'Dear '+user.title+'. '+user.firstName + ' ' + user.lastName + '<br/>'+
                            'your Expense of type '+ expense.subType + ' and amount of ' + expense.value +
                            ' at the claim id Number '+ claimReference + ' has been ' + status +
                            lastPart;
                            console.log(message)
              var mailModel={message:message};
              var mailOption={to:user.emailAddress};
              console.log(mailModel);
              console.log(mailOption);
              return mailer.sendEmail(mailOption,mailModel,'status_change').then(function(){
                  resolve({result:true,message:'mail sent'}); 
                },reject);      
  });
};

    service.changeStatus=function(status,claims){
        return Q.promise(function(resolve,reject){


           var readPromises = [];
           var mailPromises = [];
           var writePromises = [];
          claims.objects.forEach(function(claim){
            console.log('claim.claimId  ===> ' + claim.claimId);
            var q = db.Expense.findById(claim.claimId).populate('user', 'title firstName lastName emailAddress');;
            readPromises.push(Q.nfcall(q.exec.bind(q)));
          });

          return Q.all(readPromises).then(function(expense){
            for(var i = 0; i < expense.length; i++){
              expense[i].days.forEach(function(day){
                day.expenses.forEach(function(expenses){
                    claims.objects[i].expenses.forEach(function(updatesExpenses){
                      if(expenses._id+'' === updatesExpenses.id+''){
                        expenses.status = status; 
                        writePromises.push(service.sendMail(expense[i].user,expenses,status,updatesExpenses.reason,expense[i].claimReference));
                      }
                    });
                });
              });
              // Q.all(mailPromises).then(function(){
                // console.log('***************************000000')
                writePromises.push(Q.nfcall(expense[i].save.bind(expense[i])));
              //   // resolve({result:true});
              // },function(err){
              //   console.log('***********1')
              //   reject(err);
              // });
            }
            return Q.all(writePromises).then(function(){
              console.log('***************************')
              console.log('***************************')
              console.log('***************************')
                resolve({result:true});
              },function(err){
                console.log('***********11')
                reject(err);
              });
          },function(err){
            console.log('***********2') 
            reject(err);
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


    service.editExpenses=function(data){
        return Q.promise(function(resolve,reject){
          var readPromises  = [];
          var WritePromises = [];
          var breakFrmLoops = false;
          for(var i = 0; i < data.length; i++){
            var q = db.Expense.findById(data[i].claimId);
            readPromises.push(Q.nfcall(q.exec.bind(q)));
          }
          Q.all(readPromises).then(function(expenses){
            for(var i = 0; i < expenses.length; i++){
            var dayIndex = -1;

              expenses[i].days.forEach(function(day){
                dayIndex ++;
                var dayExpenseIndex = -1;
                day.expenses.forEach(function(dayExpense){
                  dayExpenseIndex ++;
                  if(dayExpense._id+'' === data[i].id+''){
                    console.log('**')
                          console.log('this day')
                          console.log('**')
                    var changeDay = false;
                    for(var key in data[i]){
                      if(key === 'date'){
                        changeDay = true;
                      }else{
                        dayExpense[key] = data[i][key];
                      }
                    }
                    if(changeDay){
                      var foundTheTargetDay = false;
                      expenses[i].days.forEach(function(targetNewDay){
                      
                        if(daysBetween(targetNewDay.date,new Date(data[i].date)) === 0){
                          console.log('**')
                          console.log('new day')
                          console.log('**')  
                          foundTheTargetDay = true;
                          targetNewDay.expenses.push(dayExpense);
                          day.expenses.splice(dayExpenseIndex,1);
                          breakFrmLoops = true;
                          return;
                        }
                      });
                      if(!foundTheTargetDay){
                        console.log('**')
                          console.log('create new day')
                          console.log('**')
                    
                        var newDay = {};
                        newDay.date = new Date(data[i].date); 
                        newDay.startTime = day.startTime; 
                        newDay.endTime = day.endTime; 
                        newDay.expenses = [];
                        newDay.expenses.push(dayExpense);
                        day.expenses.splice(dayExpenseIndex,1);
                        console.log('newDay')
                        console.log(newDay)
                        expenses[i].days.push(newDay); 
                      }
                    }
                    breakFrmLoops = true;
                    return;
                  }
                });
                if(breakFrmLoops){
                  return;
                }
              });
                    WritePromises.push(Q.nfcall(expenses[i].save.bind(expenses[i])));
            }
            
            return Q.all(WritePromises).then(function(res){
              resolve({result:true,opjects:res});
            },function(err){
              reject(err);
            });
          },function(){
            reject('can not find this claim');
          });
        });

    };




    service.setClaimsSubmitted=function(data){
        return Q.promise(function(resolve,reject){
          var readPromises  = [];
          var WritePromises = [];
          for(var i = 0; i < data.length; i++){
            var q = db.Expense.findById(data[i]);
            readPromises.push(Q.nfcall(q.exec.bind(q)));
          }
          Q.all(readPromises).then(function(expenses){
            for(var i = 0; i < expenses.length; i++){
              expenses[i].days.forEach(function(day){
                day.expenses.forEach(function(dayExpense){
                  dayExpense.status = 'submitted';
                });
              });
                    WritePromises.push(Q.nfcall(expenses[i].save.bind(expenses[i])));
            }
            return Q.all(WritePromises).then(function(res){
              resolve({result:true,opjects:res});
            },function(err){
              reject(err);
            });
          },function(){
            reject('can not find this claim');
          });
        });

    };

    
    function daysBetween(first, second) {
      // Copy date parts of the timestamps, discarding the time parts.
      var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
      var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());
      console.log(one)
      console.log(two)
      // Do the math.
      var millisecondsPerDay = 1000 * 60 * 60 * 24;
      var millisBetween = two.getTime() - one.getTime();
      var days = millisBetween / millisecondsPerDay;
      // Round down.
      console.log(Math.floor(days))
      console.log('**')

      return Math.floor(days);
    }

  return service;
};
