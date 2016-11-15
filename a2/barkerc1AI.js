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

    var eventHandler = function(e) {
		var fleet = game.getFleetByKey(key);

		//console.log(game.getFleetByKey(key));
	switch (e.event_type) {
	case SBConstants.TURN_CHANGE_EVENT:
	    if (((e.who == SBConstants.PLAYER_ONE) && is_player_one) ||
		((e.who == SBConstants.PLAYER_TWO) && (!is_player_one))) {
		{
		    setTimeout(function () {

		    	var goingToFire = false;
				var goingToMove = false;
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
				 * If the enemy isn't seen, we're going hunting for him.
				 *
				 * We'll select a random ship to randomly rotate or move forward
				 *
				 * If it isn't going to fire, it will try move a ship
				 *
				 */


				if (!goingToFire) {
					var attempt = 0;
					while (attempt < 9999) {
						//will pick a ship
						var shipKey = Math.floor(Math.random() * (4));

						/**
						 * Will pick whether to rotate or move forward.
						 * I want the ship to move forward 75% of the time for more exploration.
						 */
						var action = Math.floor(Math.random() * (3));

						if (action > 0) {
							if (game.moveShipForward(key, fleet[shipKey])) {
								console.log("movement: " + fleet[shipKey].getName());
								goingToMove = true;
								attempt = 10000;
							}
						} else {
							var rotate = Math.floor(Math.random() * (1));
							switch (rotate){
								case 0:
									if (game.rotateShipCCW(key, fleet[shipKey])) {
										console.log("rotation: " + fleet[shipKey].getName());
										attempt = 10000;
										goingToMove = true;
									}
									break;
								case 1:
									if (game.rotateShipCW(key, fleet[shipKey])) {
										console.log("rotation: " + fleet[shipKey].getName());
										attempt = 10000;
										goingToMove = true;
									}
									break;
							}

						}
					}
				}




				if (goingToFire) {
		    		game.shootAt(key, targetX, targetY);
				} else if (goingToMove) {
					/**
					 * Do nothing more
					 */
				} else {
					/**
					 * will keep generating firing targets until an invisible square is chosen so it won't waste shots
					 * or fire at itself
					 */
					while(!goingToFire) {
						console.log("random firing");
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
