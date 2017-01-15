var socket = io.connect("http://localhost:8081");
var field = [];
socket.on("connect", function () {
	console.log('client connect');
    socket.emit("addUserDb", function () {
        var data = ["username", "secondname", "prof"];
        $("input:text").each(function (i, e) {
            //console.log($(e).attr("name"))
            field.push($(e).attr("name"));
            //console.log(field);
            socket.emit("getField", field);
        });
    });
});
console.log('socket.js has require');