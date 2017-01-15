var http = require('http'),
    express = require('express'),
    app = express(),
    jsdom = require('jsdom');

app.configure(function () {
    app.set('views',__dirname + '/views');
    app.set('view engine', 'jade');
});

app.use(express.favicon());

app.use(express.bodyParser());

app.use(express.cookieParser());

app.use(app.router);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('chat', function (err, data) {
        console.log(data);
        console.log(Object.prototype.toString.call(data));
        if (!err) {
            jsdom.env({
                url: data,
                src: ['http://code.jquery.com/jquery-1.9.1.min.js'],
                done: function (errors, window) {
                    var $ = window.$;

                    res.write(window.document.innerHTML, 'utf8');
                    res.end();
                }
            });
            /*jsdom.env({
                url: "http://news.ycombinator.com/",
                src: [jquery],
                done: function (errors, window) {
                    var $ = window.$;
                    console.log("HN Links");
                    $("td.title:not(:last) a").each(function () {
                        console.log(" -", $(this).text());
                    });
                }
            });*/
        } else {
            console.log('err render chat');
        }
    });
});
var server = require('http').createServer(app);

server.listen(8081);
console.log("Express server has started in localhost 8081");
console.log();