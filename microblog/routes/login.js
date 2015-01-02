var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../bin/models/user');

var check = require('./check');

router.get('/',check.checkNotLogin);
router.get('/', function(req, res) {
	res.render('login', {
		title: '用户登录',
		user: res.locals.user,
		error: res.locals.error,
		success: res.locals.success
	});
});

/* POST user blog. */
router.post('/',check.checkNotLogin);
router.post('/', function(req, res) {
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	User.get(req.body.username, function(err, user) {
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/login');
		}

		if (user.password != password) {
			req.flash('error', '密码错误');
			return res.redirect('/login');
		}

		req.session.user = user;
		req.flash('success', '登入成功');
		res.redirect('/');
	});
});

module.exports = router;