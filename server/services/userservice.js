'use strict';

var db = require('../models');
var Q=require('q');
// var Promise=require('promise');
var _=require('lodash');
// var Sequelize=require('sequelize');
var mailer=require('../mailing/mailer');
var uuid = require('node-uuid');
var url=require('url');

var utils=require('../utils/utils');
var queryutils=require('../utils/queryutils')(db);
var awsservice=require('../services/awsservice');
var candidatecommonservice=require(__dirname+'/candidatecommonservice');
var enums=require('../utils/enums');

var service={};
service.getUser=function(id){
	
		var q=db.User.findById(id);
		return Q.nfcall(q.exec.bind(q));

}

service.removeUser=function(user_id){
	var q = db.User.remove({_id: user_id});
	return Q.nfcall(q.exec.bind(q));
}

service.getUserByParam=function(parameters){
	
		var q=db.User.findOne(parameters);
		return Q.nfcall(q.exec.bind(q));

}

service.lockunlock=function(id,flag,locked_by){
	flag=flag||false;
	return Q.Promise(function(resolve,reject){
		db.User.findById(id,function(err,user){
			if(user){
				user.locked=flag;
				user.locked_unlocked_by=locked_by;
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
	
}
service.isCodeValid=function(email_address,verification_code){
	return Q.Promise(function(resolve,reject){
		var q=db.Code.findOne({email_address:email_address,code:verification_code,is_used:false});
		q.exec(function(err,code){
	      if(code){
	        console.log('code found for : '+email_address + ' and verification code = '+verification_code);
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
		// q.where('user_type').ne('WK');
		queryutils.applySearch(q,db.User,request)
		.then(resolve,reject);
	});
}

service.checkDuplicateUser=function(email_address,existingInfo){
	existingInfo=existingInfo||{};
	return Q.Promise(function(resolve,reject){

		db.User.findOne({email_address: email_address},function(err, existingUser){
			//console.log('are ids equal   '+existingUser._id.equals(existingInfo._id));
			if(existingUser){
				 	console.log('existingUser._id  '+existingUser._id);
					 console.log('existingInfo._id  '+existingInfo._id);
					if(!existingUser._id.equals(existingInfo._id)){
						var response = { 
							result:false,
							name: 'DuplicateRecordExists',
							message: 'Email address '+email_address+' already taken'
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
}

service.createUser=function(opt, user){
	console.log('create user');
	var deff=Q.defer();
	db.User.findOne({email_address: user.email_address},function(err, existingUser){
		if(existingUser){
			console.log('create user');
			var response ={ 
				name: 'DuplicateRecordExists',
				message: 'Email address '+user.email_address+' already taken'
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
	// 	db.User.findOne({email_address: user.email_address},function(err,existingUser){
	// 	if(existingUser) {
	// 		var response=
	// 		{ 
	// 			name: 'DuplicateRecordExists',
	// 			message: 'Email address '+user.email_address+' already taken'
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
					
	// 				userModel.activation_code=guid;

					
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
}

service.isActivationCodeValid=function(email_address,verification_code){
	var deff=Q.defer();
	db.User.findOne({email_address:email_address})
	  .exec(function(err,user){
	      if(user){
	        console.log('user found with code : '+user.activation_code );
	        //console.log(user);
	        console.log('and last activated date '+user.activated_date);

              if(verification_code===user.activation_code &&  !user.activated_date){
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


service.activateUser=function(user,new_password){
	var deff=Q.defer();
	
	user.is_active=true;
	Q.fcall(function(){
		
		if(new_password){
			return utils.secureString(new_password).
					then(function(secure_password){
						console.log('password hashed : '+secure_password);
						user.password=secure_password;	
					});
			
		}
		else{
			return true;
		}
	})
	.then(function(){
		user.activated_date=new Date();
		
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

service.sendChangePasswordEmail=function(id,generate_by){
	// console.log('sendChangePasswordEmail');
	return Q.Promise(function(resolve,reject){
		service.getUser(id)
			.then(function(user){
				if(user){
					console.log('user found');
					service.generateCodeAndSendEmail(user,enums.code_types.ChangePassword,generate_by)
					.then(function(response){
						resolve(response);
					},reject);
				}
				else{
					reject({result:false,name:'NOTFOUND',message:'User profile not found'});
				}
			},reject);	
	});
}
service.generateCodeAndSendEmail=function(user,code_type,generate_by){
	console.log('generateCodeAndSendEmail');
	return Q.Promise(function(resolve,reject){
		
		service.generateCode(user,code_type,generate_by)
			.then(function(code){
				console.log('sending code email');
				service.sendCodeEmail(user,code,{subject:'Change password link'})
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
}

service.generateCode=function(user,code_type,generate_by){
	return Q.Promise(function(resolve,reject){
			
			var guid=uuid.v1();
			console.log('generating code');
			var newCode=new db.Code({code:guid,email_address:user.email_address,user:user._id,code_type:code_type,updated_by:generate_by});
			console.log('new Code is : ');console.log(newCode);

			return Q.nfcall(newCode.save.bind(newCode))
				.then(function(){
					console.log('code saved');
					resolve(newCode);
				},reject);


	});
}

service.sendCodeEmail=function(user,code,opt){
	return Q.Promise(function(resolve,reject){
		console.log('sending email');
		var activation_link=global.base_url + '/reset-password/'+user.email_address+'/'+code.code;

		if(code.code_type===enums.code_types.ChangePassword){
			var mailModel={activation_link:activation_link,title:user.title,first_name:user.first_name,last_name:user.last_name};
			var mailOption=_.assign(opt||{},{to:user.email_address});
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
}

service.verifyCode=function(email_address,verification_code,code_type){
	
	return Q.Promise(function(resolve,reject){
		verifyCode(email_address,verification_code,code_type)
			.then(function(response){
				if(response.result){
					resolve({result:true});
				}
				else{
					resolve(response);
				}
			
			},reject);
		
	});

}

function verifyCode(email_address,verification_code,code_type){
	return Q.Promise(function(resolve,reject){
		service.getUserByParam({email_address:email_address})
			.then(function(user){
				if(user){
					console.log('user found');
					service.getCode(user._id,verification_code,code_type)
						.then(function(code){
							if(code){
								console.log('code found');
								if(code.is_used){
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

service.changePassword=function(email_address,verification_code,new_password){
	console.log('change password');
	console.log(arguments);
	return Q.Promise(function(resolve,reject){

		verifyCode(email_address,verification_code,enums.code_types.ChangePassword)
			.then(function(response){
				if(response.result){
					console.log('code verified');
					// console.log('valid ver');
					service.useCode(response.object.code)
						.then(function(){
							var user=response.object.user;
							user.password=new_password;
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

}


service.getCode=function(user_id,code,code_type){
	console.log('searching for code');
	var q=db.Code.findOne({user:user_id,code:code,code_type:code_type});
	return Q.nfcall(q.exec.bind(q));

}

service.useCode=function(code){
	code.is_used=true;
	code.updated_date=Date();
	return Q.nfcall(code.save.bind(code));

}

module.exports=service;

function sendMail(opt,userModel){
	var newActivationLink=opt.activation_link+'/'+userModel.activation_code;

	var mailModel={title:userModel.title,first_name:userModel.first_name,last_name:userModel.last_name,
				activation_link:newActivationLink};
	var mailOption=_.assign(opt||{},{to:userModel.email_address});
	
		return mailer.sendEmail(mailOption,mailModel,'user_registration_activation');
}