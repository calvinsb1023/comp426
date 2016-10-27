/**
 * Created by barkerc1 on 10/23/16.
 */
var echoTest = function(name) {
    this.name = name;
};

var mapDraw = function(columns, rows) {
    var $row = $("<div />", {
        class: 'map-row'
    });
    var $square = $("<div />", {
        class: 'map-square'
    });

    $(document).ready(function () {
        for (var i = 0; i < rows; i++) {
            //creates temporary row object
            var $rowClone = $row.clone();
            for (var j = 0; j < columns; j++) {
                //creates temporary square with unique id that will be used for location using modular arithmetic
                var $squareClone = $square.clone();
                $squareClone.attr("id", i + (j*32));

                //when used in a jQuery click-based function...
                //this.id % 32 gives the row
                //Math.floor(this.id / 32) gives the column

                $rowClone.append($squareClone)
            }
            $("#p1-view").append($rowClone);
        }
    });
};

mapDraw(32, 32);

$(document).ready(function () {
    $('.map-square').click(function() {
        var id = '#' + this.id;

        if($(id).hasClass('map-square-selected')) {
            $(id).removeClass('map-square-selected');
            $('#fire-view').removeClass('fire-ready').addClass('fire-standby');
        } else {
            $('.map-square-selected').removeClass('map-square-selected');
            $(id).addClass('map-square-selected');
            $('#fire-view').removeClass('fire-standby').addClass('fire-ready');
        }


    });
});