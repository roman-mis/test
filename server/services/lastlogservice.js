    'use strict';

    module.exports = function(dbs) {
        var db = dbs;
        var Q = require('q'),
            mongoose = require('mongoose'),
            _ = require('lodash');

        var service = {};
        service.getLastLogs = function(id, type) {


            var defer = Q.defer();
            if (type === 'User') {
                db.User.findOne({
                    '_id': id
                }).select('lastLogin').exec(function(err, d) {

                    if (!err) {

                        defer.resolve({
                            'result': true,
                            object: {
                                'lastLogin': d.lastLogin
                            }
                        });
                    } else {

                        defer.reject(err);
                    }
                });
            } else if (type === 'Task') {

                db.Task.aggregate({

                        '$match': {

                            'user': mongoose.Types.ObjectId(id)
                        }
                    }, {
                        '$project': {
                            'createdDate': true
                        }
                    }, {

                        '$sort': {

                            'createdDate': -1
                        }
                    },


                    function(err, document) {

                        if (!err) {

                            defer.resolve({
                                'result': true,
                                object: {
                                    'lastCallLog': document.length?document[0].createdDate:null
                                }
                            });
                        } else {

                            defer.reject(err);
                        }
                    });
            } else if (type === 'Expense') {

                db.Expense.aggregate({

                        '$match': {

                            'user': mongoose.Types.ObjectId(id)
                        }
                    }, {
                        '$project': {
                            'createdDate': true
                        }
                    }, {

                        '$sort': {

                            'createdDate': -1
                        }
                    },


                    function(err, document) {


                        if (!err) {

                            defer.resolve({
                                'result': true,
                                object: {
                                    'lastExpense': document.length?document[0].createdDate:null
                                }
                            });
                        } else {

                            defer.reject(err);
                        }
                    });
            }

            return defer.promise;


        };


        service.getLastlog = function() {
            var arg = arguments;


            return Q.Promise(function(resolve, reject) {

                return Q.all([service.getLastLogs(arg[0], arg[1][0]), service.getLastLogs(arg[0], arg[1][1]), service.getLastLogs(arg[0], arg[1][2])]).then(function(doc) {

                    resolve(doc);

                }, reject);


            });


        };
        return service;

    };
