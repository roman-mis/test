'use strict';

var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var _=require('lodash');
// var Sequelize=require('sequelize');
var mailer=require('../mailing/mailer');
var uuid = require('node-uuid');

var utils=require('../utils/utils');
var queryutils=require('../utils/queryutils')(db);
var enums=require('../utils/enums');

var service={};
service.getUser=function(id){
	
		var q=db.User.findById(id);
		return Q.nfcall(q.exec.bind(q));

};

service.removeUser=function(userId){
	var q = db.User.remove({_id: userId});
	return Q.nfcall(q.exec.bind(q));
};

service.getUserByParam=function(parameters){
	
		var q=db.User.findOne(parameters);
		return Q.nfcall(q.exec.bind(q));

};

service.lockunlock=function(id,flag,lockedBy){
	flag=flag||false;
	return Q.Promise(function(resolve,reject){
		db.User.findById(id,function(err,user){
			if(user){
				user.locked=flag;
				user.lockedUnlockedBy=lockedBy;
				Q.nfcall(user.save.bind(user))
				.then(function(){
					resolve(user);
				},reject);
			}
			else{
				reject(err);
			}
		});	
	});
	
};
service.isCodeValid=function(emailAddress,verificationCode){
	return Q.Promise(function(resolve,reject){
		var q=db.Code.findOne({emailAddress:emailAddress,code:verificationCode,isUsed:false});
		q.exec(function(err,code){
	      if(code){
	        console.log('code found for : '+emailAddress + ' and verification code = '+verificationCode);
	        //console.log(user);
	        resolve(code);
	        
	      }
	      else{
	        reject(err);
	      }
	  });

	});

};

service.getAllUsers=function(request){
	return Q.Promise(function(resolve,reject){
		var q=db.User.find();
		// q.where('userType').ne('WK');
		queryutils.applySearch(q,db.User,request)
		.then(resolve,reject);
	});
};

service.checkDuplicateUser=function(emailAddress,existingInfo){
	existingInfo=existingInfo||{};
	return Q.Promise(function(resolve,reject){

		db.User.findOne({emailAddress: emailAddress},function(err, existingUser){
			//console.log('are ids equal   '+existingUser._id.equals(existingInfo._id));
			if(existingUser){
				 	console.log('existingUser._id  '+existingUser._id);
					 console.log('existingInfo._id  '+existingInfo._id);
					if(!existingUser._id.equals(existingInfo._id)){
						var response = { 
							result:false,
							name: 'DuplicateRecordExists',
							message: 'Email address '+emailAddress+' already taken'
						};

						reject(response);	
					}
					else{
						console.log('user id equal');
						resolve();
					}
				
			}
			else if(err){
				reject(err);
			}
			else{
				console.log('user with email not found');
				resolve();
			}

		});
	});
};

function sendMail(opt,userModel){
	var newActivationLink=opt.activationLink+'/'+userModel.activationCode;

	var mailModel={title:userModel.title,firstName:userModel.firstName,lastName:userModel.lastName,
				activationLink:newActivationLink};
	var mailOption=_.assign(opt||{},{to:userModel.emailAddress});
	
		return mailer.sendEmail(mailOption,mailModel,'user_registration_activation');
}


