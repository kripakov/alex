var http = require("http"),
    express = require('express'),
    path = require('path'),
    async = require("./public/js/async"),
    mapreduce = require('./public/js/mapreduce'),
    app = express(),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    underscore = require("underscore"),
    jsdom = require('jsdom');

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

/*function toArray(obj){ 
    return [].slice.call(obj) 
}*/
app.post("/login", function (req, res, next) {
    var name = req.body.username,
        pass = req.body.password,
        secondName = req.body.secondname;
    if (name) {
        eventEmitter.on('collectionUserChat', function (callback) {
            async.connectDB(function (db) {
                async.getCollection("userchat", db, function (collectionUserChat) {
                    async.find(collectionUserChat, function (rezult) {
                        async.toArray(rezult, function (data) {
                            data.forEach(function (i) {
                                callback(collectionUserChat, i);
                            });
                        });
                    })
                });
            });
        });


        async.connectDB(function (db) {
            async.getCollection('userstest', db, function (collectionUserTest) {
                async.find(collectionUserTest, function (rezult) {
                    async.toArray(rezult, function (data) {
                        data.forEach(function (i) {
                            collectionUserTest.find({
                                name: name,
                                secondName: secondName
                            }, function (err, rezultUserTest) {
                                rezultUserTest.toArray(function (err, items) {
                                    var p = underscore.pick(items[items.length - 1], 'pass');
                                    if (!err && items.length === 0) {
                                        console.log('not find object collection User Test');
                                        collectionUserTest.insert({
                                            name: name,
                                            secondName: secondName,
                                            pass: pass
                                        }, function (err, rezult) {
                                            if (!err) {
                                                //$('.container.auth').append($('<div/>').text('You are to registreted to chat ' + name + ' ' + secondName));
                                                res.render('chat', function (err, data) {
                                                    jsdom.env({
                                                        html: data,
                                                        scripts: ['http://code.jquery.com/jquery-1.9.1.min.js'],
                                                        done: function (err, window) {

                                                            $('body').append($('<div/>').text('Your to registreted to chat ' + name + ' ' + secondName));
                                                            res.write(window.document.innerHTML, "utf8");
                                                            res.end();
                                                        }
                                                    });
                                                });
                                            } else {
                                                $('body').append($('<div/>').text('Error to registreted to chat ' + name + ' ' + secondName));
                                            };
                                        });
                                    } else if (!err) {
                                        collectionUserTest.update({
                                            name: name,
                                            secondName: secondName
                                        }, {
                                            name: name,
                                            secondName: secondName,
                                            pass: pass
                                        }, function (err, rezultUpdate) {
                                            if (!err) {
                                                console.log('document has update');
                                                eventEmitter.emit('collectionUserChat', function (collectionUserChat, u) {
                                                    if (underscore.pick(items[items.length - 1], 'pass')['pass'] == pass) {
                                                        res.sendfile(__dirname + '/html/index.html', function (err, data) {
                                                            console.log(data);
                                                            jsdom.env({
                                                                html: data,
                                                                scripts: ['http://code.jquery.com/jquery-1.9.1.min.js'],
                                                                done: function (err, window) {

                                                                    var $ = window.$;
                                                                    //res.write(window.document.innerHTML, "utf8");
                                                                    //res.end();
                                                                    collectionUserChat.mapReduce(mapreduce.mapNameProf, mapreduce.reduce, {
                                                                        out: {
                                                                            inline: 1
                                                                        },
                                                                        verbose: true
                                                                    }, function (err, rezult, stats) {
                                                                        if (!err) {
                                                                            //console.log(rezult);
                                                                            //eventEmitter.on('getRezultMesssage',rezult);

                                                                            underscore.each(rezult, function (h) {
                                                                                //console.log(typeof h['_id']);//-->string
                                                                                $('.list-group').append($('<a/>', {
                                                                                    href: '#',
                                                                                    class: 'list-group-item'
                                                                                }).append($('<h4/>', {
                                                                                    class: 'list-group-item-heading'
                                                                                }).text(h['_id'])).append($('<p/>', {
                                                                                    class: 'list-group-item-text'
                                                                                }).text(h['value'])));
                                                                            });

                                                                            $('.auth').append($('<div/>').text('Welcome to chat ' + name + ' ' + secondName));
                                                                            res.write(window.document.innerHTML, "utf8");
                                                                            res.end();
                                                                        } else {
                                                                            console.log('error mapReduce name and prof');
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        res.render('error', function (err, data) {
                                                            jsdom.env({
                                                                html: data,
                                                                scripts: ['http://code.jquery.com/jquery-1.9.1.min.js'],
                                                                done: function (err, window) {
                                                                    var $ = window.$;

                                                                    res.write(window.document.innerHTML, 'utf8');
                                                                    res.end();
                                                                }
                                                            });
                                                        });
                                                    };
                                                });
                                            } else {
                                                console.log('error update');
                                            };
                                        });
                                    } else {
                                        //console.log('error');
                                    }
                                });
                            });
                        });
                    });
                });
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