var express = require('express');
var router = express.Router();
var util = require('util');
var crypto = require('crypto');
var User = require('../bin/models/user');
var check = require('./check');

router.get('/',check.checkNotLogin);
router.get('/', function(req, res) {

	// console.log('User register' + res.locals);
	res.render('reg', {
		title: '用户注册',
		user: res.locals.user,
		error: res.locals.error,
		success: res.locals.success
	});
});

/* POST user blog. */
router.post('/',check.checkNotLogin);
router.post('/', function(req, res) {
	// 检测用户两次口令是否一致
	if (req.body['password-repeat'] != req.body['password']) {
		req.flash('error', '两次输入的口令不一致');
		return res.redirect('/reg');
	};

	//生成口令的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newUser = new User({
		name: req.body.username,
		password: password,
	});

	User.get(newUser.name, function(err, user) {
		if (user) {
			err = 'Username already exists.';
		};

		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}

		// 如果不存在则新增用户
		newUser.save(function(err) {
			if (err) {
				req.flash('error', err);
			}
			req.session.user = newUser;
			req.flash('success', '注册成功');
			res.redirect('/');
		});
	});
});

module.exports = router;