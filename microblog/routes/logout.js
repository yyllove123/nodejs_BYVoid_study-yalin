var express = require('express');
var router = express.Router();
var check = require('./check');

router.get('/',check.checkLogin);
/* GET user blog. */
router.get('/', function(req, res) {
	req.session.user = null;
	req.flash('success', '登出成功');
	res.redirect('/');
});

module.exports = router;