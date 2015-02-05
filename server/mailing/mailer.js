'use strict';
var nodeMailer=require('nodemailer'),
	_=require('lodash'),
	path=require('path'),
	fs=require('fs'),
	Q=require('q');


function getTemplateHtml(mailType){
	var templatePath=path.normalize(__dirname+'/templates/'+mailType+'.html');
	var content=fs.readFileSync(templatePath, 'utf8');
	return content;

}

function compileTemplate(model,mailType){
	
	var template=getTemplateHtml(mailType);
	var content=_.template(template,model,{interpolate: /\{\{(.+?)\}\}/g});
	// console.log('compiled content');
	// console.log(content);
	
	return content;

}


function createTransport(){
	var transportOption={
		host:process.env.SMTP_HOST,
		port:process.env.SMTP_PORT,
		auth:{
			user:process.env.SMTP_USERNAME,
			pass:process.env.SMTP_PASSWORD
		}
    
	};
	
	console.log('smtp');
	console.log(transportOption);
	var transporter=nodeMailer.createTransport(

	// sesTransport(
	transportOption
	// )
	);
	return transporter;
}

module.exports={

	sendEmail:function(mailOptions,model,mailType){
		var opt=_.assign(mailOptions||{},{
			from:process.env.FROM_ADDRESS,
			generateTextFromHTML: true
		});
		
		return Q.Promise(function(resolve,reject){

			// console.log('compiling template');
			// console.log(model);
			//deff.resolve();
			//return deff.promise;
			var mailContent=compileTemplate(model,mailType);
			var transporter=createTransport();
			opt.html=mailContent;

			// console.log('options');
			 console.log(opt);
			
			
			// awsConfig
			return transporter.sendMail(opt,function(err,result){
				transporter.close();
				console.log(err);
				console.log(result);
				if(err){
					reject(err,result);

				}
				else{
					resolve(result);
				}
			});
		
		});
	}
};
