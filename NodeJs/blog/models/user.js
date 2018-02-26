/**
 * Created by Mr.J&W on 2017/10/17.
 */
var mongodb =require('./db');

function User(user)
{
	this.name= user.name;
	this.password=user.password;
	this.email=user.email;
};

module.exports =User;//输出当前用户
//存储用户信息
User.prototype.save = function(callback){
	var  user={
		name:this.name,
		password:this.password,
		email:this.email
	};
//	console.log(user.password);
	//打开数据库
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err); //返回错误信息
		}
		//读取users 集合, callback 返回数据
		db.collection('users',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err);
			}

			collection.insert(user,{
					safe:true},
				function(err,user)
				{
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null,user[0]);//成功,返回err为null并返回存储后的用户档
				});
		});
	});
};

User.get=function(name,callback)
{
	//打开数据库
	mongodb.open(function(err,db){
	if(err)
	{
		return callback(err);
	}
		db.collection('users',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
					name:name
				},
				function(err,user){
					mongodb.close();
					if(err){
						return callback(err);
					}
					//var oldUser= new User(user);
					callback(null,user);//成功
				});
		});
});
};
