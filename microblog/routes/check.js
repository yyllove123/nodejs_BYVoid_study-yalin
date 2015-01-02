var express = require('express');
var crypto = require('crypto');
var User = require('../bin/models/user');
var router = express.Router();

exports.checkLogin = function(req, res, next) {
	if (!req.session.user) {
			req.flash('error', '未登录');
			return res.redirect('/login');
	}
	next();
};

exports.checkNotLogin = function(req, res, next) {
	if (req.session.user)
	{
		req.flash('error', '已登入');
		return res.redirect('/');
	}
	next();
}