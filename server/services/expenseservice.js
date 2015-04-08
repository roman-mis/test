'use strict';

module.exports = function (dbs) {

    var db = dbs,
      Q = require('q'),
      queryutils = require('../utils/queryutils')(db),
      service = {};
    var enums = require('../utils/enums');
    var mailer = require('../mailing/mailer');

    service.getExpenses = function (request) {
        return Q.Promise(function (resolve, reject) {
            var q = db.Expense.find().populate('agency').populate('user').populate('createdBy');

            queryutils.applySearch(q, db.Expense, request)
              .then(resolve, reject);
        });
    };

    service.getExpense = function (id, populate) {
        populate = typeof populate !== 'undefined' ? populate : false;
        var q = db.Expense.findById(id);

        if (populate) {
            q.populate('agency');
            q.populate('user');
            q.populate('createdBy');
        }

        return Q.nfcall(q.exec.bind(q));
    };


    service.saveExpenses = function (expenseDetails) {
        console.log(expenseDetails); console.log(expenseDetails.days);
        console.log('here wer are');
        var deff = Q.defer();
        var expenseModel;
        expenseModel = new db.Expense(expenseDetails);
        expenseModel.save(function (err) {
            if (err) {
                deff.reject(err);
            } else {
                console.log('save success');
                deff.resolve(expenseModel);
            }
        });
        return deff.promise;
    };

    service.getAllExpenses = function (request, approvedOnly) {

        request.orderBy = [{
            'submittedDate': -1
        }];
        return Q.Promise(function (resolve, reject) {
            var q = db.System.find().select('statutoryTables.vat expensesRate mileageRates');
            return Q.nfcall(q.exec.bind(q)).then(function (system) {
                system.forEach(function (systemDoc) {

                    var expensesQuery = db.Expense.find().populate('user', 'title firstName lastName worker.vehicleInformation');


                    queryutils.applySearch(expensesQuery, db.Expense, request)
                        .then(function (expense) {
                            var bucket = [];


                            expense.rows.forEach(function (t) {
                                var pushIt = false;

                                var bucketObject = {};
                                bucketObject.expenses = [];

                                bucketObject.claimReference = t.claimReference;
                                bucketObject.claimDate = t.createdDate;
                                bucketObject.expenses = [];
                                bucketObject.user = t.user;
                                bucketObject.id = t._id;

                                var secondValue = t.days;

                                bucketObject.total = 0;
                                secondValue.some(function (l) {


                                    var daySpecific = {};
                                    daySpecific.startTime = l.startTime;
                                    daySpecific.endTime = l.endTime;
                                    daySpecific.date = l.date;
                                    daySpecific.postcodes = l.postcodes;
                                    daySpecific.dayId = l._id;
                                    l.expenses.some(function (i) {
                                        pushIt = true;
                                        if (approvedOnly && i.status !== 'approved') {
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
                                        t.subType = i.subType;
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

                                                    systemDoc.statutoryTables.vat.forEach(function (time) {
                                                        var validFrom = new Date(time.validFrom);
                                                        var validTo = new Date(time.validTo);
                                                        var current = new Date();
                                                        if (current.valueOf() >= validFrom.valueOf() && current.valueOf() <= validTo.valueOf()) {

                                                            t.expenseDetail.total = i.value + (time.amount / 100 * i.value);
                                                            t.expenseDetail.vat = time.amount / 100 * 4.5 + '';

                                                        }


                                                    });
                                                }


                                            }


                                        } else {
                                            t.amount = i.value;
                                            t.value = 0.45;
                                            t.expenseDetail = {};
                                            t.expenseDetail.name = i.subType;
                                            t.expenseDetail.total = i.value;
                                            t.expenseDetail.vat = 0 + '';
                                            systemDoc.statutoryTables.vat.forEach(function (time) {
                                                var validFrom = new Date(time.validFrom);
                                                var validTo = new Date(time.validTo);
                                                var current = new Date();
                                                if (current.valueOf() >= validFrom.valueOf() && current.valueOf() <= validTo.valueOf()) {

                                                    t.expenseDetail.total = i.value + (time.amount / 100 * i.value);
                                                    t.expenseDetail.vat = time.amount / 100 * 4.5 + '';


                                                }


                                            });
                                        }

                                        bucketObject.expenses.push(t);
                                        if (!pushIt) {
                                            return true;
                                        }
                                    });


                                });

                                // console.log(bucketObject)
                                if (pushIt) {
                                    bucket.push(bucketObject);
                                }

                            });


                            resolve({ claims: bucket, system: system, totalCount: expense.count });
                        });




                });

            }, reject);

        });
    };

    service.fetchExpenses = function (val) {
        console.log('^^^^^^^^^^^^^^^^^^^^^^^1');
        console.log(val);

        var q = db.Expense.find().where('days.expenses._id').in(val).populate('user', 'title firstName lastName emailAddress');
        console.log('^^^^^^^^^^^^^^^^^^^^^^^1');

        return Q.nfcall(q.exec.bind(q));

    };
    service.fetchExpensesForEdit = function (val) {
        var b = [];
        var q;
        val.forEach(function (l) {

            b.push(l.id);
        });
        q = db.Expense.find().where('days.expenses._id').in(b);
        return Q.nfcall(q.exec.bind(q));
    };


    service.sendMail = function (mailInfo) {

        return Q.Promise(function (resolve, reject) {
            var message = '';
            var header = '';
            var body = '';
            header = '<span style="color:green;margin-right:30px">Claim ID: ' + mailInfo.claimReference + '</span>' +
                     '<span style="color:green;"> Full Name: '  +mailInfo.user.title + '. ' + mailInfo.user.firstName + ' ' + mailInfo.user.lastName + '</span>';

            body   = '';
            for(var j = 0; j < mailInfo.expense.length; j++){
                console.log(mailInfo.expense[j]);
<<<<<<< HEAD
                body = body + '<div style="margin-right:15px;width:200px;display: inline-block;"><b>Type</b>: ' +  mailInfo.expense[j].type + '</div>'+ 
                              '<div style="margin-right:15px;width:300px;display: inline-block;"><b>Subtype</b>: ' +  mailInfo.expense[j].subType + '</div>'+ 
                              '<div style="margin-right:15px;width:100px;display: inline-block;"><b>Total</b>: ' +  mailInfo.expense[j].total + '</div>'+
                              '<div style=" color:red;display: inline-block;"><b>Rejected</b></div> ' + mailInfo.reason[j] + '</div>' + 
                              '<hr>';  
=======
                body = body + '<div style="margin-right:15px;width:200px;display: inline-block;"><b>Type</b>: ' +  mailInfo.expense[j].type + '</div>'+
                              '<div style="margin-right:15px;width:300px;display: inline-block;"><b>Subtype</b>: ' +  mailInfo.expense[j].subType + '</div>'+
                              '<div style="margin-right:15px;width:100px;display: inline-block;"><b>total</b>: ' +  mailInfo.expense[j].total + '</div>'+
                              '<div style=" color:red;display: inline-block;"><b>Rejected</b></div> ' + mailInfo.reason[j] + '</div>' +
                              '<hr>';
>>>>>>> 6e6e59f291cf5f9a45415953ca292a761056b232
            }
            message = '<h3>' + header + '</h3>' + body;
            var mailModel = { message: message };
            var mailOption = { to: mailInfo.user.emailAddress };
            console.log(mailModel);
            console.log(mailOption);
            return mailer.sendEmail(mailOption, mailModel, 'status_change').then(function () {
                resolve({ result: true, message: 'mail sent' });
            }, reject);
        });
    };

    service.changeStatus = function (status, claims) {
        return Q.promise(function (resolve, reject) {
            console.log('**************//*****************');
            console.log(claims.objects);
            console.log('**************//*****************');
            // console.log(claims)
            var claimCounter = 0;
            var mailInfo = [];
            claims.objects.forEach(function (claim) {
                // console.log(claimCounter);
                console.log('claim.claimId  ===> ' + claim.claimId);
                var q = db.Expense.findById(claim.claimId).populate('user', 'title firstName lastName emailAddress');
                Q.nfcall(q.exec.bind(q)).then(function(expense){
                    claimCounter++;
                    console.log('get the claim ' + claimCounter);
                    var mailInfoItem = {};
                    mailInfoItem.claimReference = expense.claimReference;
                    mailInfoItem.user = expense.user;
                    mailInfoItem.reason = [];
                    mailInfoItem.expense = [];
                    expense.days.forEach(function (day) {
                        console.log(1);
                        day.expenses.forEach(function (expenses) {
                            console.log(2);
                            claim.expenses.forEach(function (updatesExpenses) {
                                console.log(3);
                                if (expenses._id + '' === updatesExpenses.id + '') {
                                    console.log('####$$$$$#####');
                                    expenses.status = status;
                                    mailInfoItem.reason.push(updatesExpenses.reason !== 'Other' ? updatesExpenses.reason : updatesExpenses.other);
                                    mailInfoItem.expense.push(updatesExpenses);
                                }
                            });
                        });

                    });
                    console.log('getMailInfoItem ' + claimCounter);
                    mailInfo.push(mailInfoItem);

                    Q.nfcall(expense.save.bind(expense)).then(function(){
                        console.log('save claim num' + claimCounter);
                        console.log('sending mail');
                        console.log(status);
                        if(status === 'rejected'){
                            service.sendMail(mailInfoItem).then(function(){
                                if(claimCounter === claims.objects.length){
                                    resolve({ result: true });
                                }
                            },function(err){
                                reject(err);
                            });
                        }else{
                            resolve({ result: true });
                        }
                    },function(err){
                        reject(err);
                    });
                },function(err){
                    reject(err);
                });

            });
        });
    };
    service.deleteExpense = function (ids) {
        return Q.promise(function (resolve, reject) {

            service.fetchExpenses(ids).then(function (model) {


                for (var i = 0; i < model.length; i++) {

                    model[i].days.forEach(function (l) {

                        ids.forEach(function (id) {

                            var v = l.expenses.id(id);
                            if (v) {

                                v.remove();

                            }

                        });
                    });

                }

                var bucket = [];
                model.forEach(function (mo) {

                    bucket.push(Q.nfcall(mo.save.bind(mo)));

                });

                return Q.all(bucket).then(function () {
                    resolve({ result: true });

                }, reject);

            }, reject);

        });

    };



    service.editExpenses = function (data) {
        console.log('**');
        console.log(data);
        console.log('**');
        //get unique claims
        var claims = [];
        data.forEach(function(dataElement){
            var found = false;
            for(var i = 0; i < claims.length; i++){
                if(claims[i] + '' === dataElement.claimId + ''){
                    found = true;
                    break;
                }
            }
            if(!found){
                claims.push(dataElement.claimId);
            }
        });
        //end
        console.log('***************************//***************')
        console.log('claims');
        console.log(claims);

        return Q.promise(function (resolve, reject) {
            // var readPromises = [];
            var allResponses = [];
            var breakFrmDaysLoop = false;
            var claimsCounter  = 0;
            claims.forEach(function(claim){
                claimsCounter++;
                var q = db.Expense.findById(claim);
                Q.nfcall(q.exec.bind(q)).then(function(expense){
                    for (var i = 0; i < data.length; i++) {
                        breakFrmDaysLoop = false;
                        if(claim === data[i].claimId + ''){
                            var dayIndex = -1;
                            expense.days.some(function (day) {
                                dayIndex++;
                                var dayExpenseIndex = -1;
                                day.expenses.some(function (dayExpense) {
                                    dayExpenseIndex++;
                                    if (dayExpense._id + '' === data[i].id + '') {
                                        breakFrmDaysLoop = true;
                                        var changeDay = false;
                                        for (var key in data[i]) {
                                            if (key === 'date') {
                                                changeDay = true;
                                            } else {
                                                dayExpense[key] = data[i][key];
                                            }
                                        }
                                        if (changeDay) {
                                            var foundTheTargetDay = false;
                                            expense.days.some(function (targetNewDay) {
                                                if (daysBetween(targetNewDay.date, new Date(data[i].date)) === 0) {
                                                    console.log('**');
                                                    console.log('foundTheTargetDay ===> true');
                                                    console.log('**');
                                                    foundTheTargetDay = true;
                                                    targetNewDay.expenses.push(dayExpense);
                                                    day.expenses.splice(dayExpenseIndex, 1);
                                                    return true;
                                                }
                                            });
                                            //if didn't found this day ... create new one
                                            if (!foundTheTargetDay) {
                                                console.log('**');
                                                console.log('create new day');
                                                console.log('**');
                                                var newDay = {};
                                                newDay.date = new Date(data[i].date);
                                                newDay.startTime = day.startTime;
                                                newDay.endTime = day.endTime;
                                                newDay.expenses = [];
                                                newDay.expenses.push(dayExpense);
                                                day.expenses.splice(dayExpenseIndex, 1);
                                                expense.days.push(newDay);
                                            }

                                        }
                                    }
                                    console.log('dayFinished');
                                });
                                if (breakFrmDaysLoop) {
                                    console.log('breakFrmDaysLoop');
                                    return true;
                                }
                            });
                            console.log('I ===> '+ i);
                        }
                    }
                    console.log('push the promise');
                    Q.nfcall(expense.save.bind(expense)).then(function(res){
                        allResponses.push(res);
                        console.log('claimsCounter ===> '+ claimsCounter);
                        if(claimsCounter === claims.length){
                            console.log('******/resolving/********');
                            console.log('******/resolving/********');
                            resolve({ result: true });
                        }
                    },function(err){
                    console.log('err2');
                    console.log(err);
                        reject(err);
                    });
                },function(err){
                    console.log('err1');
                    console.log(err);
                    reject(err);
                });


            });
        });
    };



    service.setClaimsSubmitted = function (data) {
        console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&****************************');
        console.log(data);
        return Q.promise(function (resolve, reject) {
            var readPromises = [];
            var WritePromises = [];
            for (var i = 0; i < data.length; i++) {
                var q = db.Expense.findById(data[i]);
                readPromises.push(Q.nfcall(q.exec.bind(q)));
            }
            Q.all(readPromises).then(function (expenses) {
                console.log(expenses.length)
                for (var i = 0; i < expenses.length; i++) {
                    expenses[i].days.forEach(function (day) {
                        day.expenses.forEach(function (dayExpense) {
                            dayExpense.status = 'submitted';
                        });
                    });
                    WritePromises.push(Q.nfcall(expenses[i].save.bind(expenses[i])));
                }
                return Q.all(WritePromises).then(function (res) {
                    resolve({ result: true, opjects: res });
                }, function (err) {
                    reject(err);
                });
            }, function () {
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
