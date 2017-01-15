var mongo = require("mongodb");
var client = mongo.MongoClient;

function checkPassword(name, pass) {
    console.log("checkPassword has require");
    client.connect("mongodb://alex:alex88@paulo.mongohq.com:10058/testDB", function (err, db) {
        if (err) {
            console.log("failed connect db");
        }
        db.collection("userstest", function (err, collection) {
            if (err) {
                console.log("missing data");
            }
            collection.find({
                name: name
            }).toArray(function (err, data) {
                console.log(data);
                data.forEach(function (i) {
                    if (i["pass"] === pass) {
                        console.log(i["pass"]===pass);
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        });
    });
}

exports.checkPassword = checkPassword;

console.log("util.js has require");