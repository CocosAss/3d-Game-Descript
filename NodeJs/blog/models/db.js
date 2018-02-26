/**
 * Created by Mr.J&W on 2017/10/10.
 */
var settings = require('../routes/settings'),
	Db=require('mongodb').Db,
	Connection= require('mongodb').Connection,
	Server=require('mongodb').Server;
module.exports=new Db(settings.db,new Server(settings.host,27017),{safe:true});

