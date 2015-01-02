var express = require('express');
var router = express.Router();
var User = require('../bin/models/user');
var Post = require('../bin/models/post');
var check = require('./check');

/* GET users listing. */
router.get('/:user', check.checkLogin);
router.get('/:user', function(req, res) {
	User.get(req.params.user, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		};

		Post.get(user.name, function(err, posts) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			};

			res.render('user', {
				title: user.name,
				posts: posts,
				user: res.locals.user,
				error: res.locals.error,
				success: res.locals.success
			});
		});
	});
});

module.exports = router;
