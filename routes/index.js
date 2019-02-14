var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var multer  =   require('multer');

var router = express.Router();

var User = require('../models/user');

var storage = multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,'./public/uploads');
	},
    filename:function(req,file,callback){
    	callback(null,file.fieldname+'-'+ file.originalname.replace(path.extname(file.originalname), '_') +'-' +Date.now() +  path.extname(file.originalname));
    }
});

var upload = multer({ storage:storage });

router.get('/',function(req,res){
	res.render('index',{title:'image and text uplaod to mongodb'});
});



router.post('/photo',upload.single('userPhoto'),function(req,res){
	
	var newUser = new User();
	newUser.name = req.body.name;
	newUser.photo = req.file.path;
	
	newUser.save(function(err,user){
		if(err)
			res.json({message:err});
		
		res.json(user);
		console.log('Uploade Successful ', req.file, req.body);
		
	});

});

router.get('/users',function(req,res){
	User.find({},function(err,user){
		if(err)
			res.json(err);
		
		res.json(user);
	});
});

module.exports = router;