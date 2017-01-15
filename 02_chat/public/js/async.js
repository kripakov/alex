var mongo = require("mongodb"),
    client = mongo.MongoClient;

function connectDB(callback) {
    //mongodb://alex:alex88@paulo.mongohq.com:10058/testDB
    //mongodb://localhost:27017/test
    client.connect('mongodb://localhost:27017/test', function (err, db) {
        if (err) {
            console.log("failed connect");
        }
        callback(db);
    });
}

function getCollection(name, db, callback) {
    db.collection(name, function (err, collection) {
        if (err) {
            console.log("missing data");
        }
        callback(collection);
    });
}

function find(collection, callback) {
    collection.find(function (err, rezult) {
        if (err) {
            console.log("can not find field");
        }
        callback(rezult);
    });
}

function toArray(rezult, callback) {
    rezult.toArray(function (err, data) {
        if (err) {
            console.log("err array");
        }
        callback(data);
    });
}

function forEach(data, callback) {
    data.forEach(function (i) {
        callback(i);
    });
}

function closeDB(db) {
    db.close(function (err, rezult) {
        if (err) {
            console.log("can not close connect");
        } else {
            console.log(rezult);
        }
    });
}

function mapReduce(collection, map, reduce, objParam, callback) {
	console.log('mapReduce has require');
    collection.mapReduce(map, reduce, objParam, function (err, rezult, stats) {
        //console.log(rezult);
        var t = [];
        for (var i = 0; i < rezult.length; i++) {
            t.push(rezult[i]['_id']);
        };

        for (var d = 0; d < t.length; d++) {
        	callback(t[d]);
        };
    });
}

exports.connectDB = connectDB;
exports.getCollection = getCollection;
exports.find = find;
exports.toArray = toArray;
exports.forEach = forEach;
exports.closeDB = closeDB;
exports.mapReduce = mapReduce;

console.log("async has require");