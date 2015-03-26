'use strict';


 module.exports=function(dbs){

	var db = dbs;
	var Q=require('q');
	// var Promise=require('promise');
	var _=require('lodash');
	// var Sequelize=require('sequelize');
	var mailer=require('../mailing/mailer'); 
	var uuid = require('node-uuid');
	var service={};
	var utils=require('../utils/utils');
	var queryutils=require('../utils/queryutils')(db);
	var awsservice=require('../services/awsservice');
	var candidatecommonservice=require('./candidatecommonservice')(db);
	var enums=require('../utils/enums');
	var dataList=require('../data/data_list.json');
	// service.simpleTest=function(someparam){
	// 	return 'you sent me '+someparam;

	// }

	service.getUserAgencies=function(id){
		var query=db.User.findById(id).populate('worker.payrollProduct.agency');
		return Q.nfcall(query.exec.bind(query));
	};

	service.updateStatus=function(id,status){
		// var query=db.User.findById(id);
		// console.log(query);
		// return Q.nfcall(query.exec.bind(query));

		return Q.Promise(function(resolve,reject){
		return service.getUser(id)
			.then(function(user){
					console.log(user);
					if(user){
						user.worker.status = status;
						return Q.all([Q.nfcall(user.save.bind(user))])
							.then(function(){
								resolve({result:true});
								console.log({result:true});
							},reject);
					}else{
						console.log({result:false});
						reject({result:false,name:'NOTFOUND',message:'can\'t find candidate'});
					}

			},reject);
	});
	};

	service.getLogs=function(id){
      var defer=Q.defer();
      db.User.findOne({'_id':id}).select('lastLogin').exec(function(err,res){

      	if(!err){

      	defer.resolve(res);
      	}else{

      		defer.reject(err);
      	}
      });
      return defer.promise;
	};

	service.getUserByEmail=candidatecommonservice.getUserByEmail;

	service.getAllCandidates=function(request){

		return Q.Promise(function(resolve,reject){
			var q=db.User.find();

			q.where('userType').equals('WK');

			queryutils.applySearch(q,db.User,request)
			.then(resolve,reject);
		});

	};

	service.uploadDocuments=function(id,documents){
		return Q.Promise(function(resolve,reject){
			service.getUser(id)
				.then(function(user){
					console.log('user is ');
					if(user){
						var docsAdded=[];
						console.log('user found');
						//console.log(user);
			         	///add document to user if applicable
			         	//console.log(user.documents);
			         	_.forEach(documents,function(doc){

			         		var document=user.documents.create(doc);

			         		user.documents.push(document);
			         		docsAdded.push(document);
			         	});

						console.log('uploading documents');
	     				var o=[];Q.Promise(function(){});
	     				_.forEach(documents,function(doc){

	     					// var data=doc.data;
	     					// var mimetype=doc.mimeType;
	     					var newFileName=doc.generatedName;
	     					// console.log('am here');
	     					// console.log(dataList.DocumentTypes);
	     					 var docEnum=utils.findInArray(dataList.DocumentTypes,doc.documentType,'code');
	     					 // console.log('docEnum = '+docEnum);
	     					 var rootPath=(docEnum||{}).path;
	     					var folder=(rootPath||enums.documentTypes.OTHERS)+'/'+id+'/'+(doc.agency?doc.agency+'/':'');
	     					// console.log('folder = '+folder);
	     					// console.log('file key = '+newFileName );
	     					console.log('Moving a Document   '+doc.generatedName+' to '+folder);

	     					o.push(awsservice.moveS3Object(process.env.S3_TEMP_FOLDER+newFileName,newFileName,folder));
	     				});

						console.log('saving user');
	 					Q.all(o)
	 						.then(function(){
	 							return Q.nfcall(user.save.bind(user));
	 						})
	 						.then(function(){
	 							resolve({result:true,object:{user:user,documents:docsAdded}});
	 						},reject);

			         	// Q.nfcall(user.save.bind(user))
		         		// 	.then(function(){


		         		// 	})
				         // 	.then(function(){
				         // 		resolve({result:true,object:{user:user,documents:docsAdded}});
				         // 	},reject);

			        }
			        else{
			          reject({result:false,name:'NotFound',message:'User not found'});
			        }
				},reject);
		});
	};

	function sendMail(opt,userModel){
			var newActivationLink=opt.activationLink+'/'+userModel.activationCode;

			var mailModel={title:userModel.title,firstName:userModel.firstName,lastName:userModel.lastName,
						activationLink:newActivationLink};
			var mailOption={to:userModel.emailAddress};
				return mailer.sendEmail(mailOption,mailModel,'user_registration_activation');
	}

	service.signup=function(opt,user,worker){
		var deff=Q.defer();
		db.User.findOne({emailAddress: user.emailAddress},function(err,existingUser){
			if(existingUser) {
				var response=
				{
					name: 'DuplicateRecordExists',
					message: 'Email address '+user.emailAddress+' already taken'
				};

				deff.reject(response);

			}
			else {


				var userModel;

				userModel=new db.User(user);

				userModel.worker=worker;

				console.log('going for validations');

				Q.allSettled([Q.nfcall(userModel.validate.bind(userModel))])
				.spread(function(userPromise){
					console.log('------------my validate result.......');
						// console.log(arguments);
						var response=
						{
							name: 'ModelValidationError',
							message: 'Validation error',
							errors:[]
						};
						var errObj={};
						var hasError=false;
						if(userPromise.state==='rejected'){
							hasError=true;
							errObj=userPromise.reason.errors;
						}

						if(hasError){
							console.log('there are errors');
							response.errors=_.map(errObj,function(itm){
								return itm;
							});
							console.log(response.errors);
							deff.reject(response);
							return;
						}

						console.log('saving.....');

						var guid=uuid.v1();
						console.log('Activation Code is : '+guid);

						userModel.activationCode=guid;


						console.log('saving started....');
						if(userModel.worker.taxDetail.p45DocumentUrl && userModel.worker.taxDetail.p45DocumentUrl.trim()!=='')
						{
							userModel.worker.taxDetail.p45DocumentUrl=_.last(userModel.worker.taxDetail.p45DocumentUrl.split('/'));
							var doc={documentType:enums.documentTypes.P45,documentName:userModel.worker.taxDetail.p45DocumentUrl,
								generatedName:userModel.worker.taxDetail.p45DocumentUrl,uploadedDate:new Date()};

							userModel.documents.push(doc);

						}
						console.log('user id is : '+userModel._id);
						console.log('user is new ? '+userModel.isNew);

						Q.nfcall(userModel.save.bind(userModel))
							.then(function(){
									//console.log('saving worker');
									console.log('user id is '+userModel._id);
									console.log('user is new ? '+userModel.isNew);

									if(userModel.worker.taxDetail.p45DocumentUrl && userModel.worker.taxDetail.p45DocumentUrl.trim()!=='')
									{

										var objectName=_.last(userModel.worker.taxDetail.p45DocumentUrl.split('/'));
										return awsservice.moveS3Object(process.env.S3_P45_TEMP_FOLDER+objectName,objectName,process.env.S3_P45_FOLDER+userModel._id+'/')
										.then(function(){
                                            if(opt.skipEmail) {
                                                return true;
                                            }

											return sendMail(opt,userModel);
										});
									}
                                    else if(opt.skipEmail) {
                                        return true;
                                    }
									else{
										opt.subject='Registration successful.';
										return sendMail(opt,userModel);
									}

							})
							.then(function(){
								deff.resolve({result:true,object:{userModel:userModel}});
							},function(err){
								console.log('rolling back');
								if(!userModel.isNew){
									console.log('rolling back user model');
									userModel.remove();
								}

								deff.reject(err);
							});


						} )
			.catch(function(){
				console.log('somer error in validation');
				deff.reject(arguments);
			});
	}
	});

	return deff.promise;

	};




	service.getUser=candidatecommonservice.getUser;

	// service.getWorkerByUser=candidatecommonservice.getWorkerByUser;

	service.updateBankDetails=function(userId){
		var deff=Q.defer();

		service.getUser(userId)
		   .then(function(user){
		   		if(user){
		   			//db.sequelize.transaction(function(t){
						// var props=utils.updateSubModel(user.worker.bankDetail,bankDetails);
						return Q.nfcall(user.save.bind(user))
							.then(function(){

								deff.resolve({result:true,object:user});

							},deff.reject);
		   		}
		   		else{
		   			deff.reject({name:'NotFound',message:'No Bank detail found'});
		   		}


		},deff.reject);

	     return deff.promise;
	};


	service.updateContactDetail=function(userId,userInformation,workerPrimaryAddress){
		return Q.Promise(function(resolve,reject){
			service.getUser(userId)
			   .then(function(user){
			   		if(user){
			   				console.log('my user');
			   				console.log(user);
							//var props=utils.updateSubModel(user.contactDetail,workerContact);
							utils.updateSubModel(user,userInformation);
							utils.updateModel(user.worker,workerPrimaryAddress);

							return Q.all([Q.nfcall(user.save.bind(user))])
								.then(function(){

									resolve({result:true,object:user});

								},reject);
			   		}
			   		else{
			   			reject({name:'NotFound',message:'No Bank detail found'});
			   		}


			},reject);
		});

	};

	service.updateVehicleInformation=function(userId, vehicleInformation){
		return Q.Promise(function(resolve,reject){
			service.getUser(userId)
			   .then(function(user){
			   		if(user){
		   				var change = false;
		   				if(user.worker.vehicleInformation.length > 0){
		   					_.forEach(user.worker.vehicleInformation, function(_vehicle){
		   						if(vehicleInformation.vehicleCode.toString() === _vehicle.vehicleCode){
		   							utils.updateModel(_vehicle, vehicleInformation);
		   							change = true;
		   							return false;
			   					}
			   				});
		   				}

						if(!change){
							user.worker.vehicleInformation.push(vehicleInformation);
						}
						return Q.nfcall(user.save.bind(user))
							.then(function(){
								resolve(user);
							},reject);
			   		} else {
			   			reject({name:'NotFound',message:'No User found'});
			   		}
			},reject);
		});
	};

	service.updateWorkerCurrentExpensesToUse=function(userId, total){
		return Q.Promise(function(resolve,reject){
			service.getUser(userId)
			   .then(function(user){
			   		if(user){
		   				user.worker.currentExpensesToUse = (user.worker.currentExpensesToUse || 0) +  total;
						return Q.nfcall(user.save.bind(user))
							.then(function(){
								resolve(user);
							},reject);
			   		} else {
			   			reject({name:'NotFound',message:'No User found'});
			   		}
			},reject);
		});
	};

	service.authenticateUser=function(emailAddress,password){
		var deff=Q.defer();
		console.log('authenticate user email address: '+emailAddress+' and password : '+password);
		service.getUserByEmail(emailAddress)
			.then(function(user){
				// console.log('user object');
				// console.log(user);
				if(user && user.isActive){
					utils.compareSecureString(user.password,password)
					.then(function(result){
						if(result){

							db.User.update({'_id':user._id},{$set:{'lastLogin':new Date()}},function(err){
						        console.log(err);
						    });

							deff.resolve(user);
						}
						else{
							deff.reject({name:'InvalidLogin',message:'User not found',detail:'passwords do not match'});
						}
					});
				}
				else{
					deff.reject({name:'InvalidLogin',message:'User not found',detail:(user && !user.isActive?'not activated '+user.isActive:'user object not found in db')});
				}

			},function(err){
				deff.reject(err);
			});

		return deff.promise;
	};

	service.uploadAvatar=function(id,data,newFileName,mimetype,folder){
		return Q.Promise(function(resolve,reject){
			service.getUser(id)
		      	.then(function(user){
			        if(user){
			         	//db.sequelize.transaction(function(t){
			         		user.avatarFileName=newFileName;

			         	new Q(Q.nfcall(user.save.bind(user))
			         			.then(function(){
			         				console.log('uploading avatar');

		         					return awsservice.putS3Object(data,newFileName,mimetype,folder);

			         			})
			         	)
			         	.then(function(){
			         		resolve({result:true,object:user});
			         	},reject);

			        }
			        else{
			          reject({result:false,name:'NotFound',message:'User not found'});
			        }

		        },reject);

	    });

	};

	return service;

 };
