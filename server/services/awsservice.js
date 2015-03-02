 'use strict';

var aws = require('aws-sdk'),
    // path=require('path')
    Q=require('q'),
    _=require('lodash');
var service;



var defaultS3Params={
	Bucket: process.env.S3_BUCKET,
    Expires: 60,
    ACL: 'private'
};
var defaultS3getParams={
	Bucket: process.env.S3_BUCKET,
    Expires: 60
};
var defaultS3PlainParams={
	Bucket: process.env.S3_BUCKET
};


var awsConfig={
	AWS_ACCESS_KEY:process.env.AWS_ACCESS_KEY,
	AWS_SECRET_KEY:process.env.AWS_SECRET_KEY,
	S3_BUCKET : process.env.S3_BUCKET
};

module.exports=service={
	getS3SignedUrl:function(methodName,s3ObjectName,s3ObjectType,folder,opt){
		opt=opt||{};
		var deff=Q.defer();
		
		console.log(awsConfig);

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();

	    var s3Params ={};
	    
	    if(folder && folder!=='' && folder.slice(-1)!=='/'){
	    	folder=folder+'/';
	    }
	    else{
	    	folder=folder||'';
	    }

	    if(methodName==='putObject'){
	    	s3Params =_.assign({
		        Key: (folder||'')+s3ObjectName,
		        ContentType: s3ObjectType
	    	},defaultS3Params);
	    }
	    else {
	    		s3Params =_.assign({
		        Key: (folder||'')+s3ObjectName
	    	},defaultS3getParams);

	    }

	    s3Params=_.assign(s3Params,opt);


	    console.log(s3Params);

	    //console.log(s3Params);
	    s3.getSignedUrl(methodName, s3Params, function(err, data){
	        if(err){
	            console.log(err);
	            deff.reject(err);
	        } else {
	            var returnData = {
	                signedRequest: data,
	                url: 'https://'+awsConfig.S3_BUCKET+'.s3.amazonaws.com/'+s3Params.Key
	            };
	            deff.resolve(returnData);
	            
	        }
	    });

	    return deff.promise;
	},
	copyS3Object:function(s3ObjectSource,s3ObjectName,folder,opt){
		opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
		
		//copying
		console.log('copying.....');

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();
	    
	    if(folder && folder!=='' && folder.slice(-1)!=='/'){
	    	folder=folder+'/';
	    }
	    else{
	    	folder=folder||'';
	    }

	    var s3Params =_.assign({
	    	CopySource:s3ObjectSource,
	        Key: (folder||'')+s3ObjectName
	    },defaultS3Params);

	    console.log(s3Params);

	    //console.log(s3Params);
	    s3.copyObject(s3Params, function(err, data){
	        if(err){
	        	console.log('copy error ...');
	            console.log(err);
	            deff.reject(err);
	        } else {
	            var returnData = {
	                signedRequest: data,
	                url: 'https://'+awsConfig.S3_BUCKET+'.s3.amazonaws.com/'+s3Params.Key
	            };
	            deff.resolve(returnData);
	            
	        }
	    });

	    return deff.promise;
	},
	moveS3Object:function(s3ObjectSource,s3ObjectName,folder,opt){
		opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
		
		//copying
		console.log('copying.....');

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();

	    if(folder && folder!=='' && folder.slice(-1)!=='/'){
	    	folder=folder+'/';
	    }
	    else{
	    	folder=folder||'';
	    }

	    var s3Params =_.assign({
	    	CopySource:defaultS3Params.Bucket+'/'+ s3ObjectSource,
	        Key: (folder||'')+s3ObjectName
	    },defaultS3Params);

	    console.log(s3Params);

	    //console.log(s3Params);
	    s3.copyObject(s3Params, function(err){
	        if(err){
	        	console.log('copy error ...');
	            console.log(err);
	            deff.reject(err);
	        } else {
	      //   	var deleteParam=_.assign({
			    // 	Key: s3ObjectSource
			    // },defaultS3PlainParams);

	        	service.deleteS3Object(s3ObjectSource).then(function(data){
	        		
		        		var returnData = {
			                data: data,
			                url: 'https://'+awsConfig.S3_BUCKET+'.s3.amazonaws.com/'+s3Params.Key
			            };
			            deff.resolve(returnData);
			        
	        	},function(err){

			        	console.log('delete error ...');
			            console.log(err);
			            deff.reject(err);
			        
	        	});

	        }
	    });

	    return deff.promise;
	},
	deleteS3Object:function(s3ObjectSource,folder){
		//opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
		//deleting
		console.log('deleting '+s3ObjectSource+'.....');

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();
	    if(folder && folder!=='' && folder.slice(-1)!=='/'){
	    	folder=folder+'/';
	    }
	    else{
	    	folder=folder||'';
	    }
	   
    	var deleteParam=_.assign({
	    	Key: (folder||'')+s3ObjectSource
	    },defaultS3PlainParams);

    	s3.deleteObject(deleteParam,function(err,data){
    		if(err){
    			console.log('delete error');
    			console.log(err);
    			deff.reject(err);
    		} else {
    		
        		var returnData = {
	                data: data
	            };
	            deff.resolve(returnData);
	        }
    	});

    	return deff.promise;

	},
	putS3Object:function(data,s3ObjectName,s3ObjectType,folder,opt){
		opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
		console.log('putS3Object');
		// console.log(awsConfig);

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();

	    var s3Params =_.assign({
	        Key: (folder||'')+s3ObjectName,
	        ContentType: s3ObjectType,
	        Body:data
	    },defaultS3Params);

	    console.log(s3Params);

	    //console.log(s3Params);
	    s3.putObject(s3Params, function(err){
	        if(err){
	            console.log(err);
	            deff.reject(err);
	        } else {
	            var returnData = {
	                url: 'https://'+awsConfig.S3_BUCKET+'.s3.amazonaws.com/'+s3Params.Key
	            };
	            deff.resolve(returnData);
	            
	        }
	    });

	    return deff.promise;
	},
	getS3Object:function(s3ObjectName,folder){
		return Q.Promise(function(resolve,reject){
			var s3Params =_.assign({
		        Key: (folder||'')+s3ObjectName
		    },defaultS3PlainParams);
			
			aws.config.update({
		        accessKeyId: awsConfig.AWS_ACCESS_KEY,
		        secretAccessKey: awsConfig.AWS_SECRET_KEY
		    });
		    var s3 = new aws.S3();
		    var response=s3.getObject(s3Params,function(err,data){
		    	console.log('getObject complete');
		    	if(err){
		    		reject(err);
		    	}
		    	else{
		    		resolve(data);
		    	}
		    });
		    console.log(response);
		    // response.on('error',reject)
		    // .on('httpDone',function(err){
		    // 	resolve(response.createReadStream());	
		    // });
			
				// .on('httpData',function(chunk){

				// })
				// .on('httpDone',function(){

				// });

		});
	}
};    
