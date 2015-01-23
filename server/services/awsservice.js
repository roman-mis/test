var aws = require('aws-sdk'),
    path=require('path')
    Q=require('q'),
    _=require('lodash');
var service;

module.exports=service={
	getS3SignedUrl:function(method_name,s3_object_name,s3_object_type,folder,opt){
		opt=opt||{};
		var deff=Q.defer();
		
		console.log(awsConfig);

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();

	    var s3_params ={};
	    
	    if(folder && folder!='' && folder.slice(-1)!=='/'){
	    	folder=folder+'/';
	    }
	    else{
	    	folder=folder||'';
	    }

	    if(method_name==='putObject'){
	    	var s3_params =_.assign({
		        Key: (folder||'')+s3_object_name,
		        ContentType: s3_object_type
	    	},defaultS3Params);
	    }
	    else {
	    		var s3_params =_.assign({
		        Key: (folder||'')+s3_object_name
	    	},defaultS3getParams);

	    }

	    s3_params=_.assign(s3_params,opt);


	    console.log(s3_params);

	    //console.log(s3_params);
	    s3.getSignedUrl(method_name, s3_params, function(err, data){
	        if(err){
	            console.log(err);
	            deff.reject(err);
	        } else {
	            var return_data = {
	                signed_request: data,
	                url: 'https://'+awsConfig.S3_BUCKET+'.s3.amazonaws.com/'+s3_params.Key
	            };
	            deff.resolve(return_data);
	            
	        }
	    });

	    return deff.promise;
	},
	copyS3Object:function(s3_object_source,s3_object_name,folder,opt){
		opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
		
		//copying
		console.log('copying.....');

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();
	    
	    if(folder && folder!='' && folder.slice(-1)!=='/'){
	    	folder=folder+'/';
	    }
	    else{
	    	folder=folder||'';
	    }

	    var s3_params =_.assign({
	    	CopySource:s3_object_source,
	        Key: (folder||'')+s3_object_name
	    },defaultS3Params);

	    console.log(s3_params);

	    //console.log(s3_params);
	    s3.copyObject(s3_params, function(err, data){
	        if(err){
	        	console.log('copy error ...');
	            console.log(err);
	            deff.reject(err);
	        } else {
	            var return_data = {
	                signed_request: data,
	                url: 'https://'+awsConfig.S3_BUCKET+'.s3.amazonaws.com/'+s3_params.Key
	            };
	            deff.resolve(return_data);
	            
	        }
	    });

	    return deff.promise;
	},
	moveS3Object:function(s3_object_source,s3_object_name,folder,opt){
		opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
		
		//copying
		console.log('copying.....');

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();

	    if(folder && folder!='' && folder.slice(-1)!=='/'){
	    	folder=folder+'/';
	    }
	    else{
	    	folder=folder||'';
	    }

	    var s3_params =_.assign({
	    	CopySource:defaultS3Params.Bucket+'/'+ s3_object_source,
	        Key: (folder||'')+s3_object_name
	    },defaultS3Params);

	    console.log(s3_params);

	    //console.log(s3_params);
	    s3.copyObject(s3_params, function(err, data){
	        if(err){
	        	console.log('copy error ...');
	            console.log(err);
	            deff.reject(err);
	        } else {
	        	var deleteParam=_.assign({
			    	Key: s3_object_source
			    },defaultS3PlainParams);

	        	service.deleteS3Object(s3_object_source).then(function(data){
	        		
		        		var return_data = {
			                data: data,
			                url: 'https://'+awsConfig.S3_BUCKET+'.s3.amazonaws.com/'+s3_params.Key
			            };
			            deff.resolve(return_data);
			        
	        	},function(err){

			        	console.log('delete error ...');
			            console.log(err);
			            deff.reject(err);
			        
	        	});

	        }
	    });

	    return deff.promise;
	},
	deleteS3Object:function(s3_object_source,folder){
		//opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
		//deleting
		console.log('deleting '+s3_object_source+'.....');

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();
	    if(folder && folder!='' && folder.slice(-1)!=='/'){
	    	folder=folder+'/';
	    }
	    else{
	    	folder=folder||'';
	    }
	   
    	var deleteParam=_.assign({
	    	Key: (folder||'')+s3_object_source
	    },defaultS3PlainParams);

    	s3.deleteObject(deleteParam,function(err,data){
    		if(err){
    			console.log('delete error');
    			console.log(err);
    			deff.reject(err);
    		} else {
    		
        		var return_data = {
	                data: data
	            };
	            deff.resolve(return_data);
	        }
    	});

    	return deff.promise;

	},
	putS3Object:function(data,s3_object_name,s3_object_type,folder,opt){
		opt=_.assign(opt||{},defaultS3Params);
		var deff=Q.defer();
		console.log('putS3Object');
		// console.log(awsConfig);

	    aws.config.update({
	        accessKeyId: awsConfig.AWS_ACCESS_KEY,
	        secretAccessKey: awsConfig.AWS_SECRET_KEY
	    });

	    var s3 = new aws.S3();

	    var s3_params =_.assign({
	        Key: (folder||'')+s3_object_name,
	        ContentType: s3_object_type,
	        Body:data
	    },defaultS3Params);

	    console.log(s3_params);

	    //console.log(s3_params);
	    s3.putObject(s3_params, function(err, data){
	        if(err){
	            console.log(err);
	            deff.reject(err);
	        } else {
	            var return_data = {
	                url: 'https://'+awsConfig.S3_BUCKET+'.s3.amazonaws.com/'+s3_params.Key
	            };
	            deff.resolve(return_data);
	            
	        }
	    });

	    return deff.promise;
	},
	getS3Object:function(s3_object_name,folder){
		return Q.Promise(function(resolve,reject){
			var s3_params =_.assign({
		        Key: (folder||'')+s3_object_name
		    },defaultS3PlainParams);
			
			aws.config.update({
		        accessKeyId: awsConfig.AWS_ACCESS_KEY,
		        secretAccessKey: awsConfig.AWS_SECRET_KEY
		    });
		    var s3 = new aws.S3();
		    var response=s3.getObject(s3_params,function(err,data){
		    	console.log('getObject complete');
		    	if(err){
		    		reject(err);
		    	}
		    	else{
		    		resolve(data);
		    	}
		    });
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
}    


var defaultS3Params={
	Bucket: process.env.S3_BUCKET,
    Expires: 60,
    ACL: 'private'
};
var defaultS3getParams={
	Bucket: process.env.S3_BUCKET,
    Expires: 60
}
var defaultS3PlainParams={
	Bucket: process.env.S3_BUCKET
};


var awsConfig={
		    AWS_ACCESS_KEY:process.env.AWS_ACCESS_KEY,
		    AWS_SECRET_KEY:process.env.AWS_SECRET_KEY,
		    S3_BUCKET : process.env.S3_BUCKET
  		};