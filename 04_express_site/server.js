var path = require("path");
var url = require("url");
var fs = require("fs");
var querystring=require("querystring");
require("http").createServer(function (req, res) {
    var dir_name = __dirname + "/public";
    var path_name = url.parse(req.url).pathname;
    var folder,
    file_name;
    
    var urlparts=url.parse(req.url);
    var raw=querystring.parse(urlparts.query);
    
    console.log(raw.data);
    
    fs.readdir(dir_name, function (err, folders) {
        if (err) {
            console.log("can not dir folders");
        }
        folders.forEach(function (folders, index) {
            folder = dir_name + "/" + folders;

            //console.log(folder);

            fs.readdir(folder, function (err, file) {
                if (err) {
                    console.log("can not dir folder");
                }
                file.forEach(function (f, index) {
                    file_name = "/" + folders + "/" + f;
                    //console.log(file_name);
                    
                    if(path_name=="/"){
                        fs.readFile(dir_name + "/switch/index.html", function (err, data) {
                            if (err) {
                                console.log("can not read index.html file");
                            } else {
                                res.writeHead(200, {
                                    'Content-Type': contentType(path_name)
                                });
                                res.write(data);
                                res.end();
                            }
                        });
                    }else if (path_name == file_name) {
                        path_name = file_name;
                        fs.readFile(dir_name + path_name, function (err, data) {
                            if (err) {
                                console.log("can not read file");
                            } else {
                                res.writeHead(200, {
                                    'Content-Type': contentType(path_name)
                                });
                                res.write(data);
                                res.end();
                            }
                        });
                    }
                });
            });
        });
    });

    function contentType(path) {
        if (path.match('.js$')) {
            return "text/javascript";
        } else if (path.match('.css$')) {
            return "text/css";
        } else if (path.match('.png$')) {
            return "image/png";
        } else {
            return "text/html";
        }
    }
}).listen(8080);