service.createUser=function(opt, user){
	console.log('create user');
	var deff=Q.defer();
	db.User.findOne({emailAddress: user.emailAddress},function(err, existingUser){
		if(existingUser){
			console.log('create user duplicate records');
			var response ={ 
				name: 'DuplicateRecordExists',
				message: 'Email address '+user.emailAddress+' already taken'
			};
			deff.reject(response);
		}else{
			console.log('create user');
			var userModel;
			userModel = new db.User(user);
			Q.nfcall(userModel.save.bind(userModel))
			.then(function(){
				return sendMail(opt, userModel);
			}).then(function(){
				deff.resolve({result:true, object: userModel});
			},function(err){
				console.log('rolling back');
				if(!userModel.isNew){
					console.log('rolling back user model');
					userModel.remove();
				}
				deff.reject(err);
			});
		}
	});
	return deff.promise;
	// return Q.Promise(function(resolve,reject){
	// 	db.User.findOne({emailAddress: user.emailAddress},function(err,existingUser){
	// 	if(existingUser) {
	// 		var response=
	// 		{ 
	// 			name: 'DuplicateRecordExists',
	// 			message: 'Email address '+user.emailAddress+' already taken'
	// 		};
			
	// 		deff.reject(response);
			
	// 	}
	// 	else {

			
	// 		var userModel;

	// 		userModel=new db.User(user);

	// 		userModel.worker=null;
			
	// 		console.log('going for validations');
			
	// 		Q.allSettled([Q.nfcall(userModel.validate.bind(userModel))])
	// 		.spread(function(userPromise){
	// 			console.log('------------my validate result.......');
	// 				// console.log(arguments);
	// 				var response=
	// 				{ 
	// 					name: 'ModelValidationError',
	// 					message: 'Validation error',
	// 					errors:[]
	// 				};
	// 				var errObj={};
	// 				var hasError=false;
	// 				if(userPromise.state==='rejected'){
	// 					hasError=true;
	// 					errObj=userPromise.reason.errors;		
	// 				}

	// 				if(hasError){
	// 					console.log('there are errors');
	// 					response.errors=_.map(errObj,function(itm,val){
	// 						return itm;
	// 					});
	// 					//console.log(response.errors);
	// 					reject(response);	
	// 					return;
	// 				}

	// 				console.log('saving.....');

	// 				var guid=uuid.v1();
	// 				console.log('Activation Code is : '+guid);
					
	// 				userModel.activationCode=guid;

					
	// 				console.log('saving started....');
					
	// 				Q.nfcall(userModel.save.bind(userModel))
	// 					.then(function(){
	// 						return sendMail(opt,userModel);		
	// 					})
	// 					.then(function(){
	// 						resolve({result:true,object:userModel});
	// 					},function(err){
	// 						console.log('rolling back');
	// 						if(!userModel.isNew){
	// 							console.log('rolling back user model');
	// 							userModel.remove();
	// 						}

	// 						reject(err);
	// 					});


	// 			} );
	// 		}
	// 	});
	// });
};

service.isActivationCodeValid=function(emailAddress,verificationCode){
	var deff=Q.defer();
	db.User.findOne({emailAddress:emailAddress})
	  .exec(function(err,user){
	      if(user){
	        console.log('user found with code : '+user.activationCode );
	        //console.log(user);
	        console.log('and last activated date '+user.activatedDate);

              if(verificationCode===user.activationCode &&  !user.activatedDate){
                deff.resolve(user);
              }
              else{
                deff.reject();
              }
	        
	      }
	      else{
	        deff.reject(err);
	      }
	  });

	return deff.promise;
};


service.activateUser=function(user,newPassword){
	var deff=Q.defer();
	
	user.isActive=true;
	Q.fcall(function(){
		
		if(newPassword){
			return utils.secureString(newPassword).
					then(function(securePassword){
						console.log('password hashed : '+securePassword);
						user.password=securePassword;	
					});
			
		}
		else{
			return true;
		}
	})
	.then(function(){
		user.activatedDate=new Date();
		
		console.log('running save');
		user.save(function(err){
			if(err){
				deff.reject(err);
			}
			else{
				console.log('save success');
				deff.resolve(user);
			}
		});
		
		
	
	});
		
	
	return deff.promise;
};

service.sendChangePasswordEmail=function(id,generateBy){
	// console.log('sendChangePasswordEmail');
	return Q.Promise(function(resolve,reject){
		return service.getUser(id)
			.then(function(user){
				if(user){
					console.log('user found');
					return service.generateCodeAndSendEmail(user,enums.codeTypes.ChangePassword,generateBy)
					.then(function(response){
						resolve(response);
					},reject);
				}
				else{
					reject({result:false,name:'NOTFOUND',message:'User profile not found'});
				}
			},reject);	
	});
};
service.generateCodeAndSendEmail=function(user,codeType,generateBy){
	console.log('generateCodeAndSendEmail');
	return Q.Promise(function(resolve,reject){
		
		return service.generateCode(user,codeType,generateBy)
			.then(function(code){
				console.log('sending code email');
				return service.sendCodeEmail(user,code,{subject:'Change password link'})
					.then(function(){
						resolve({result:true,object:{user:user,code:code}});
					},reject);
			},reject)
			.fail(function(er){
				console.log('err');
				console.log(er);
			})
			;
				
	});
};

