
/*
 * GET home page.
 */

var crypto = require('crypto'); // 引入crypto模块, 核心模块,生成散列值来加密密码
User= require('../models/user.js');// 请求user.js用户模型数据
Post=require('../models/post.js');

/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/
//P7修改内容  // 调用routes
module.exports=function(app) // 导出函数接口,通过routes调用了index.js
{
  /*
  app.get('/',function(req,res){
    res.render('index',{title:'Express'});
  });
  //添加一条新的路由规则
  app.get('/newblogmesWeb',function(req,res){
	 res.send("Hello World!"); 
  });
*/
  //P16搭建blog,在这里我们更改了我们的title header中的title内容参数
  //req.body 是post 请求信息解析后的对象,
  app.get('/',function(req,res){
      Post.get(null,function(err,posts){
         if(err){
             posts=[];
         }
    res.render('index',{
        title:'主页',
        user:req.session.user, // 读取user数据内容,查看是否含有user数据
        posts:posts,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
          console.log(req.session.user);
  });
  });
    //检查是否没有登录
    app.get('/reg',checkNotLogin);
  app.get('/reg',function(req,res){
    res.render('reg',{
        title:'注册',
        user:req.session.user,// 是否成功注册
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
  });
    app.post('/reg',checkNotLogin);
  //在注册页获取post信息后
  app.post('/reg',function(req,res){
      var name = req.body.name,
          password = req.body.password,
          password_re =req.body['password-repeat'];

    if(password!=password_re)
    {
      req.flash('error','两次输入的代码不一致');
     // console.log(password);
    // alert("");//用Node.js单独运行js文件时，其中定义的alert不可用,
      return res.redirect('/reg');//返回注册页
    }

    //生成密码md5 值
    var md5 = crypto.createHash('md5'),
        password=md5.update(req.body.password).digest('hex');

    req.body.password= password;
      console.log(req.body.password);
    //生成新的用户数据新型保存
    var newUser = new User({
      name:req.body.name,
      password:req.body.password,
      email:req.body.email
    });
    console.log(newUser);
    //检查用户名是否存在 . User.get方法获取数据库中信息
   User.get(newUser.name,function(err,user){
          if(user){
          req.flash('error','用户已存在');
          return res.redirect('/reg');//返回注册页
        }
       console.log("safe passed");
      newUser.save(function(err,user){
        if(err)
        {
          req.flash('error',err);
          return res.redirect('/reg');//返回注册页
        }
        req.session.user=newUser;//用户信息注册,添加在session中
        req.flash('success','注册成功');
        res.redirect('/');//注册成功后返回主页, 这句没问题

      });
    });
  });
    app.get('/login',checkNotLogin);
    // 登出与登录
  app.get('/login',function(req,res){
      res.render('login',{
          title:'登录',
          user:req.session.user, // 读取user数据内容
          success:req.flash('success').toString(),
          error:req.flash('error').toString()
      });
  });
    app.post('/login',checkNotLogin);
  app.post('/login',function(req,res){
      //密码加密 , md5 加密的生成码针对相同的字符串是相同的
      var md5= crypto.createHash('md5'),
          password = md5.update(req.body.password).digest('hex');
      //check the user if not exist
      User.get(req.body.name,function(err,user)
      {//返回user= NULL
          if(!user)
          {
              req.flash('error','用户不存在');
              return　res.redirect('/login');// 用户不存在则跳转登录页
          }
          console.log(password);
          //检查密码是否一致
          if(user.password!=password)
          {
              req.flash('error','密码错误');
              return res.redirect('/login');
          }

          //用户密码都匹配之后, 将用户信息存入session
          req.session.user=user;
          req.flash('success','登录成功');
          res.redirect('/');//跳转
      });

  });
    app.get('/post',checkLogin);
  app.get('/post',function(req,res){
      res.render('post',{
          title:'发表文章',
          user:req.session.user, // 读取user数据内容
          success:req.flash('success').toString(),
          error:req.flash('error').toString()
      });
  });
    app.post('/post',checkLogin);
  app.post('/post',function(req,res){
      var currentUser=req.session.user,
          post = new Post(currentUser.name,req.body.title,req.body.post);
      post.save(function(err){
          if(err){
              req.flash('error',err);
              return res.redirect('/');
          }
          req.flash('success','发布成功!');
          res.redirect('/');
      });
  });
    app.get('/logout',checkLogin);
  app.get('/logout',function(req,res){
        req.session.user= null;
      req.flash('success','登出成功');
      res.redirect('/'); //退出登录
  });

    app.get('/upload',checkLogin);
    app.get('/upload',function(req,res){
        res.render('upload',{
            title:'文件上传',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });


};

function checkLogin(req,res,next)
{
    if(!req.session.user){
        req.flash('error',"未登录");
        res.redirect('/login');
    }
    next();
}

function checkNotLogin(req,res,next)
{
    if(req.session.user){
        req.flash('error','已登陆');
        res.redirect('back');// 返回之前的页面
    }
    next();
}


//app.get('env'){}
//app.get('/',routes.index) 当用户访问主页时,通过routes/index.js
//res.render使用ejs引擎解析views/index.ejs,之前通过 app.use('views',_dirname+'/views'),
//设定好了模版文件默认位置, views index.ejs 就是一个模版文件