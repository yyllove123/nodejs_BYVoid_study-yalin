var settings = require('../setting');
// var Db = require('mongodb').db;
var Connection = require('mongodb').Connection; 
// var Server = require('mongodb').Server;

var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;

var mongo = new MongoClient(new Server(settings.host, Connection.DEFAULT_PORT));

MongoClient.prototype.getMicroblogDB = function () {
	return this.db(settings.db);
};

module.exports = mongo;

// module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));