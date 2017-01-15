var http = require('http'),
    express = require('express'),
    path = require('path'),
    async = require('./public/js/async'),
    asyncCollection = require('async'),
    mapreduce = require('./public/js/mapreduce'),
    app = express(),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    underscore = require('underscore'),
    jsdom = require('jsdom').jsdom,
    fs = require('fs');
jqueryLocal = fs.readFileSync('public/js/jquery-1.9.1.min.js'),
jQueryModal = require('jquery');

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

app.use(express.favicon());

app.use(express.bodyParser());

app.use(express.cookieParser());

app.use(app.router);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/html/login2.html');
});

var dataUserChat;
app.post('/login', function (req, res, next) {
    var name = req.body.username,
        pass = req.body.password,
        secondName = req.body.secondname;
    dataUserChat = name + ' ' + secondName;
    //console.log(dataUserChat);
    //console.log(pass);
    //console.log(name);
    asyncCollection.parallel([

    function (callback) {
        async.connectDB(function (db) {
            async.getCollection('userchat', db, function (collectionUserChat) {
                collectionUserChat.find({
                    name: {
                        $ne: dataUserChat
                    }
                }, function (err, results) {
                    if (!err) {
                        results.toArray(function (err, docs) {
                            if (!err) {
                                //console.log(docs);
                                callback(null, docs);
                            } else {
                                console.log(err);
                            }

                        });
                    } else {
                        console.log(err);
                    }
                });
            });
        });
    },

    function (callback) {
        async.connectDB(function (db) {
            async.getCollection('userstest', db, function (collectionUserTest) {
                collectionUserTest.find({
                    name: name
                }, function (err, rezultUserTest) {
                    if (!err) {
                        rezultUserTest.toArray(function (err, data) {
                            var dataUser;
                            underscore.each(data, function (element) {
                                //console.log(element['pass']);//-->work
                                dataUser = element;
                            });

                            //console.log(!err && data.length === 0);
                            //console.log(data.length);
                            if (!err && data.length === 0) {
                                collectionUserTest.insert({
                                    name: name,
                                    secondName: secondName,
                                    pass: pass
                                }, function (err, rezult) {
                                    if (!err) {
                                        console.log(rezult);
                                        res.render('chat', function (err, data) {
                                            jsdom.env({
                                                html: data,
                                                scripts: ['http://code.jquery.com/jquery-1.9.1.min.js'],
                                                done: function (err, window) {
                                                    var jQuery = window.$;

                                                    jQuery('.container.auth').append(jQuery('<div/>').text('You are to registreted to chat ' + name + ' ' + secondName));
                                                    res.write(window.document.innerHTML, 'utf8');
                                                    res.end();
                                                }
                                            });
                                        });
                                    }
                                });
                            } else {
                                console.log('empty user in db');
                            }
                            callback(null, dataUser);
                        });
                    } else {
                        console.log('can not find' + name);
                    }
                });
            });
        });}, 
    function (callback) {
        async.connectDB(function (db) {
            async.getCollection('userrooms', db, function (collectionUserRooms) {
                collectionUserRooms.find({}, function (err, resultUserRooms) {
                    if (!err) {
                        resultUserRooms.toArray(function (err, data) {
                            underscore.each(data,function(el){
                                eventEmitter.emit('rooms',el.room);
                            });
                            callback(null, data);
                        });
                    } else {
                        console.log('error collection Users Rooms');
                    }
                });
            });
        });
    }],

    function (err, results) {
        if (err) {
            console.log(err);
        } else {
            //console.log(results);
            //console.log(results[1]['name'],results[1]['pass']);//-->alex
            //console.log(Object.prototype.toString.call(results));//-->[object Array]
            //console.log(results[1]['name'] === name && results[1]['pass'] === pass);
            //console.log(results[2]);
            if (results[1]['name'] === name && results[1]['pass'] === pass) {
                res.render('chat', function (err, data) {
                    if (!err) {
                        jsdom.env({
                            html: data,
                            scripts: ['http://code.jquery.com/jquery-1.11.0.min.js'],
                            done: function (err, window) {
                                var $ = window.$;

                                var restDataRoomsF = underscore.rest(results[2]);

                                if (!err) {
                                    /*underscore.each(restDataRoomsF,function(el){
                                        underscore.each(results[0],function(elRooms,i){
                                            //console.log(el['room']);
                                            //console.log('elRooms //',elRooms);
                                            console.log('#' + el.room);
                                            $('#' + el.room).append($('<li/>').append($('<a/>', {
                                                href: '#b' + i,
                                                    'data-toggle': 'tab'
                                            }).append($('<p/>').text(elRooms.name))
                                                .append($('<p/>').text(elRooms.prof))));

                                            $('.tab-content').append($('<div/>', {
                                                class: 'tab-pane',
                                                id: 'b' + i
                                            }));
                                        });
                                    });*/
                                    for (var i = 0; i < results[0].length; i++) {
                                        $('#listUsersBD').append($('<li/>').append($('<a/>', {
                                            href: '#b' + i,
                                            'data-toggle': 'tab'
                                        }).append($('<p/>').text(results[0][i]['name']))
                                            .append($('<p/>').text(results[0][i]['prof']))));

                                        $('.tab-content').append($('<div/>', {
                                            class: 'tab-pane',
                                            id: 'b' + i
                                        }));
                                    }

                                    underscore.each(restDataRoomsF, function (elRooms, i) {
                                        //console.log(elRooms['room']);
                                        $('.tabbable').append($('<ul/>', {
                                            id: 'listUsersBD',
                                            class: 'nav nav-tabs span8'
                                        }).append($('<li/>', {
                                            class: 'span12',
                                            id:elRooms['room']
                                        }).append($('<ul/>', {
                                            class: 'nav nav-tabs'
                                        }).append($('<li/>', {
                                            id: 'add',
                                            class: 'span6'
                                        }).append($('<a/>', {
                                            href: '#myModalDBUser',
                                            role: 'button',
                                            class: 'btn',
                                                'data-toggle': 'modal'
                                        }).append($('<img/>', {
                                            src: './icons/iconmonstr-user-11-icon-32.png'
                                        })))).append($('<li/>', {
                                            id: 'close',
                                            class: 'span5'
                                        }).append($('<a/>', {
                                            href: '#myModalCloseUser',
                                            role: 'button',
                                            class: 'btn',
                                                'data-toggle': 'modal'
                                        }).append($('<img/>', {
                                            src: './icons/iconmonstr-x-mark-4-icon-32.png'
                                        })))))).append($('<li/>').append($('<a/>', {
                                            href: '#b0.0',
                                                'data-toggle': 'tab'
                                        }).append($('<p/>', {
                                            class: 'indef'
                                        }).text(function () {
                                            return elRooms['room'];
                                        })))));
                                    });

                                    res.write(window.document.innerHTML, 'utf8');
                                    res.end();
                                } else {
                                    console.log('bad');
                                }

                            }
                        });
                    } else {
                        console.log('err render chat');
                    }
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
            }
        }
    });
});
app.post('/findUsers', function (req, res, next) {
    var searchName = req.body.searchUser;
    //console.log('searchName + ',searchName);//--> alex
    var firstSearchName = searchName.charAt(0);
    var reg = new RegExp('<[\s+]?' + searchName + '[\s+]?([^<]*)?>', 'gim');
    console.log('/^' + searchName + '/ ',typeof searchName);
    async.connectDB(function (db) {
        async.getCollection('userchat', db, function (collectionUserChat) {
            collectionUserChat.find({
                name: {
                    $regex: searchName,
                    $options: 'i'
                }
            }, function (err, rezult) {
                if (!err) {
                    rezult.toArray(function (err, docs) {
                        if (!err) {
                            //console.log('docs',docs);
                            //underscore.each(docs, function (element) {
                            res.render('chat', function (err, data) {
                                jsdom.env({
                                    html: data,
                                    scripts: ['http://code.jquery.com/jquery-1.9.1.min.js'],
                                    done: function (err, window) {
                                        var $ = window.$,
                                            Users,
                                            mUser = [];

                                        for (var key in docs) {
                                            console.log(docs[key].name);
                                            (function (index) {
                                                mUser[key] = index;
                                            })(docs[key].name);
                                        }

                                        function appendUserLi(a) {
                                            for (var p = 0; p < a.length; p++) {
                                                //console.log(mUser[p]);
                                                $('<li/>').text(a[p]).appendTo('.well');
                                            }
                                        }
                                        /*asyncCollection.parallel([
                                            function(callback){
                                                
                                            },
                                            function(callback){

                                            }
                                        ],function(err,results){

                                        });*/
                                        collectionUserChat.find({}, function (err, results) {
                                            results.toArray(function (err, docs) {
                                                eventEmitter.emit('getNameProf', docs);
                                            });
                                        });
                                        eventEmitter.on('getNameProf', function (docs) {
                                            async.connectDB(function (db) {
                                                async.getCollection('userrooms', db, function (collectionUserChat) {
                                                    collectionUserChat.find({
                                                        //name:{$ne:'general_room'}
                                                    }, function (err, rezult) {
                                                        if (!err) {
                                                            rezult.toArray(function (err, data) {
                                                                var UserDataRooms = [];
                                                                var restDataRooms = underscore.rest(data);

                                                                $('body').append($('<div/>', {
                                                                    class: 'modal',
                                                                    id: 'myModalSearch',
                                                                    tabindex: '-1',
                                                                    role: 'dialog',
                                                                        'aria-labelledby': 'myModalLabelSearch',
                                                                        'aria-hidden': 'true'
                                                                }).append($('<div/>', {
                                                                    class: 'modal-header'
                                                                }).append($('<button/>', {
                                                                    type: 'button',
                                                                    id: 'listUsersBDModalClose',
                                                                    class: 'close',
                                                                        'data-dismiss': 'modal',
                                                                        'aria-hidden': 'true'
                                                                }).text('Close')).append($('<h3/>', {
                                                                    id: 'myModalLabelSearch'
                                                                }).text('Add user'))).append($('<div/>', {
                                                                    class: 'modal-body'
                                                                }).append($('<div/>', {
                                                                    class: 'well'
                                                                }).append(function (o) {
                                                                    return $('<li/>').text(mUser.join(', '));
                                                                })).append($('<form/>').append($('<fieldset/>').append(function () {
                                                                    var $fieldset = $(this);
                                                                    for (var i = 0; i < data.length; i++) {
                                                                        //console.log(data[i].room);
                                                                        (function (index) {
                                                                            //console.log(index.room);
                                                                            return $('<label/>', {
                                                                                class: 'checkbox'
                                                                            }).append($('<input/>', {
                                                                                type: 'checkbox',
                                                                                value:index.room
                                                                            }).text(index.room)).appendTo($fieldset);
                                                                        })(data[i]);
                                                                    }
                                                                })))).append($('<div/>', {
                                                                    class: 'modal-footer'
                                                                }).append($('<button/>', {
                                                                    class: 'btn',
                                                                    id: 'listUsersBDModalAdd',
                                                                        'data-dismiss': 'modal',
                                                                        'aria-hidden': 'true'
                                                                }).text('ADD'))));

                                                                underscore.each(restDataRooms, function (elRooms, i) {
                                                                    //console.log(elRooms['room']);
                                                                    $('.tabbable').append($('<ul/>', {
                                                                        id: 'listUsersBD',
                                                                        class: 'nav nav-tabs span8'
                                                                    }).append($('<li/>', {
                                                                        class: 'span12',
                                                                        id:elRooms['room']
                                                                    }).append($('<ul/>', {
                                                                        class: 'nav nav-tabs'
                                                                    }).append($('<li/>', {
                                                                        id: 'add',
                                                                        class: 'span6'
                                                                    }).append($('<a/>', {
                                                                        href: '#myModalDBUser',
                                                                        role: 'button',
                                                                        class: 'btn',
                                                                            'data-toggle': 'modal'
                                                                    }).append($('<img/>', {
                                                                        src: './icons/iconmonstr-user-11-icon-32.png'
                                                                    })))).append($('<li/>', {
                                                                        id: 'close',
                                                                        class: 'span5'
                                                                    }).append($('<a/>', {
                                                                        href: '#myModalCloseUser',
                                                                        role: 'button',
                                                                        class: 'btn',
                                                                            'data-toggle': 'modal'
                                                                    }).append($('<img/>', {
                                                                        src: './icons/iconmonstr-x-mark-4-icon-32.png'
                                                                    })))))).append($('<li/>').append($('<a/>', {
                                                                        href: '#b0.0',
                                                                            'data-toggle': 'tab'
                                                                    }).append($('<p/>', {
                                                                        class: 'indef'
                                                                    }).text(function () {
                                                                        return elRooms['room'];
                                                                    })))));
                                                                });

                                                                underscore.each(docs, function (elementNameProf, i) {
                                                                    //console.log(elementNameProf['name']);
                                                                    $('#listUsersBD').append($('<li/>').append($('<a/>', {
                                                                        href: '#b' + i,
                                                                            'data-toggle': 'tab'
                                                                    }).append($('<p/>').text(elementNameProf['name']))
                                                                        .append($('<p/>').text(elementNameProf['prof']))));

                                                                    $('.tab-content').append($('<div/>', {
                                                                        class: 'tab-pane',
                                                                        id: 'b' + i
                                                                    }));
                                                                });

                                                                res.write(window.document.innerHTML, 'utf8');
                                                                res.end();
                                                            });
                                                        } else {
                                                            console.log('error find collectionUserChat');
                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    }
                                });
                            });
                        } else {
                            console.log('error render rezult');
                        }
                    });
                } else {
                    console.log('error find data rezult');
                }
            });
        });
    });
});

var server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8081);
io.sockets.on('connection', function (socket) {
    console.log('socket has connect');

    eventEmitter.on('rooms',function(room){
        //console.log(room);//--> work
        socket.username = dataUserChat;
        socket.room = room;
        socket.join(room);
    });

    var rooms = {};
    var general_room = 'general_room';

    async.connectDB(function (db) {
        async.getCollection('userrooms', db, function (collectionUserChat) {
            collectionUserChat.find({}, function (err, rezult) {
                if (!err) {
                    //console.log(rezult);
                    rezult.toArray(function (err, data) {
                        eventEmitter.emit('getDataRooms', data);
                        rooms = data;
                        //console.log(rooms);
                    });
                } else {
                    console.log('error find collectionUserChat');
                }
            });
        });
    });

    socket.on('getField', function (field) {
        console.log(field, " ", typeof field);
    });

    socket.on('getUser', function (text) {
        console.log(text);//--work


        async.connectDB(function (db) {
            async.getCollection('userchat', db, function (collectionUserChat) {
                collectionUserChat.find({
                    name: text
                }, function (err, rezult) {
                    if (!err) {
                        //console.log(rezult);
                        rezult.toArray(function (err, data) {
                            //console.log(data);
                            underscore.each(data, function (element) {

                                socket.emit('responseMessage', element['message'], element['data'] /*underscore.zip(element['message'],element['data'])*/ );
                            });
                        });
                    } else {
                        console.log('error find collectionUserChat');
                    }
                });
            });
        });
    });
    socket.on('requestMessage', function (message, user) {
        //console.log('**********');
        console.log(message, user);
        //console.log(typeof user);
        async.connectDB(function (db) {
            async.getCollection('userchat', db, function (collectionUserChat) {
                collectionUserChat.update({
                    name: user
                }, {
                    $push: {
                        message: message,
                        data: new Date()
                    }
                }, function (err, results) {
                    if (!err) {
                        //console.log(results);
                    } else {
                        console.log(err);
                    }
                });
            });
        });

    });
    socket.on('createRoom', function (nameRoom) {
        async.connectDB(function (db) {
            async.getCollection('userrooms', db, function (collectionRoomChat) {


                collectionRoomChat.find({}, function (err, data) {
                    if (!err) {
                        data.toArray(function (err, results) {
                            //console.log(results);
                            underscore.each();
                        });
                    } else {
                        console.log(err);
                    }
                });

                collectionRoomChat.insert({
                    room: nameRoom
                }, function (err, results) {
                    if (!err) {
                        console.log(results);
                    }
                });
            });
        });
    });

    socket.on('removeNameRoom', function (nameRoom) {
        //console.log(nameRoom);
        async.connectDB(function (db) {
            async.getCollection('userrooms', db, function (collectionRoomChat) {
                collectionRoomChat.remove({
                    room: nameRoom
                }, function (results) {
                    console.log(results);
                });
            });
        });
    });

    socket.on('sendchat', function (message) {
        io.sockets. in (socket.room).emit('updatechat', socket.username, message);
    });

    socket.on('returnNameRoom', function (nameRoom) {
        console.log(nameRoom);
        socket.emit('getReturnNameRoom', nameRoom);
    });
});

console.log("Express server has started in localhost 8081");