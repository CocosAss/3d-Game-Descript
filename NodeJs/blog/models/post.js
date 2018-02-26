/**
 * Created by Mr.J&W on 2017/10/25.
 */
var mongodb = require('./db');
markdown = require('markdown').markdown;

function Post(name, title,post)
{
	this.name = name;
	this.title=title;
	this.post = post;
}
//导出内容
module.exports= Post;

Post.prototype.save = function(callback)
{
	var date = new Date();
	// 存储各种时间格式,方便以后扩展,存储形式为String
	var time= {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+(date.getMonth()+1),
		day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
		// 判断minute是否大于十分钟,如果小于十分钟以0x格式保存
		minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+""+date.getHours()+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()),
	};

	var post ={
		name:this.name,
		time:time,
		title:this.title,
		post:this.post
	};

	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//将文档插入posts集合
			collection.insert(post,{
				safe:true
			},function (err){
				mongodb.close();
				if(err)
				{
					return callback(err);
				}
				callback(null);// 插入成功
			});
		});
	});
};

Post.get=function(name,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
//创建数组
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err);
			}
			var query={};
			if(name){
				query.name=name;
			}
			//根据query对象查询文章
			collection.find(query).sort({
				time:-1                 // time=-1查询条件是什么??
			}).toArray(function(err,docs){
				mongodb.close();
				if(err)
				{
					return callback(err);
				}
				docs.forEach(function(doc){
					doc.post = markdown.toHTML(doc.post);
				})
				callback(null,docs); //成功,返回数组查询内容
			});
		});
	});
};