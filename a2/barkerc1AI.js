var DumbAI = function(game, is_player_one, delay) {
	var key = '';
    if (is_player_one) {
		key = game.registerPlayerOne();
    } else {
		key = game.registerPlayerTwo();
    }

    var turn_delay = 0;
    if (delay != undefined) {
		turn_delay = delay;
    }


	//alert(game.getShipByName(key, "Carrier").getName());
	var needsToRotate = true;

    var eventHandler = function(e) {
		var fleet = game.getFleetByKey(key);

		console.log(game.getFleetByKey(key));
	switch (e.event_type) {
	case SBConstants.TURN_CHANGE_EVENT:
	    if (((e.who == SBConstants.PLAYER_ONE) && is_player_one) ||
		((e.who == SBConstants.PLAYER_TWO) && (!is_player_one))) {
		{
		    setTimeout(function () {

		    	var goingToFire = false;
				var goingToMove = false;
				var goingToRotate = false;
				var rotated = false;
				var targetX = 0;
				var targetY = 0;

				/**
				 * Will fire on enemy squares when they are seen
				 */
				for (var y = 0; y < game.getBoardSize(); y++){
					for (var x = 0; x < game.getBoardSize(); x++) {
						var sqr = game.queryLocation(key, x, y);
						var id = '#' + getId(x,y);

						switch (sqr.type) {
							case "p1":
								if (sqr.state == SBConstants.OK) {
									$(id).attr("class", "map-square friendly");
									targetX = x;
									targetY = y;
									goingToFire = true;
								}
								break;
						}
					}
				}


				/**
				 * early in the game, we'll need to orient the ships facing west if we can
				 */
				if (needsToRotate && !goingToFire) {
					var len = fleet.length;
					for (var i = 0; i < len; i++) {
						console.log("start of for loop");
						var dir = fleet[i].getPosition(key).direction;
						console.log(fleet[i].getName() + dir);
						if (dir == "north" || dir == "east") {
							if (game.rotateShipCCW(key, fleet[i])) {
								//console.log(fleet[i].getName());
								rotated = true;
							} else if (game.rotateShipCW(key, fleet[i])) {
								//console.log(fleet[i].getName());
								rotated = true;
							} else {
								if (game.moveShipForward(key, fleet[i])) {
									rotated = true;
								} else if (game.moveShipBackward(key, fleet[i])) {
									rotated = true;
								}
							}
						} else if (dir == "south"){
							if (game.rotateShipCW(key, fleet[i])) {
								//console.log(fleet[i].getName());
								rotated = true;
							} else if (game.rotateShipCCW(key, fleet[i])) {
								//console.log(fleet[i].getName());
								rotated = true;
							} else {
								if (game.moveShipForward(key, fleet[i])) {
									rotated = true;
								} else if (game.moveShipBackward(key, fleet[i])) {
									rotated = true;
								}
							}
						} else if (dir == "west" && i == len - 1){
							//console.log(fleet[i].getName() + "west now");
							console.log("all should be west now");
							needsToRotate = false;
						}

					}
				}

				/**
				 * If it isn't going to fire, it will move a ship
				 *
				 * Since it has the farthest sight, we'll start with the carrier and move down
				 */






				if (goingToFire) {
		    		game.shootAt(key, targetX, targetY);
				} else if (goingToMove) {

				} else if (rotated) {
					//do nothing
				} else if (goingToRotate) {

				} else {
					/**
					 * will keep generating firing targets until an invisible square is chosen so it won't waste shots
					 * or fire at itself
					 */
					while(!goingToFire) {
						console.log("random firing")
						targetX = Math.floor(Math.random() * game.getBoardSize());
						targetY = Math.floor(Math.random() * game.getBoardSize());

						var sqrTarget = game.queryLocation(key, x, y);

						switch (sqrTarget.type) {
							case "invisible":
								goingToFire = true;
								game.shootAt(key, targetX, targetY);
								break;
						}

					}
				}

		    }, turn_delay);


		}
	    }
	}
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      eventHandler);
	game.registerEventHandler(SBConstants.HIT_EVENT,
		eventHandler);
	game.registerEventHandler(SBConstants.MISS_EVENT,
		eventHandler);
	game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
		eventHandler);
	game.registerEventHandler(SBConstants.GAME_OVER_EVENT,
		eventHandler);

    this.giveUpKey = function() {
	return key;
    }
	
};