service.generateCode=function(user,codeType,generateBy){
	return Q.Promise(function(resolve,reject){
			
			var guid=uuid.v1();
			console.log('generating code');
			var newCode=new db.Code({code:guid,emailAddress:user.emailAddress,user:user._id,codeType:codeType,updatedBy:generateBy});
			console.log('new Code is : ');console.log(newCode);

			return Q.nfcall(newCode.save.bind(newCode))
				.then(function(){
					console.log('code saved');
					resolve(newCode);
				},reject);


	});
};

service.sendCodeEmail=function(user,code,opt){
	return Q.Promise(function(resolve,reject){
		console.log('sending email');
		var activationLink=global.baseUrl + '/reset-password/'+user.emailAddress+'/'+code.code;

		if(code.codeType===enums.codeTypes.ChangePassword){
			var mailModel={activationLink:activationLink,title:user.title,firstName:user.firstName,lastName:user.lastName};
			var mailOption=_.assign(opt||{},{to:user.emailAddress});
			console.log('calling sendEmail');
			return mailer.sendEmail(mailOption,mailModel,'user_change_password')
			.then(function(){
				console.log('email sent');
				resolve();
			},reject);
		}
		else{
			reject({name:'NOTIMPLEMENTED',message:'Funtionality not implemented yet.'});
		}

	});
};

function verifyCode(emailAddress,verificationCode,codeType){
	return Q.Promise(function(resolve,reject){
		service.getUserByParam({emailAddress:emailAddress})
			.then(function(user){
				if(user){
					console.log('user found');
					service.getCode(user._id,verificationCode,codeType)
						.then(function(code){
							if(code){
								console.log('code found');
								if(code.isUsed){
									resolve({result:false,message:'Code already used.'});
								}
								else{
									resolve({result:true,object:{user:user,code:code}});
								}
							}
							else{
								resolve({result:false,message:'Code not found'});
							}
						},reject);
				}
				else{
					reject({result:false,name:'NOTFOUND',message:'User profile not found'});
				}
			},reject);
		
	});
		
}

service.verifyCode=function(emailAddress,verificationCode,codeType){
	
	return Q.Promise(function(resolve,reject){
		verifyCode(emailAddress,verificationCode,codeType)
			.then(function(response){
				if(response.result){
					resolve({result:true});
				}
				else{
					resolve(response);
				}
			
			},reject);
		
	});

};



service.changePassword=function(emailAddress,verificationCode,newPassword){
	console.log('change password');
	console.log(arguments);
	return Q.Promise(function(resolve,reject){

		verifyCode(emailAddress,verificationCode,enums.codeTypes.ChangePassword)
			.then(function(response){
				if(response.result){
					console.log('code verified');
					// console.log('valid ver');
					service.useCode(response.object.code)
						.then(function(){
							var user=response.object.user;
							user.password=newPassword;
							Q.nfcall(user.save.bind(user))
								.then(function(){
									resolve({result:true,object:{user:user,code:response.code}});
								},reject);
						},reject);
				}
				else{
					reject(response);
				}
			},reject);
		
	});

};


service.getCode=function(userId,code,codeType){
	console.log('searching for code');
	var q=db.Code.findOne({user:userId,code:code,codeType:codeType});
	return Q.nfcall(q.exec.bind(q));

};

service.useCode=function(code){
	code.isUsed=true;
	code.updatedDate=Date();
	return Q.nfcall(code.save.bind(code));

};

service.patchUser = function(userId, userDetails){
	return Q.Promise(function(resolve,reject){
		return service.getUser(userId)
	        .then(function(user){
	          if(user){
	            utils.updateModel(user, userDetails);
	            return Q.nfcall(user.save.bind(user)).then(function(){
	            	resolve(user);
	            });
	          }else{
	            resolve.json({result:false,message:'User not found'});
	          }
	        },reject);
	});
};

module.exports=service;

