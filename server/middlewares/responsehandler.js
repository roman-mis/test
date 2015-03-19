'use strict';
module.exports=function(app){

	function getResponseMessage(response){
		if(app.get('env') === 'development'){
			return response.message;
		}
		else{
			return 'Something went wrong';
		}
	}
	function getResponseDetail(response){
		if(app.get('env') === 'development'){
			return response.detail;
		}
		else{
			return '';
		}
	};

	return function(req,res,next){
		// console.log('checking sendFailureResponse function');
		// console.log(res.sendFailureResponse);
		//console.log('middleware function called ');
		res.sendFailureResponse=function(response){
			//console.log('sendFailureResponse method called');
			//console.log(response);
			if(response){
				console.log('--------------------error-----------------');
				console.log(response);
				if(response.name){
					if(response.name==='ModelValidationError'||response.name==='ValidationError'){
						return res.status(400).json(
							{
								result:false,
								type:'ValidationFailure',
								validationErrors:response.errors
							});

					}
					else if(response.name==='DuplicateRecordExists'){
						return res.status(400).json({
							result:false,
							type:'DuplicateRecordExists',
							message:response.message,
							detail:getResponseDetail(response)
						});
					}
					else if(response.name==='SequelizeDatabaseError'){
						return res.status(500).json({
							result:false,
							type:'ServerError',
							message:getResponseMessage(response)
						});
					}
					else if(response.name==='NotFound'){
						return res.status(404).json({
							result:false,
							type:'NotFound',
							message:response.message,
							detail:getResponseDetail(response)
						});
					}
					else if(response.name==='Unauthorized'){
						return res.status(401).json({
							result:false,
							type:'Unauthorized',
							message:response.message,
							detail:getResponseDetail(response)
						});
					}
					else if(response.name==='InvalidLogin'){
						return res.status(400).json({
							result:false,
							type:'InvalidLogin',
							message:response.message,
							detail:getResponseDetail(response)
						});
					}
					else if(response.name==='CastError' && response.type && response.type==='ObjectId'){
						return res.status(400).json({
							result:false,
							type:'InvalidId',
							message:'Invalid Id',
							detail:getResponseDetail(response)
						});
					}
				}


				res.status(400).json({result:false,message:response.message||'Unknown',response:response});
			}
			else{
				res.status(400).json({result:false});
			}

		};

		next();
	};

};
