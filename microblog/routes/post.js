var express = require('express');
var router = express.Router();
var User = require('../bin/models/user');
var Post = require('../bin/models/post');
var check = require('./check');

/* POST user blog. */
router.post('/',check.checkLogin);
router.post('/', function(req, res) {
	var currentUser = req.session.user;
	var post = new Post(currentUser.name, req.body.post);
	post.save(function(err) {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('/');
		};

		req.flash('success', '发表成功');
		res.redirect('/users/' + currentUser.name);
	})
});

module.exports = router;
