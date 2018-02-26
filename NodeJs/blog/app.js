
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');//请求调用文件
//console.log("1"+routes); 输出内容为index 数据内容
//var user = require('./routes/user');P7暂时用不到
var http = require('http');
var path = require('path');
var MongoStore= require('connect-mongo')(express);
var settings= require('./routes/settings');
var flash= require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 8888);
//_dirname 设置views为存放视图文件夹,__dirname为全局变量,存放当前正在执行脚本目录
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');//设置视图引擎为ejs
app.use(express.favicon());// connect内建的中间件, 使用默认的facicon图标, 默认网站图标
app.use(flash());
//app.use(express.favicon(_dirname+'/public/images/favicon.ico'))//改为自己的图标放入images目录下
app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.bodyParser());// 相当于上面两句,用来解析请求体
app.use(express.bodyParser({keepExtension:true,uploadDir:'./public/images'}));
app.use(express.methodOverride());//协助处理post请求,伪装put,delete,http其他请求

//P20 //ｃｏｏｋｉｅ解析
app.use(express.cookieParser());
// session内容
app.use(express.session({
	secret:settings.cookieSecret, //防止篡改内容
	key:settings.db,// cookieName
	cookie:{maxAge:1000*60*60*24*30},//30day==time
	store:new MongoStore({
		url:'mongodb://'+settings.host+'/'+settings.db//存储位置成功!
		//mongooseConnection:settings.host
		//db:settings.db
	})
}));

app.use(app.router);//调用路由器解析规则

app.use(express.static(path.join(__dirname, 'public')));//将public设置为默认存放imgae,css,js等静态文件目录


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);
//== app.get('/',function(req,res){res.render('index',{title:'Express'});})
//这样做用app.get会导致模块的臃肿不太好,所有功能都集中在app里面了,所以删除上两句

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//index获取app参数,通过app.get调用index.ejs , 这里是直接调用了index 的默认无名函数
routes(app);