var express = require('express');
var router = express.Router();
var User = require('../bin/models/user');
var Post = require('../bin/models/post');

/* GET home page. */
router.get('/', function(req, res) {
	Post.get(null, function(err, posts) {
		if (err) {
			posts = [];
		};

		res.render('index', { 
		  	title: '首页',
		  	posts: posts,
		  	user: res.locals.user,
			error: res.locals.error,
			success: res.locals.success
	  	});
	})
  
});

module.exports = router;
