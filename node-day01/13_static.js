var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");

http.createServer(function(req,res){
	//得到用户访问的路径名
	var pathname = url.parse(req.url).pathname;
	//设置默认首页
	if(pathname == "/"){
		pathname = "index.html";
	}
	//读取拓展名
	var extname = path.extname(pathname);

	//真的读取这个文件，默认加上static
	fs.readFile("./static/" + pathname,function(err,data){
		//判断页面没有找到
		if(err){
			//如果此文件不存在，就应该用404返回,读取404页面
			fs.readFile("./static/404.html",function(err,data){
				res.writeHead(404,{"Content-type":"text/html;charset=UTF8"});
				res.end(data);
			});
			return;//---------------------重要
		};
		//MIME类型，就是
		//网页文件：  text/html
		//jpg文件 :   image/jpg
		var mime = getMime(extname);
		res.writeHead(200,{"Content-type":mime});
		res.end(data);
	});

}).listen(3000,"127.0.0.1");

function getMime(extname){
	switch(extname){
		case ".html" :
			return "text/html";
			break;
		case ".jpg" : 
			return "image/jpg";
			break;
		case ".css":
			return "text/css";
			break;
	}
}