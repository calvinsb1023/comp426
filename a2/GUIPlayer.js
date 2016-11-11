/**
 * Created by barkerc1 on 10/23/16.
 */

var getId = function (row, column) {
    return column + row * 32;
};

var getX = function(id) {
    return Math.floor(id / 32);
};

var getY = function(id) {
    return id % 32;
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

var GUIPlayer = function(game, cli_output, map, is_player_one) {
    /**
     * Registers the player
     */
    if (is_player_one) {
        var key = game.registerPlayerOne();
        console.log(key);
        console.log(game.getPlayerOneFleet());
    } else {
        key = game.registerPlayerTwo();
    }

    map = $(map);
    cli_output = $(cli_output);


    var eventLogHandler = function(e) {
        var cli_msg = $('<div class="cli_msg"></div>');

        switch (e.event_type) {
            case SBConstants.TURN_CHANGE_EVENT:
                if (e.who == SBConstants.PLAYER_ONE) {
                    cli_msg.text("Player one's turn (count = " + game.getTurnCount() + ")");
                } else {
                    cli_msg.text("Player two's turn (count = " + game.getTurnCount() + ")");
                }
                break;
            case SBConstants.MISS_EVENT:
                cli_msg.text("Miss event at (" + e.x + ", " + e.y + ")");
                break;
            case SBConstants.HIT_EVENT:
                cli_msg.text("Hit event at (" + e.x + ", " + e.y + ")");
                break;
            case SBConstants.SHIP_SUNK_EVENT:
                var ship = e.ship;
                if (ship.isMine(key)) {
                    var pos = ship.getPosition(key);
                    cli_msg.text("Foe sunk your " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
                } else {
                    var pos = ship.getPosition(null); // This works because ship is dead.
                    cli_msg.text("You sunk their " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
                }
                break;
            case SBConstants.GAME_OVER_EVENT:
                if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
                    cli_msg.text("Game over. You win!");
                } else {
                    cli_msg.text("Game over. You lose!");
                }
                break;
        }
        cli_output.prepend(cli_msg);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
        eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT,
        eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT,
        eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
        eventLogHandler);

    /**
     * deals with drawing the map
     *
     * @param e
     */
    var mapDrawHandler = function(e) {
        for (var y = 0; y < game.getBoardSize(); y++){
            for (var x = 0; x < game.getBoardSize(); x++) {
                var sqr = game.queryLocation(key, x, y);
                var id = '#' + getId(x,y);

                //console.log(sqr.type + " " + id);

                switch (sqr.type) {
                    case "miss":
                        $(id).addClass("miss");
                        break;
                    case "p1":
                        if (sqr.state == SBConstants.OK) {
                            //$(id).addClass("friendly");
                            $(id).attr("class", "map-square friendly");

                        } else {
                            $(id).attr("class", "map-square hit");
                        }
                        break;
                    case "p2":
                        if (sqr.state == SBConstants.OK) {
                            $(id).attr("class", "map-square visible-enemy");
                        } else {
                            $(id).attr("class", "map-square hit");
                        }
                        break;
                    case "empty":
                        $(id).attr("class", "map-square visible-water");
                        break;
                    case "invisible":
                        $(id).attr("class", "map-square");
                        break;
                }
            }
        }
    };


    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
        mapDrawHandler);


    /**
     * helper functions for manipulating visual
     * @param on
     */
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

    /**
     * For user clicks
     */

    $(document).on('click', '.command-button-active', function() {
        //alert('test');
        //TODO: call the move function
        console.log('cmd button');
    });
    $(document).on('click', '.fire-ready', function() {
        var id = $('.map-square-selected').attr('id');
        //alert('test');
        //TODO: call the fire function
        var x = getX(id);
        var y = getY(id);
        game.shootAt(key, x, y);
        toggleFire(0);
        toggleSquareSelection(id, 0);
    });
    $(document).on('click', '.ship-button', function() {
        var id = "#" + this.id;
        if ($(id).hasClass('ship-button-selected')){
            toggleShipSelection(id, 0);
        } else {
            toggleShipSelection(id, 1);
        }
    });
    $(document).on('click', '.map-square', function() {
        var id = '#' + this.id;
        if($(id).hasClass('map-square-selected')) {
            toggleSquareSelection(id, 0);
        } else {
            toggleSquareSelection(id, 1);
        }
    });
};