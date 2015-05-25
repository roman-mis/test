
var fs = require('fs');
var path = require('path');

var wrappedFiles = [];

module.exports = function wrapJs(source_file){
	if(!global.DEBUG_TEST) return source_file;
	
	var tmp_path = path.dirname(source_file)+'/.tmp_'+path.basename(source_file);
	
	fs.writeFileSync(tmp_path, fs.readFileSync(source_file).toString().replace(/\/\/\!([^\r?\n]+)/g, function(m, p0){
		return 'helper.printStage(' + p0 + ');';
	}));
	
	wrappedFiles.push(tmp_path);
	
	return tmp_path;	
};

module.exports.wrapper = function(x){
	return module.exports(x);
};

process.on('exit', function(){
	wrappedFiles.forEach(function(file){
		try {
			fs.unlinkSync(file);
		} catch(e) { }
	});
}); 

// TODO: catch "sigint" (Ctrl+C) and remove tmp files too
