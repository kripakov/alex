$(document).ready(function () {
    $("#slider-range").slider({
        range: 'min',
        min: 300,
        max: 500,
        value: 310,
        slide: function (event, ui) {
            $("#amount-width").val(ui.value + " px");
            $("table").animate({
                minWidth: (ui.value) + "px"
            }, 10);
        }
    });

    $("#amount-width").text($("#slider-range").slider("value"));

    $("#slider-height").slider({
        range: 'min',
        min: 20,
        max: 30,
        value: 21,
        slide: function (event, ui) {
            $("#amount-height").val(ui.value + " px");
            $("table td").animate({
                height: (ui.value) + "px"
            }, 10);

        }
    });

    $("#toogle").hide();
    $(".content_table aside nav").hide();
    $(".gradient").click(function () {
        $("#toogle").slideToggle(150, function () {
            $("<div>").addClass("layer").appendTo("body");
        });
    });

    var w = 9,
        h = 8;
    var row, col;
    var i;

    for (i = 2; i <= w * h; i++) {
        row = Math.ceil(i / w);
        col = Math.round(i - (row - 1) * (w));
        $('.box_one ul').append("<li class='item' row=" + row + "  col=" + col + ">" + row + " : " + col + "</li>");
    }

    function each_item(item) {
        var row0, col0;
        $(item).each(function () {
            row0 = $(this).attr('row');
            col0 = $(this).attr('col');
        });
        return {
            row0: row0,
            col0: col0
        };
    }

    function show_white(row, col) {
        $('.item').each(function (ind) {
            if (each_item(this).row0 <= row && each_item(this).col0 <= col) {
                $(this).addClass("item_white");
            } else {
                $(this).removeClass("item_white");
            }
        });
    }

    $(".item").bind("mouseenter", function (event) {
        $(this).addClass("item_white");
        //$(this).append("<a class='link_create' href='#'>link</a>");
        row = $(this).attr('row');
        col = $(this).attr('col');

        show_white(row, col);

    });

    $(".item").mouseleave(function () {
        $("a").remove();
    });
    $(".content_table").bind("createTable", function () {
        var row = parseFloat(each_item(".item_white").row0),
            col = parseFloat(each_item(".item_white").col0);
        var table = $("<table/>", {
            id: "mytable"
        }).append($("<thead/>"), $("<thfoot/>"), $("<tbody/>"));

        $.fn.duplicate = function (count, cloneEvents) {
            var tmp = [];
            for (var i = 0; i < count; i++) {
                $.merge(tmp, this.clone(cloneEvents).get());
            }
            return this.pushStack(tmp);
        };
        $("<tr/>").duplicate(row).each(function (index, element) {
            $(element).append($("<td/>", {
                number: "1"
            }).duplicate(col));
            $("tbody", table).append($(element));
        });
        table.appendTo(this);
        $(".input_text").on("keyup", function () {
            var num = $(this).attr("col");
            $("#mytable tr:first").children().eq(num).text($(this).val());
        });
        editTable($("table tbody tr:not(:first)"));
    });

    function editTable(element) {      
        element.click(function () {
            $(this).addClass("backgroundCell");
            if ($(this).siblings().hasClass("backgroundCell")) {
                $(element).removeClass("backgroundCell");
            }
        });
        //editCell();
    }
    $(".item").click(function () {
        $(".content_table aside nav").show();
        $(".item").unbind("mouseenter");
        var col = parseFloat($(this).attr("col"));
        $(".box_two").prepend($("<span/>").text("Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёСЏ СЃС‚РѕР»Р±С†РѕРІ").css("font-family", "Open Sans"));
        for (var j = 0; j < col; j++) {
            $(".box_two ul").append("<input type='text' col=" + j + " class='input_text'></input>");
        }
        $(".box_two").css("z-index", "4");
        $(".box_three").css("z-index", "4");
        var child = $(".box_two ul").children();

        $(".content_table").trigger("createTable");
        eachInput(child);
        setTimeout(function () {
            $("<div>").addClass("control scrollRight").appendTo($("section:first")).click(function () {
                $(".width").animate({
                    "marginLeft": 10
                });
            });
            $("<div/>").addClass("control scrollLeft").prependTo($("section:first")).click(function () {
                $(".width").animate({
                    "marginLeft": -340
                });
            });
        }, 500);
    });
    $(".finish").click(function () {
        $(".layer").remove();
    });

    $("#add").click(function () {
        var col = parseFloat(each_item(".item_white").col0);
        $("<tr/>").duplicate(1).each(function (index, element) {
            $(element).append($("<td/>").duplicate(col));
            $("tbody").append($(element));
        });
        editTable($("table tbody tr:not(:first)"));
        editCell();
    });

    $("#remove").click(function () {
        $("tr.backgroundCell").remove();
    });

    var edit;
    var addInput = function () {
        var height = $("tr").css("height");
        var width = $("td").css("width"),
            margin = parseFloat(width),
            $this = $(this);
        if (edit) {
            finish_edit(edit);
            if (this === edit.get(0)) {
                edit = null;
                return;
            }
        }
        var $input = $("<input/>").css({ "height": height, "width": width, "margin-left": (-margin) + "px", "margin-right": (-margin) + "px" });
        $input.appendTo(this);
        edit = $this;
        $this.data("input", $input);
        callback(this);
    };
    function finish_edit(td) {
        var input = td.data("input");
        td.text(input.val());
    }
    function callback(el) {
        $(el).unbind("click", addInput);
    }
    function editCell() {
        $("td").bind("click", addInput);
    }
    function eachInput(arrow) {
        arrow.each(function (index, element) {
            $(element).click(function (event) {
                var goToNum = parseFloat($(this).attr('col'));
                removeWhite(goToNum);
            });
        });
    }

    function removeWhite(num) {
        $(".item.shadow").removeClass("shadow");
        $(".item").eq(num).addClass("shadow");
    }
});