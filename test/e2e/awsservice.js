 'use strict';

var aws = require('aws-sdk'),
    // path=require('path')
    Q=require('q'),
    _=require('lodash');
var service;



var defaultS3Params={
	Bucket:'originem-payroll-dev',
    Expires: 60,
    ACL: 'public-read'
};
var defaultS3getParams={
	Bucket: process.env.S3_BUCKET,
    Expires: 60
};
var defaultS3PlainParams={
	Bucket: process.env.S3_BUCKET
};


var awsConfig={
	AWS_ACCESS_KEY:'AKIAIF5NQNWWX4EY5ATA',
	AWS_SECRET_KEY:'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',
	S3_BUCKET : 'originem-payroll-dev'
};

module.exports=service={
	putS3Object:function(data,s3ObjectName,s3ObjectType,folder,opt){
		opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
	//	console.log('putS3Object');
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

	    //console.log(s3Params);

	    //console.log(s3Params);
	    s3.putObject(s3Params, function(err){
	        if(err){
	            console.log(err);
	            deff.reject(err);
	        } else {
            console.log('success');
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
