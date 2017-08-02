var fs=require('fs');
//获取所有相册信息
exports.getAllAlbum=function(callback){
	// 读取uploads文件夹下所有文件
	fs.readdir('./uploads',function(err,files){
		//如果读取文件夹有错误，上传错误
		if(err){
			callback('没有找到uploads文件夹',null);
		};
		var albums=[];
		(function iterator(i){
			// 如果遍历所有文件，那么return
			if(i==files.length){
				console.log('下边是相册集');
				console.log(albums);
				//如果没错误,读取完之后把参数传送过去
				callback(null,albums);
				return;
			};
			// 判断uploads文件夹下第i个文件files[i]
			fs.stat('./uploads/'+files[i],function(err,stats){
				//如果读取文件有错误，上传错误
				if(err){
					callback('找不到文件'+files[i],null)
				}
				// 判断文件是否为文件夹，是的push到ablums中
				if(stats.isDirectory()){
					albums.push(files[i]);
				};
				// 调用外层函数判断第二个文件
				iterator(i+1);
			});

		})(0);
	})
};
//通过文件夹名得到所有图片
exports.getALLJPG=function(albumName,callback){
	fs.readdir("./uploads/"+albumName,function(err,files){
		if(err){
			callback('没有找到文件夹'+albumName,null);
		};
		var imagesArray=[];
		(function iterator(i){
			//判断是否读取完，如果读取完成，则调用回调函数，把数据作为参数返回；
			if(i==files.length){
				callback(null,imagesArray);
				console.log(imagesArray);
				return;
			}
			//读取文件默认--------------------------------------------------
			fs.stat('./uploads/'+albumName+"/"+files[i],function(err,stats){
				if(err){
					callback('读取文件失败'+files[i],null);
				};
				//如果是文件，就push到images数组里
				if(stats.isFile()){
					imagesArray.push(files[i]);
				}
				//调用外层函数，实现递归
				iterator(i+1);
			});

		})(0)
	})
}
