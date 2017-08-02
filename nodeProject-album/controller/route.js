var file=require('../models/file.js');
//渲染首页
exports.showIndex=function(req,res){
	file.getAllAlbum(function(err,albums){
		//如果读取文件夹或文件有错误
		if(err){
			res.send(err);
			return;
		}
		//获取完数据之后在渲染，数据即为回调函数中的参数
		res.render('index',{
		'albums':albums
		});
	})
	
};
//遍历所有相册图片
exports.showAlbum=function(req,res){
	//获取相册名称
	var albumName=req.params.album;
	//调用models中方法。并传入相册名称albumName
	file.getALLJPG(albumName,function(err,imagesArray){
		if(err){
			res.send(err)
		}
		//渲染ablum页面，并传入参数
		res.render('album',{
			"albumname":albumName,
			"images":imagesArray
		})
	})
}
