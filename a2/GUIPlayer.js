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
        //console.log(key);
        //console.log(game.getPlayerOneFleet());
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
                    var id = "#"+ship.getName();
                    $(id).addClass("ship-sunk").removeClass("ship-button").removeClass("ship-button-selected");
                    cli_msg.text("Foe sunk your " + ship.getName());
                } else {
                    cli_msg.text("You sunk their " + ship.getName() );
                }
                break;
            case SBConstants.GAME_OVER_EVENT:
                if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
                    cli_msg.text("Game over. You win!");
                    alert("Congrats! You win!")
                } else {
                    cli_msg.text("Game over. You lose!");
                    alert("Sorry! You lose.")
                }
                break;
        }
        //cli_output.empty();
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
    game.registerEventHandler(SBConstants.GAME_OVER_EVENT,
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
                    case "invisible":
                        $(id).attr("class", "map-square");
                        break;
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
                }
            }
        }
    };


    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
        mapDrawHandler);
    game.registerEventHandler(SBConstants.GAME_OVER_EVENT,
        mapDrawHandler);


    /**
     * helper functions for manipulating visuals
     */

    var toggleCommandSelection = function (on) {
        if (on == 1) {
            $('.command').addClass('command-button-active');
        } else {
            $('.command-button-active').removeClass('command-button-active');
        }
    };
    var toggleShipSelection = function(id, on) {
        if (on == 1) {
            $('.ship-button-selected').removeClass('ship-button-selected');
            $(id).addClass('ship-button-selected');
            toggleCommandSelection(1);
        } else {
            $(id).removeClass('ship-button-selected');
            toggleCommandSelection(0);
        }
    };

    /**
     * For user clicks
     */

    /**
     * Handle ship movements
     */
    var activeShip = null;
    $(document).on('click', '.command-button-active', function() {
        var id = this.id;
        console.log(this.id);

        switch (id) {
            case 'forward':
                game.moveShipForward(key, activeShip);
                break;
            case 'backward':
                game.moveShipBackward(key, activeShip);
                break;
            case 'rotate-ccw':
                game.rotateShipCCW(key, activeShip);
                break;
            case 'rotate-cw':
                game.rotateShipCW(key, activeShip);
                break;
        }
    });

    $(document).on('click', '.ship-button', function() {
        var id = "#" + this.id;
        activeShip = game.getShipByName(key, this.id);
        console.log(activeShip.getPosition(key));
        //alert(1);
        if ($(id).hasClass('ship-button-selected')){
            toggleShipSelection(id, 0);
        } else {
            toggleShipSelection(id, 1);
        }
        console.log(this.id);
    });

    /**
     * Handles firing commands
     */
    $(document).on('click', '.map-square', function() {
        var id = this.id;
        var x = getX(id);
        var y = getY(id);
        game.shootAt(key, x, y);
    });
};