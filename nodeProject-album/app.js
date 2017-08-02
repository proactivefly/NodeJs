var express=require('express');

var app=express();
//导入路由配置
var router=require('./controller/route.js')

// 设置渲染模板引擎
app.set('view engine','ejs');

// 设置路由中间件，静态服务器
app.use(express.static('./public'));

//设置图片路由
app.use(express.static('./uploads'));

// 路由到首页
app.get('/',router.showIndex);
// 某一个相册
app.get('/:album',router.showAlbum);

//404页面
app.use(function(req,res){
    res.render('404');
})


// 监听
app.listen(3000);
console.log('正在监听端口');
