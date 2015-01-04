var cluster = require('cluster');
var os = require('os');
var debug = require('debug')('microblog');

// 获取CPU数量
var numCPUs = os.cpus().length;

var workers = {};
if (cluster.isMaster) {
	cluster.on('death', function (worker) {
		// 当一个工作进程结束时，重启工作进程
		delete workers[worker.pid];
		worker = cluster.fork();
		workers[worker.pid] = worker;
	});

	// 初始开启与CPU数量相同的工作进程
	for (var i = 0; i < numCPUs; i++) {
		var worker = cluster.fork();
		workers[worker.pid] = worker;
	}
}
else {
	// 工作进程分支
	var app = require('../app');
	app.set('port', process.env.PORT || 3000);
	var server = app.listen(app.get('port'), function() {
  		debug('Express server listening on port ' + server.address().port);
	});
}

// 当主进程被终止时，关闭所有工作进程
process.on('SIGTERM', function () {
	for (var pid in workers) {
		process.kill(pid);
	}
	process.exit(0);
})