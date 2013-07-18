//
//
//
//  Todo !
//
//
//

var mongodb = require('mongodb');
var mongourl = '';

function appendItem(record) {
	mongodb.connect(mongourl, function(err, conn){
		conn.collection('DataArray', function(err, coll){
			coll.
		});
	});
}


function save(root) {
	var ret = false;
	mongodb.connect(mongourl, function(err, conn) {
		conn.collection('root', function(err, coll){
			coll.update({
				item:'SAVEDATA'
			}, {
				data: root,
				time: new Date()
			}, {
				safe: true
			}, function(err) {
				if(err) {
					;	// todo
				} else {
					ret = true;
					console.log('save success!');
					;	// todo
				}
			})
		});
	});
	return ret;
}

function read(root) {
	var ret = false;
	mongodb.connect(mongourl, function(err, conn) {
		conn.collection('root', function(err, coll){
			coll.find({
				item:'SAVEDATA'
			}, {
				data: 1
			}, function(err, cursor) {
				cursor.toArray(function(err, items){
					root = items[0];
					console.log('read success!');
					console.log(root.find('abcd'));
					ret = true;
				});
			});
		});
	});
	return ret;
}

exports.write = save;
exports.read = read;