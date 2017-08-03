var file = require("../models/file.js");
var formidable = require('formidable');
var path = require("path");
var fs = require("fs");
var sd = require("silly-datetime");

//首页
exports.showIndex = function(req,res,next){
    //错误的：传统思维，不是node的思维：
    //res.render("index",{
    //    "albums" : file.getAllAlbums()
    //});

    //这就是Node.js的编程思维，就是所有的东西，都是异步的
    //所以，内层函数，不是return回来东西，而是调用高层函数提供的
    //回调函数。把数据当做回调函数的参数来使用。
    file.getAllAlbums(function(err,allAlabums){
        //err是字符串
        if(err){
            next(); //交给下面适合他的中间件
            return;
        }
        res.render("index",{
            "albums" : allAlabums
        });
    })
}

//相册页
exports.showAlbum = function(req,res,next){
    //遍历相册中的所有图片
    var albumName = req.params.albumName;
    //具体业务交给model
    file.getAllImagesByAlbumName(albumName,function(err,imagesArray){
        if(err){
            next(); //交给下面的中间件
            return;
        }
        res.render("album",{
            "albumname" : albumName,
            "images" : imagesArray
        });
    });
};

//显示上传
exports.showUp = function(req,res){
    //命令file模块（我们自己写的函数）调用getAllAlbums函数
    //得到所有文件夹名字之后做的事情，写在回调函数里面
    file.getAllAlbums(function(err,albums){
        res.render("up",{
            albums : albums
        });
    });
};

//上传表单方法
exports.doPost = function(req,res){
    //获得formidable
    var form = new formidable.IncomingForm();
    //上传的图片储存的临时路径
    form.uploadDir = path.normalize(__dirname + "/../tempup/");
    //读取选择上传的文件，fields包含页面上传来的所有
    form.parse(req, function(err, fields, files,next) {
        //用户选取的字段类型
        console.log(fields);
        console.log('---------------');
        //上传的文件信息
        console.log(files);
        //修改文件名称
        if(err){
            next();     //这个中间件不受理这个请求了，往下走
            return;
        }
        //判断文件尺寸
        var size = parseInt(files.tupian.size);
        if(size > 99990){
            res.send("图片尺寸应该小于1M");
            //删除图片
            fs.unlink(files.tupian.path);
            return;
        }
        //上传时间
        var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
        //随机数
        var ran = parseInt(Math.random() * 89999 + 10000);
        //从路径中返回扩展名
        var extname = path.extname(files.tupian.name);
        //需要上传的文件夹
        var wenjianjia = fields.wenjianjia;
        //图片原始路径
        var oldpath = files.tupian.path ;
        //图片新路径
        var newpath = path.normalize(__dirname + "/../uploads/" + wenjianjia + "/" + ttt + ran + extname);
        //修改图片名称，顺便可以调换文件夹
        fs.rename(oldpath,newpath,function(err){
            if(err){
                res.send("改名失败");
                return;
            }
            res.send("成功");
        });
    });
    return;
}