/**
 * Created by barkerc1 on 10/23/16.
 */

var getId = function (row, column) {
    return column + row * 32;
};

var mapDrawInit = function(rows, columns) {
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

mapDrawInit(32, 32);

var toggleFire = function(on) {
    if (on == 0) {
        $('#fire-view').removeClass('fire-ready').addClass('fire-standby');
    } else {
        $('#fire-view').removeClass('fire-standby').addClass('fire-ready');
    }
};
var toggleSquareSelection = function(id, on) {
    if (on == 1) {
        $('.map-square-selected').removeClass('map-square-selected');
        $('.ship-button-selected').removeClass('ship-button-selected');
        $('.command-button-active').removeClass('command-button-active');
        $(id).addClass('map-square-selected');
        toggleFire(on);
    } else {
        $('.map-square-selected').removeClass('map-square-selected');
        toggleFire(on);
    }
};
var toggleCommandSelection = function (on) {
    if (on == 1) {
        $('.command').addClass('command-button-active');
    } else {
        $('.command-button-active').removeClass('command-button-active');
    }
};
var toggleShipSelection = function(id, on) {
    if (on == 1) {
        toggleFire(0);
        $('.ship-button-selected').removeClass('ship-button-selected');
        $(id).addClass('ship-button-selected');
        // TODO: handle changing classes of ships on the gameboard
        toggleSquareSelection(-1, 0);
        toggleCommandSelection(1);
    } else {
        $(id).removeClass('ship-button-selected');
        toggleCommandSelection(0);
    }
};

//TODO: handle map ship classes
var shipClick = function(id, on) {
    if (on == 1) {

    } else {

    }
};

$(document).ready(function () {
    $('.ship-button').click(function() {
        var id = "#" + this.id;
        if ($(id).hasClass('ship-button-selected')){
            toggleShipSelection(id, 0);
        } else {
            toggleShipSelection(id, 1);
        }
    });

    $('.map-square').click(function() {
        var id = '#' + this.id;
        if($(id).hasClass('map-square-selected')) {
            toggleSquareSelection(id, 0);
        } else {
            toggleSquareSelection(id, 1);
        }
    });

    $('.command-button-active').click(function () {
        //TODO: call the move function
    });

    $('.fire-ready').click(function() {
        //TODO: call the fire function
    });
});

