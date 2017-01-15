$(document).ready(function () {
    $(".button").click(function () {
        var ids = $(".button").attr("id");
        if (ids === "0") {
            $(this).animate({
                right: "60px"
            }, 100, function () {
                $(".button").attr("id", "1");
            });
        } else if (ids === "1") {
            $(this).animate({
                right: "25px"
            }, 100, function () {
                $(".button").attr("id", "0");
            });
        }
    });
    $('#add a').click(function (argument) {
        argument.preventDefault();
        $(this).tab('show');
    });

    /*$('#add').click(function(event){
        $('<div/>',{
            class:'modal hide fade',
            id:'myModalDBUser',
            tabindex:'-1', 
            role:'dialog',
            'aria-labelledby':'myModalLabel',
            'aria-hidden':'true'
        }).append($('<div/>',{
            class:'modal-header'
        }))
        .append($('<div/>',{
            class:'modal-body'
        }))
        .append($('<div/>',{
            class:'modal-footer'
        }));
    });*/

    $('#CreateRoom').click(function (event) {
        //console.log($(this).prev('.modal-body').next('input').val());
        console.log($('#NameRoom input').val());

        var n = $('#NameRoom input').val();
        var createP = $('<p/>', {
            class: 'indef'
        }).text(n);
        var domPA = $('<li/>').append($('<a/>', {
            href: '#b0.1',
            'data-toggle': 'tab',
            class: n
        }).append(createP));

        var nodeDom = $('<li/>').append($('<a/>', {
            href: '#myModalDBUser',
            role: 'button',
            class: 'btn',
            'data-toggle': 'modal'
        }).append($('<img/>', {
            alt: '',
            src: './icons/iconmonstr-user-11-icon-32.png'
        })));

        $('.tabbable').append($('<ul/>', {
            id: 'listUsersDB',
            class: 'nav nav-tabs span8'
        }).append(nodeDom).append(domPA));

    });

    var FirstLi = $('#listUsersBD').find('li').first();
    var AllLi = $('#listUsersBD').find('li');
    $('#listUsersBD').find('li').first().find('p').click(function (e) {
        $('.tabbable').find('ul').children(function () {

        });
    });
    var thislistUsersBD;
    $('.indef').click(function (e) {
        //$('.tabbable').find('ul').find('li:not(:has(.indef))').slideToggle(300);
        var nextName = $(this).parents('ul#listUsersBD.nav.nav-tabs.span8').find('p.indef').text();
        thislistUsersBD = nextName;
        $(this).parents('.nav.nav-tabs.span8').find('li:not(:has(.indef))').slideToggle(300);
        //console.log(thislistUsersBD,'  ///');
    });

    $('li#add').click(function(){
        var nextName = $(this).parents('ul#listUsersBD.nav.nav-tabs.span8').find('p.indef').text();
        thislistUsersBD = nextName;
        console.log(thislistUsersBD,'  ///  ');
    });

    $('#myModalDBUser').click(function(element){
        var parent;
        thislistUsersBD = $(this);
        parent = $(this).parents('.nav.nav-tabs.span8');
        //console.log($(this).parents('.nav.nav-tabs.span8'));
    });

    $('#listUsersBDModalClose').click(function (event) {
        //console.log($(this).parent().parent());
        $(this).parent().parent().hide();
    });
    
    $('#listUsersBDModalAdd').click(function (event) {
    $('.modal-body li').text();
    var strNameUser = $('.modal-body li').text().split(',');
    var strNameInputRoom = $('#myModalSearch form input:checked');
        $.each(strNameInputRoom, function (i, e) {

            $('#' + $(e).val()).parents('ul#listUsersBD.nav.nav-tabs.span8').append(function () {
                var $parentUl = $(this);
                for (var p = 0; p < strNameUser.length; p++) {
                    //strNameUser[i]
                    $('<li/>',{
                        style:'display: list-item;'
                    }).bind('click',function(event){
                        event.preventDefault();
                        $(this).tab('show');
                    })
                        .append($('<a/>', {
                        href: '#b0.0',
                        'data-toggle': 'tab'
                    }).append($('<p/>', {
                        class: 'indef'
                    }).text(strNameUser[p]))).appendTo($parentUl);
                }
            });

            //$('#' + $(e).val()).parents('ul#listUsersBD.nav.nav-tabs.span8').append(createAP);
        });
    });
});

//$('.list-group').children('.list-group-item').each(function(index,element){});