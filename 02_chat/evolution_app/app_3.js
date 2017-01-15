var http = require("http"),
    express = require('express'),
    path = require('path'),
    async = require("./public/js/async"),
    mapreduce = require('./public/js/mapreduce'),
    app = express(),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    underscore = require("underscore"),
    jsdom = require('jsdom').jsdom;

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

app.use(express.favicon());

app.use(express.bodyParser());

app.use(express.cookieParser());

app.use(app.router);

app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendfile(__dirname + "/html/login.html");
});
app.post("/login", function (req, res, next) {
    var name = req.body.username,
        pass = req.body.password,
        secondName = req.body.secondname;
    if (name) {
        eventEmitter.on("collectionUserChat", function (callback) {
            async.connectDB(function (db) {
                async.getCollection("userchat", db, function (collectionUserChat) {
                    async.find(collectionUserChat, function (rezult) {
                        async.toArray(rezult, function (data) {
                            data.forEach(function (i) {
                                callback(collectionUserChat,i);
                            });
                        });
                    })
                });
            });
        });


        async.connectDB(function (db) {
            async.getCollection("userstest", db, function (collectionUserTest) {
                async.find(collectionUserTest, function (rezult) {
                    async.toArray(rezult, function (data) {
                        data.forEach(function (i) {
                            console.log(i);
                            eventEmitter.emit("collectionUserChat", function (collectionUserChat,u) {
                                if (i["pass"] == pass) {
                                    res.render("chat", function (err, data) {
                                        jsdom.env({
                                            html: data,
                                            scripts: ["http://code.jquery.com/jquery-1.9.1.min.js"],
                                            done: function (err, window) {
                                                var $ = window.$;
                                                collectionUserChat.mapReduce(mapreduce.mapNameProf, mapreduce.reduce, {
                                                    out: {
                                                        inline: 1
                                                    },
                                                    verbose: true
                                                }, function(err, rezult, stats) {
                                                    if (!err) {
                                                        //console.log(rezult);
                                                        for (var i = 0; i < rezult.length; i++) {
                                                            $('.list-group').append($('<a/>', {
                                                                href: "#",
                                                                class: "list-group-item"
                                                            }).append($("<h4/>", {
                                                                class: "list-group-item-heading"
                                                            }).text(rezult[i]['_id'])).append($("<p/>", {
                                                                class: "list-group-item-text"
                                                            }).text(rezult[i]['value'])));    
                                                        };
                                                            res.write(window.document.innerHTML, "utf8");
                                                            res.end(); 
                                                    } else {
                                                        console.log('error mapReduce name and prof');
                                                    };
                                                });
                                                
                                                collectionUserTest.mapReduce(mapreduce.mapNameSecondName,mapreduce.reduce,{
                                                    out: {
                                                        inline:1
                                                    },
                                                    verbose:true
                                                },function(err,rezult,stats){
                                                    if(!err){
                                                        console.log(rezult);

                                                        collectionUserTest.find({
                                                            name:name,
                                                            secondName:secondName
                                                        },function(err,rezultUserTest){
                                                            if (!err) {
                                                                console.log('user has been');
                                                                $('.container.auth').append($('<div/>').text('Welcome to chat ' + name + ' ' + secondName));
                                                            } else{
                                                                console.log('not find object collection User Test');
                                                                collectionUserTest.insert({
                                                                    name:name,
                                                                    secondName:secondName,
                                                                    pass:pass
                                                                },function(err,rezult){
                                                                    if (!err) {
                                                                        $('.container.auth').append($('<div/>').text('You are to registreted to chat ' + name + ' ' + secondName));
                                                                    } else{

                                                                    };
                                                                });
                                                            };
                                                        });  
                                                    }else{
                                                        console.log('error mapReduce name and SecondName');
                                                    }
                                                });
                                            }
                                        });
                                    });
                                } else {
                                    res.render("error", function (err, data) {
                                        jsdom.env({
                                            html: data,
                                            scripts: ["http://code.jquery.com/jquery-1.9.1.min.js"],
                                            done: function (err, window) {
                                                var $ = window.$;

                                                res.write(window.document.innerHTML, "utf8");
                                                res.end();
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    });
                })
            });
        });
    }
});

var server = require("http").createServer(app),
    io = require("socket.io").listen(server);

server.listen(8081);
io.sockets.on("connection", function (socket) {
    console.log("socket has connect");
    socket.on("getField", function (field) {
        //console.log(field, " ", typeof field);
    });
});

console.log("Express server has started in localhost 8081");