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

                                console.log(bucketObject)
                                bucket.push(bucketObject);

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




service.sendMail  = function(user,status){
  return Q.Promise(function(resolve,reject){
    
    // return service.getUser(id).then(function(user){
    //     if(user){
        //  user.resetPassword.activationCode=activationCode;
        //  user.resetPassword.date=Date();

          // return Q.nfcall(user.save.bind(user)).then(function(){
            // return service.generateCode(user,enums.codeTypes.ChangePassword).then(function(code){
              // var fullUrl = req.protocol + '://' + req.get('host') +'/'+status+'/'+req.query.emailAddress;
              // var activationCode ='';
              // var newActivationLink='';
              // newActivationLink=fullUrl +'/'+code.code;
              var mailModel={title:user.title,firstName:user.firstName,lastName:user.lastName,status:status};
              var mailOption={to:user.emailAddress};
              console.log('&&&&&&&&&&&&&&&&&&&')
              return mailer.sendEmail(mailOption,mailModel,'approve_reject_message').then(function(){
                  resolve({result:true,message:'mail sent'}); 
                },reject);  
            // },reject);
          // },reject);
      //   }else{

      //     reject({result:false,name:'NOTFOUND',message:'User profile not found'});
      //   }
      // },reject);
    
  });
};

    service.changeStatus=function(status,ids){
        console.log(ids);
        console.log('**');
        console.log(status);

        return Q.promise(function(resolve,reject){

          service.fetchExpenses(ids).then(function(model){

             for(var i=0;i<model.length;i++){
                model[i].days.forEach(function(l){

                      ids.forEach(function(id){

                           var v=l.expenses.id(id);
                           if(v){
                              v.status=status;
                              console.log('^^^^^^^^^^^^^^^');
                              console.log('******');
                              console.log(v);
                              service.sendMail(v.user,status);
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


    service.editExpenses=function(data){
        return Q.promise(function(resolve,reject){

        //    var q = db.System.find().select('statutoryTables expensesRate');

        //   return Q.nfcall(q.exec.bind(q)).then(function(system){


        // system.forEach(function(systemDoc){

        //   console.log(ids)

        //   service.fetchExpensesForEdit(ids).then(function(model){


        //       var bucket=[];
        //                console.log('%%%%%%%%%%%%%%%%%%%%1');
        //                console.log(model.length);

        //       for(var i=0;i<model.length;i++){

        //         model[i].days.forEach(function(l){
        //            ids.forEach(function(doc){

        //                var e=l.expenses.id(doc.id);
        //                if(e){
        //                 for(var key in doc){
        //                   if(doc[key]){
        //                     e[key] = doc[key];
        //                   }
        //                   console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        //                   console.log(key)
        //                 }

        //                }
        //            });
        //         });
        //           bucket.push(Q.nfcall(model[i].save.bind(model[i])));
        //       }
        //      // var bucket=[];
        //      // model.forEach(function(mo){

        //      //   bucket.push(Q.nfcall(mo.save.bind(mo)));

        //      // });
        //      return Q.all(bucket).then(function(){
        //          resolve({result:true})

        //      },reject);


        //   },reject);
        //  });
        //  });
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
