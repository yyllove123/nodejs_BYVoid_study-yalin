var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
};

module.exports = User;

User.prototype.save = function save(callback) {
	// 存入MongoDb的文档

	var user = {
		name: this.name,
		password: this.password,
	};

	mongodb.open(function(err, db) {
		if (err){
			return callback(err);
		}

		// 读取 users 集合
		db.db('microblog').collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
			}

			// 为name家索引
			collection.ensureIndex('name', {unique: true}, function (err, indexName) {
				console.log(err + indexName);
			});

			// 写入 user 文档
			collection.insert(user, {safe: true}, function(err, user) {
				mongodb.close();
				callback(err, user);
			});
		});
	});
};

User.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.db('microblog').collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			};

			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();

				if (doc) {
					var user = new User(doc);
					callback(err, user);
				}
				else {
					callback(err, null);
				}
			});
		});
	});
};