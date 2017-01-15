var socket = io.connect('http://localhost:8081');

function r(k) {
    var s = [];
    for (var p = 0; p < k.length; p++) {
        (function (index) {
            s[p] = index;
        })(k[p]);
    }
    return s;
}

socket.on('connect', function () {
    var textName;
    var edit;
    var domJquery;
    var numberAttr;  
    var dom;

    $('#listUsersBD li').click(function (e) {
        textName = $(this).find('p:first').text();
        console.log(textName);
        var hrefAttr = $(this).find('a').attr('href');
        numberAttr = parseInt(hrefAttr.substr(2));
        socket.emit('getUser', textName);
        if (numberAttr) {
            $('#b' + numberAttr).text(' ');
        }
        socket.on('responseMessage', function (message, date) {
            for (var i = 0; i < message.length; i++) {

                domJquery = $('<div/>', {
                        class: 'alert alert-block'
                    }).append($('<button/>', {
                        type: 'button',
                        class: 'close',
                        'data-dismiss': 'alert'
                }).text('close')).append($('<p/>').text(message[i])).append($('<p/>').text(date[i]));
                $('#b' + numberAttr).append(domJquery);
            }
            numberAttr = null;
        });
    });

    $('#CreateRoom').click(function(){
        //console.log($('#NameRoom input').val());
        socket.emit('createRoom',$('#NameRoom input').val());
    });

    $('input:text').click(function () {
        $(this).val('');
    });

    $('li#close').click(function(event){
        console.log('work');
        var nextLiName = $(this).parents('ul#listUsersBD.nav.nav-tabs.span8').find('p.indef').text();
        $(this).parents('ul#listUsersBD.nav.nav-tabs.span8').remove();
        socket.emit('removeNameRoom',nextLiName);
    });

    $('li#add').click(function(){
        var nameRoomForRendering = $(this).parents('ul#listUsersBD.nav.nav-tabs.span8').find('p.indef').text();
        socket.emit('returnNameRoom',nameRoomForRendering);
    });

    $('#listUsersBDModalAdd').click(function(){
        console.log('work getReturnNameRoom');
        socket.on('getReturnNameRoom',function(room){
            console.log('sasa /// ',room);
        });
    });

    $('input:text').on('keydown', function (event) {
        //console.log( event.type + ": " +  event.which );
        if (event.which === 13) {
            //console.log($(this).val());//-->work
            //console.log($(this).val());
            //console.log(textName);
            socket.emit('requestMessage', $(this).val(), textName);
                $('<div/>', {
                    class: 'alert alert-block'
                }).append($('<button/>', {
                    type: 'button',
                    class: 'close',
                    'data-dismiss': 'alert'
                }).text('close')).append($('<p/>').text($(this).val())).append($('<p/>').text(new Date())).appendTo('.tab-content .active');

            $(this).val("");
            
            socket.emit('sendchat', $(this).val());
        }    
    });

    socket.on('updatechat',function(user,message){
        
    });
});
console.log('socketChat.js has require');